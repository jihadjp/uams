package com.metamorph_x.uams.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class SectionRequest {
    private String name;
    private UUID batchId;
}
