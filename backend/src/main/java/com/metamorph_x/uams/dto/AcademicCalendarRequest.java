package com.metamorph_x.uams.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcademicCalendarRequest {
    private Integer academicYear;
    private String duration;
    private List<EventRequest> events;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EventRequest {
        private String title;
        private String dateValue;
        private Integer orderIndex;
    }
}
