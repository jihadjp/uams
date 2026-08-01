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
public class AdminStatsResponse {
    private long totalStudents;
    private long totalFaculty;
    private long totalCourses;
    private long totalDepartments;
    private List<DepartmentStats> studentsByDepartment;
    private List<StatusStats> studentStatusDistribution;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DepartmentStats {
        private String name;
        private long students;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StatusStats {
        private String name;
        private long value;
        private String color;
    }
}
