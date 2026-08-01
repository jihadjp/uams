package com.metamorph_x.uams.dto;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SectionResponse {
    private UUID id;
    private String name;
    private UUID batchId;
}
