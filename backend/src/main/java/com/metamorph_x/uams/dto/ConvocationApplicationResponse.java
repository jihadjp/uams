package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.metamorph_x.uams.model.enums.ConvocationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConvocationApplicationResponse {
    private UUID id;
    private UUID studentInternalId;
    private String studentName;
    private String studentId;
    private String registrationNo;
    private String programName;
    private String profileImage;
    private BigDecimal cgpa;
    private BigDecimal creditsCompleted;
    private Integer convocationYear;
    private String gownSize;
    private Integer guestCount;
    private BigDecimal feeAmount;
    @JsonProperty("isPaid")
    private boolean paid;
    private ConvocationStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
