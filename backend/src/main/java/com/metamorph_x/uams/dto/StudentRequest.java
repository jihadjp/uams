package com.metamorph_x.uams.dto;

import java.util.UUID;
import com.metamorph_x.uams.model.enums.StudentStatus;
import lombok.Data;

@Data
public class StudentRequest {
    private String name;
    private String email;
    private String password;
    private UUID programId;
    private UUID advisorId;
    private UUID batchId;
    private String guardianName;
    private String guardianPhone;
    private com.metamorph_x.uams.model.enums.GuardianRelation guardianRelation;
    private String guardianOtherRelation;
    private StudentStatus status;
    private String phone;
    private String gender;
    private String bloodGroup;
    private java.time.LocalDate dateOfBirth;
}
