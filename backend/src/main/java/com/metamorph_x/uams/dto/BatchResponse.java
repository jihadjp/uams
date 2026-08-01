package com.metamorph_x.uams.dto;

import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BatchResponse {
    private UUID id;
    private String batchNumber;
    private UUID programId;
    private String programName;
    private List<SectionResponse> sections;
}
