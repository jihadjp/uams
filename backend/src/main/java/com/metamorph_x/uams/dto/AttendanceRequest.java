package com.metamorph_x.uams.dto;

import java.time.LocalDate;
import java.util.UUID;
import com.metamorph_x.uams.model.enums.AttendanceStatus;
import lombok.Data;

@Data
public class AttendanceRequest {
    private UUID enrollmentId;
    private LocalDate classDate;
    private AttendanceStatus status;
}
