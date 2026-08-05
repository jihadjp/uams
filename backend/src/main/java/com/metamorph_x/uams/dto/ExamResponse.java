package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import com.metamorph_x.uams.model.enums.ExamType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExamResponse {
    private UUID id;
    private String courseTitle;
    private String section;
    private ExamType examType;
    private String title;
    private LocalDate examDate;
    private BigDecimal totalMarks;
    private BigDecimal weightPercent;
}
