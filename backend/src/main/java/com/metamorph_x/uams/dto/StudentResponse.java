package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.metamorph_x.uams.model.enums.StudentStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentResponse {
    private UUID id;
    private String name;
    private String email;
    private String studentId;
    private String registrationNo;
    private UUID programId;
    private String programName;
    private UUID advisorId;
    private String advisorName;
    private String guardianName;
    private String guardianPhone;
    private com.metamorph_x.uams.model.enums.GuardianRelation guardianRelation;
    private String guardianOtherRelation;
    private UUID batchId;
    private String batch;
    private Integer currentSemester;
    private BigDecimal cgpa;
    
    @JsonProperty("isRegistrationCleared")
    private boolean isRegistrationCleared;

    @JsonProperty("hasReceivedLaptop")
    private boolean hasReceivedLaptop;

    private StudentStatus status;
    private LocalDate admittedAt;
    private String phone;
    private String gender;
    private String bloodGroup;
    private String profileImage;
    private java.time.LocalDate dateOfBirth;
    private String temporaryPassword;
}
