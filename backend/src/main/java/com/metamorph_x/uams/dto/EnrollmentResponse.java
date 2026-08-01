package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.metamorph_x.uams.model.enums.EnrollmentStatus;
import com.metamorph_x.uams.model.enums.EnrollmentType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EnrollmentResponse {
    private UUID id;
    private UUID offeringId;
    private String studentName;
    private String courseCode;
    private String courseTitle;
    private BigDecimal creditHours;
    private String section;
    private String facultyName;
    private EnrollmentStatus status;
    private EnrollmentType enrollmentType;
    private LocalDateTime enrolledAt;
}
