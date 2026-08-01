package com.metamorph_x.uams.dto;

import java.time.LocalDate;
import java.util.UUID;
import com.metamorph_x.uams.model.enums.AttendanceStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttendanceResponse {
    private UUID id;
    private String studentName;
    private LocalDate classDate;
    private AttendanceStatus status;
}
