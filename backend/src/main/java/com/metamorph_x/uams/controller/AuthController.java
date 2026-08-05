package com.metamorph_x.uams.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metamorph_x.uams.dto.auth.LoginRequest;
import com.metamorph_x.uams.dto.auth.LoginResponse;
import com.metamorph_x.uams.dto.auth.RegisterRequest;
import com.metamorph_x.uams.dto.auth.ChangePasswordRequest;
import com.metamorph_x.uams.dto.auth.PasswordResetResponse;
import com.metamorph_x.uams.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return authService.changePassword(email, request);
    }

    @PostMapping("/reset-password/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<PasswordResetResponse> resetPassword(@PathVariable UUID userId) {
        return ResponseEntity.ok(authService.resetUserPassword(userId));
    }
}
