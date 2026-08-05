package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialAidApplicationRequest {
    @NotNull(message = "Circular ID is required")
    private UUID circularId;

    @NotBlank(message = "Justification is required")
    private String justification;

    private BigDecimal monthlyIncome;
}
