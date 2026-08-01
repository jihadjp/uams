package com.metamorph_x.uams.dto.auth;

import java.util.UUID;

import com.metamorph_x.uams.model.enums.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private UserRole role;

    // Student fields
    private String studentIdNo;
    private String batch;
    private UUID programId;
    private String admittedAt; // ISO format

    // Faculty fields
    private String employeeId;
    private String designation;
    private UUID departmentId;
    private String joinedAt; // ISO format
    private String phone;
}
