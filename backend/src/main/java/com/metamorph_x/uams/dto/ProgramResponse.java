package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProgramResponse {
    private UUID id;
    private UUID departmentId;
    private String departmentName;
    private String name;
    private String degreeLevel;
    private BigDecimal durationYears;
    private BigDecimal totalCredits;
}
