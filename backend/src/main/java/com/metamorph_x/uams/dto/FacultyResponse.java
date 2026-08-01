package com.metamorph_x.uams.dto;

import java.time.LocalDate;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FacultyResponse {
    private UUID id;
    private String name;
    private String email;
    private String employeeId;
    private String departmentName;
    private String designation;
    private String phone;
    private LocalDate joinedAt;
    private String temporaryPassword;
    private String profileImage;
    private long currentTeachingLoad;
}
