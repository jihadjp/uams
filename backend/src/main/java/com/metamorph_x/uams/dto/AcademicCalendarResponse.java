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
public class AcademicCalendarResponse {
    private UUID id;
    private UUID semesterId;
    private String semesterName;
    private Integer academicYear;
    private String duration;
    private List<EventDto> events;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EventDto {
        private String title;
        private String dateValue;
    }
}
