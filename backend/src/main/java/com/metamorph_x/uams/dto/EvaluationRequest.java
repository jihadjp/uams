package com.metamorph_x.uams.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationRequest {
    @NotNull(message = "Student ID is required")
    private UUID studentId;
    
    @NotNull(message = "Offering ID is required")
    private UUID offeringId;

    @Min(1) @Max(5)
    private int q1;
    @Min(1) @Max(5)
    private int q2;
    @Min(1) @Max(5)
    private int q3;
    @Min(1) @Max(5)
    private int q4;
    @Min(1) @Max(5)
    private int q5;
    @Min(1) @Max(5)
    private int q6;
    @Min(1) @Max(5)
    private int q7;
    @Min(1) @Max(5)
    private int q8;
    @Min(1) @Max(5)
    private int q9;
    @Min(1) @Max(5)
    private int q10;

    private String comments;
}
