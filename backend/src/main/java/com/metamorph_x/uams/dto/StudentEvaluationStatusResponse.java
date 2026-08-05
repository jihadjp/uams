package com.metamorph_x.uams.dto;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentEvaluationStatusResponse {
    private UUID offeringId;
    private String courseCode;
    private String courseTitle;
    private String facultyName;
    private boolean submitted;
}
