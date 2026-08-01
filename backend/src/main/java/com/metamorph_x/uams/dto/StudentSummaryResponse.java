package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentSummaryResponse {
    // Banner Fields
    private String studentName;
    private String programName;
    private String studentId;    // The long 16-digit ID
    private String registrationNo;  // The formatted ID (e.g., 242-15-319)
    private String email;
    private LocalDate dob;
    private String mobile;
    private String gender;
    private String bloodGroup;
    private String campus;
    private String profileImage;

    // Stat Fields
    private BigDecimal cgpa;
    private long enrolledCourses;
    private double attendancePercent;
    private String feeStatus;
    
    @JsonProperty("isRegistrationCleared")
    private boolean isRegistrationCleared;

    // Chart Data
    private List<SemesterGpa> semesterResults;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SemesterGpa {
        private String semesterName;
        private double gpa;
    }
}
