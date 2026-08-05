package com.metamorph_x.uams.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegistrarResponse {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String gender;
    private String bloodGroup;
    private java.time.LocalDate dateOfBirth;
    @JsonProperty("isActive")
    private boolean active;
    private LocalDateTime createdAt;
    private String temporaryPassword;
}
