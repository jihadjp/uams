package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.metamorph_x.uams.model.enums.ApplicationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialAidApplicationResponse {
    private UUID id;
    private UUID studentId;
    private String studentName;
    private String registrationNo;
    private UUID circularId;
    private String circularTitle;
    private String justification;
    private BigDecimal monthlyIncome;
    private ApplicationStatus status;
    private String adminRemarks;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
