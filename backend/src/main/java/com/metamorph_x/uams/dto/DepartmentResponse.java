package com.metamorph_x.uams.dto;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentResponse {
    private UUID id;
    private String name;
    private String code;
    private String deptNumber;
    private String headFacultyName;
    private long totalFaculty;
    private long totalStudents;
}
