package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import com.metamorph_x.uams.model.enums.ExamType;
import lombok.Data;

@Data
public class ExamRequest {
    private UUID offeringId;
    private ExamType examType;
    private String title;
    private LocalDate examDate;
    private BigDecimal totalMarks;
    private BigDecimal weightPercent;
}
