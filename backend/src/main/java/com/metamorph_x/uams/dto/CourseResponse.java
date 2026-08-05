package com.metamorph_x.uams.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.metamorph_x.uams.model.enums.CourseType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CourseResponse {
    private UUID id;
    private UUID departmentId;
    private String departmentName;
    private String courseCode;
    private String title;
    private BigDecimal creditHours;
    private String prerequisiteCourseCode;
    private String description;
    private CourseType courseType;
    @JsonProperty("isActive")
    private boolean isActive;
    private LocalDateTime updatedAt;
}
