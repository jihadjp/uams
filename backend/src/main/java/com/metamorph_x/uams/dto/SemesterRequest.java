package com.metamorph_x.uams.dto;

import java.time.LocalDate;
import com.metamorph_x.uams.model.enums.SemesterStatus;
import com.metamorph_x.uams.model.enums.SemesterTerm;
import lombok.Data;

@Data
public class SemesterRequest {
    private SemesterTerm term;
    private Integer academicYear;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate registrationDeadline;
    private LocalDate addDropDeadline;
    private LocalDate gradeDeadline;
    private SemesterStatus status;
}
