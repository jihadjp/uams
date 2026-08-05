package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultResponse {
    private UUID id;
    private UUID enrollmentId;
    private String studentName;
    private String courseCode;
    private String courseTitle;
    private String semesterName;
    private String examType;
    private BigDecimal marksObtained;
    private BigDecimal creditHours;
    private String grade;
    private BigDecimal gradePoint;
    private boolean isFinalResult;
    private LocalDateTime publishedAt;
}
