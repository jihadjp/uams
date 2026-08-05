package com.metamorph_x.uams.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.RegistrarRequest;
import com.metamorph_x.uams.dto.RegistrarResponse;
import com.metamorph_x.uams.exception.DuplicateResourceException;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.model.enums.UserRole;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.service.PasswordGeneratorService;
import com.metamorph_x.uams.service.RegistrarService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegistrarServiceImpl implements RegistrarService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordGeneratorService passwordGeneratorService;

    @Override
    public List<RegistrarResponse> getAllRegistrars() {
        return userRepository.findByRole(UserRole.REGISTRAR).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RegistrarResponse createRegistrar(RegistrarRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        String tempPassword = passwordGeneratorService.generateRandomPassword(10);

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(tempPassword))
                .role(UserRole.REGISTRAR)
                .phone(request.getPhone())
                .gender(request.getGender())
                .bloodGroup(request.getBloodGroup())
                .dateOfBirth(request.getDateOfBirth())
                .isActive(true)
                .isVerified(true)
                .mustChangePassword(true)
                .build();

        RegistrarResponse response = mapToResponse(userRepository.save(user));
        response.setTemporaryPassword(tempPassword);
        return response;
    }

    @Override
    @Transactional
    public RegistrarResponse updateRegistrar(UUID id, RegistrarRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registrar not found"));

        if (user.getRole() != UserRole.REGISTRAR) {
            throw new IllegalArgumentException("User is not a registrar");
        }

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setBloodGroup(request.getBloodGroup());
        user.setDateOfBirth(request.getDateOfBirth());
        if (request.getActive() != null) user.setActive(request.getActive());

        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteRegistrar(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registrar not found"));
        if (user.getRole() != UserRole.REGISTRAR) {
            throw new IllegalArgumentException("User is not a registrar");
        }
        userRepository.delete(user);
    }

    private RegistrarResponse mapToResponse(User user) {
        return RegistrarResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .gender(user.getGender())
                .bloodGroup(user.getBloodGroup())
                .dateOfBirth(user.getDateOfBirth())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
