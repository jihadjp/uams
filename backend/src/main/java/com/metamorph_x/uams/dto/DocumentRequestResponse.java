package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.metamorph_x.uams.model.enums.DocumentType;
import com.metamorph_x.uams.model.enums.RequestStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentRequestResponse {
    private UUID id;
    private String studentName;
    private String studentId;
    private String registrationNo;
    private String programName;
    private DocumentType documentType;
    private RequestStatus status;
    private BigDecimal feeAmount;
    @JsonProperty("isPaid")
    private boolean paid;
    private String requestNote;
    private String adminNote;
    private LocalDateTime requestedAt;
    private LocalDateTime updatedAt;
}
