package com.metamorph_x.uams.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class DepartmentRequest {
    private String name;
    private String code;
    private String deptNumber;
    private UUID headFacultyId;
}
