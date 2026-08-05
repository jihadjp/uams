package com.metamorph_x.uams.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import lombok.Data;

@Data
public class RegistrarRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String gender;
    private String bloodGroup;
    private LocalDate dateOfBirth;
    @JsonProperty("isActive")
    private Boolean active;
}
