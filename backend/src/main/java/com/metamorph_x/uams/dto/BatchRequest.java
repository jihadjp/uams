package com.metamorph_x.uams.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class BatchRequest {
    private String batchNumber;
    private UUID programId;
}
