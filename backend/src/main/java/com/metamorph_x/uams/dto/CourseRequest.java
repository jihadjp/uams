package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.util.UUID;
import com.metamorph_x.uams.model.enums.CourseType;
import lombok.Data;

@Data
public class CourseRequest {
    private UUID departmentId;
    private String courseCode;
    private String title;
    private BigDecimal creditHours;
    private UUID prerequisiteCourseId;
    private String description;
    private CourseType courseType;
    private Boolean isActive;
}
