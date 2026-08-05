package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BatchSemesterFeeResponse {
    private UUID id;
    private UUID batchId;
    private String batchNumber;
    private UUID semesterId;
    private String semesterName;
    private BigDecimal registrationFee;
}
