package com.metamorph_x.uams.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialAidCircularResponse {
    private UUID id;
    private String title;
    private String description;
    private String eligibilityCriteria;
    private String benefitDetails;
    private LocalDate deadline;
    private boolean isActive;
    private LocalDateTime createdAt;
}
