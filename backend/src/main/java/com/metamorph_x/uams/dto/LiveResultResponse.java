package com.metamorph_x.uams.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveResultResponse {
    private UUID enrollmentId;
    private String courseCode;
    private String courseTitle;
    private BigDecimal credits;
    private String section;
    private String teacherName;
    private String studentName;
    private String studentId;
    private String registrationNo;
    
    private BigDecimal attendancePercentage;
    private BigDecimal attendanceMarks;
    private BigDecimal quiz1;
    private BigDecimal quiz2;
    private BigDecimal quiz3;
    private BigDecimal quizAverage;
    private BigDecimal presentation;
    private BigDecimal assignment;
    private BigDecimal midterm;
    private BigDecimal midtermImprovement;
    private BigDecimal finalExam;
    
    // Lab Specific
    private BigDecimal projectShow;
    private BigDecimal labReport;
    private BigDecimal labEvaluation;

    private String courseType; // THEORY or LAB
}
