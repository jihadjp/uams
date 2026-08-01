package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;

@Data
public class ResultRequest {
    private UUID enrollmentId;
    private UUID examId;
    private BigDecimal marksObtained;
    private String grade;
    private BigDecimal gradePoint;
    private boolean isFinalResult;
}
