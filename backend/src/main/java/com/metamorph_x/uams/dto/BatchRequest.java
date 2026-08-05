package com.metamorph_x.uams.dto;

import java.util.UUID;
import com.metamorph_x.uams.model.enums.SemesterTerm;
import lombok.Data;

@Data
public class BatchRequest {
    private String batchNumber;
    private Integer admissionYear;
    private SemesterTerm term;
    private UUID programId;
}
