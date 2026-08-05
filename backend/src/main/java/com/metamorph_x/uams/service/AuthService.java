package com.metamorph_x.uams.service;

import org.springframework.http.ResponseEntity;
import com.metamorph_x.uams.dto.auth.LoginRequest;
import com.metamorph_x.uams.dto.auth.LoginResponse;
import com.metamorph_x.uams.dto.auth.RegisterRequest;
import com.metamorph_x.uams.dto.auth.ChangePasswordRequest;

public interface AuthService {
    ResponseEntity<LoginResponse> login(LoginRequest request);
    ResponseEntity<?> register(RegisterRequest request);
    ResponseEntity<Void> changePassword(String email, ChangePasswordRequest request);
    com.metamorph_x.uams.dto.auth.PasswordResetResponse resetUserPassword(java.util.UUID userId);
}
