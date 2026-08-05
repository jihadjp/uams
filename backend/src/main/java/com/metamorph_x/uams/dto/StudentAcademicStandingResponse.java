package com.metamorph_x.uams.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class StudentAcademicStandingResponse {
    private BigDecimal cgpa;
    private BigDecimal totalCreditsCompleted;
    private BigDecimal requiredCredits;
}
