package com.metamorph_x.uams.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.metamorph_x.uams.model.enums.CourseType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CourseRequest {
    private UUID departmentId;
    private String courseCode;
    private String title;
    private BigDecimal creditHours;
    private UUID prerequisiteCourseId;
    private String description;
    private CourseType courseType;
    @JsonProperty("isActive")
    private Boolean isActive;
}
