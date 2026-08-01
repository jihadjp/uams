package com.metamorph_x.uams.dto;

import java.util.UUID;
import com.metamorph_x.uams.model.enums.EnrollmentType;
import lombok.Data;

@Data
public class EnrollmentRequest {
    private UUID studentId;
    private UUID offeringId;
    private EnrollmentType enrollmentType;
}
