package com.metamorph_x.uams.dto;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacultyOverviewResponse {
    private long myCourses;
    private long totalStudents;
    private long pendingResults;
    private long todayClasses;

    private List<CourseSummary> activeCourses;
    private List<ScheduleItem> todaySchedule;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CourseSummary {
        private UUID id;
        private String code;
        private String title;
        private String section;
        private long studentCount;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ScheduleItem {
        private String time;
        private String course;
        private String room;
    }
}
