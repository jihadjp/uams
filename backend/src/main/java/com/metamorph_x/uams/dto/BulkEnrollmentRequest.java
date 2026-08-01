package com.metamorph_x.uams.dto;

import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class BulkEnrollmentRequest {
    private UUID studentId;
    private List<UUID> offeringIds;
}
