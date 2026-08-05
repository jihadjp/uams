package com.metamorph_x.uams.service.impl;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.auth.LoginRequest;
import com.metamorph_x.uams.dto.auth.LoginResponse;
import com.metamorph_x.uams.dto.auth.RegisterRequest;
import com.metamorph_x.uams.dto.auth.ChangePasswordRequest;
import com.metamorph_x.uams.dto.auth.PasswordResetResponse;
import com.metamorph_x.uams.exception.DuplicateResourceException;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.model.enums.UserRole;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.security.JwtUtil;
import com.metamorph_x.uams.service.AuthService;
import com.metamorph_x.uams.service.PasswordGeneratorService;

import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final PasswordGeneratorService passwordGeneratorService;

    @Override
    public ResponseEntity<LoginResponse> login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        // SecurityContextHolder usually holds the email as principal from CustomUserDetailsService
        String principalEmail = ((UserDetails) authentication.getPrincipal()).getUsername();

        User user = userRepository.findByEmail(principalEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principalEmail));

        String token = jwtUtil.generateToken((UserDetails) authentication.getPrincipal());

        return ResponseEntity.ok(LoginResponse.builder()
                .token(token)
                .role(user.getRole())
                .userId(user.getId())
                .name(user.getName())
                .profileImage(user.getProfileImage())
                .mustChangePassword(user.isMustChangePassword())
                .build());
    }

    @Override
    @Transactional
    public ResponseEntity<Void> changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @Override
    @Transactional
    public ResponseEntity<?> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already taken: " + request.getEmail());
        }

        // Default role to STUDENT if not provided or to simplify registration
        UserRole role = request.getRole() != null ? request.getRole() : UserRole.STUDENT;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isActive(true)
                .isVerified(false)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully. Please login to complete your profile.");
    }

    @Override
    @Transactional
    public PasswordResetResponse resetUserPassword(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String tempPassword = passwordGeneratorService.generateRandomPassword(10);
        user.setPasswordHash(passwordEncoder.encode(tempPassword));
        user.setMustChangePassword(true);
        userRepository.save(user);

        return PasswordResetResponse.builder()
                .temporaryPassword(tempPassword)
                .build();
    }
}
