package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;

@Data
public class BatchSemesterFeeRequest {
    private UUID batchId;
    private UUID semesterId;
    private BigDecimal registrationFee;
}
