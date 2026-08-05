package com.metamorph_x.uams.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConvocationApplicationRequest {
    @NotNull(message = "Convocation year is required")
    private Integer convocationYear;

    @NotBlank(message = "Gown size is required")
    private String gownSize;

    @Min(value = 0, message = "Guest count cannot be negative")
    private Integer guestCount;

    @NotNull(message = "CGPA is required")
    private BigDecimal cgpa;

    @NotNull(message = "Completed credits are required")
    private BigDecimal creditsCompleted;
}
