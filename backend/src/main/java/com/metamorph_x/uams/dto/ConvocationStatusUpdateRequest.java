package com.metamorph_x.uams.dto;

import com.metamorph_x.uams.model.enums.ConvocationStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConvocationStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private ConvocationStatus status;
}
