package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import com.metamorph_x.uams.model.enums.FeeStatus;
import lombok.Data;

@Data
public class FeeRequest {
    private UUID studentId;
    private UUID semesterId;
    private BigDecimal amountDue;
    private LocalDate dueDate;
    private FeeStatus status;
}
