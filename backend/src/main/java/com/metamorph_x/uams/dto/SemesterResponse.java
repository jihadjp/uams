package com.metamorph_x.uams.dto;

import java.time.LocalDate;
import java.util.UUID;
import com.metamorph_x.uams.model.enums.SemesterStatus;
import com.metamorph_x.uams.model.enums.SemesterTerm;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SemesterResponse {
    private UUID id;
    private String name;
    private SemesterTerm term;
    private Integer academicYear;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate registrationDeadline;
    private LocalDate addDropDeadline;
    private LocalDate gradeDeadline;
    private SemesterStatus status;
    private boolean active; // UI compatibility
}
