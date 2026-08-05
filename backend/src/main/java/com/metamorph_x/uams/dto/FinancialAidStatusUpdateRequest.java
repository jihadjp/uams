package com.metamorph_x.uams.dto;

import com.metamorph_x.uams.model.enums.ApplicationStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialAidStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private ApplicationStatus status;
    private String adminRemarks;
}
