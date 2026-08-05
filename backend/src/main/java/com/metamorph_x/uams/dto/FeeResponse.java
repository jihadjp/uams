package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import com.metamorph_x.uams.model.enums.FeeStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeeResponse {
    private UUID id;
    private String studentName;
    private String semesterName;
    private BigDecimal registrationFee;
    private BigDecimal creditFee;
    private BigDecimal amountDue;
    private BigDecimal amountPaid;
    private FeeStatus status;
    private LocalDate dueDate;
}
