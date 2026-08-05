package com.metamorph_x.uams.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcademicResultResponse {
    private String studentName;
    private String programName;
    private String batch;
    private String studentId;
    private String registrationNo;
    private Double sgpa;
    private Double totalCredits;
    private List<CourseResult> courses;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseResult {
        private String courseCode;
        private String courseTitle;
        private Double credits;
        private String grade;
        private Double gradePoint;
        private boolean evaluationPending;
    }
}
