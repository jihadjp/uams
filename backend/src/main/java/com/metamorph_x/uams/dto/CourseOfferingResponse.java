package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseOfferingResponse {
    private UUID id;
    private String courseCode;
    private String courseTitle;
    private BigDecimal creditHours;
    private String semesterName;
    private String facultyName;
    private UUID courseId;
    private UUID semesterId;
    private UUID facultyId;

    private UUID departmentId;
    private String departmentName;

    private UUID batchId;
    private String targetBatch; // String representation for UI compatibility
    private UUID sectionId;
    private String section;     // String representation for UI compatibility
    
    private String scheduleInfo;
    private Integer seatLimit;
    private long enrolledCount;
}
