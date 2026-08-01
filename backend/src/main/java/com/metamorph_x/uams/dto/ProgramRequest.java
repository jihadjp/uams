package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;

@Data
public class ProgramRequest {
    private UUID departmentId;
    private String name;
    private String degreeLevel;
    private BigDecimal durationYears;
    private BigDecimal totalCredits;
}
