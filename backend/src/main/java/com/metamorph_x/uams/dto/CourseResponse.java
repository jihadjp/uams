package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.metamorph_x.uams.model.enums.CourseType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseResponse {
    private UUID id;
    private String departmentName;
    private String courseCode;
    private String title;
    private BigDecimal creditHours;
    private String prerequisiteCourseCode;
    private String description;
    private CourseType courseType;
    private boolean isActive;
    private LocalDateTime updatedAt;
}
