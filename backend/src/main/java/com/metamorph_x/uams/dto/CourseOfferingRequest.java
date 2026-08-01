package com.metamorph_x.uams.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class CourseOfferingRequest {
    private UUID courseId;
    private UUID semesterId;
    private UUID facultyId;
    private UUID batchId;
    private UUID sectionId;
    private String scheduleInfo;
    private Integer seatLimit;
}
