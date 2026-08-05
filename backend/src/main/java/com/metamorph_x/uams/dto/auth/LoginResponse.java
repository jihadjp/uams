package com.metamorph_x.uams.dto.auth;

import java.util.UUID;

import com.metamorph_x.uams.model.enums.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private UserRole role;
    private UUID userId;
    private String name;
    private String profileImage;
    private boolean mustChangePassword;
}
