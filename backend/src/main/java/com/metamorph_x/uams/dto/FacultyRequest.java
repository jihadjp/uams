package com.metamorph_x.uams.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class FacultyRequest {
    private String name;
    private String email;
    private String password;
    private UUID departmentId;
    private String employeeId;
    private String designation;
    private String phone;
}
