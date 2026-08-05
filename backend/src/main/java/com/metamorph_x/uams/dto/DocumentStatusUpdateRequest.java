package com.metamorph_x.uams.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.metamorph_x.uams.model.enums.RequestStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DocumentStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private RequestStatus status;
    
    private String adminNote;
    
    @NotNull(message = "Payment status is required")
    @JsonProperty("isPaid")
    private Boolean paid;
}
