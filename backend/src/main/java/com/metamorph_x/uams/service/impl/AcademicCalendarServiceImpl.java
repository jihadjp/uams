package com.metamorph_x.uams.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.AcademicCalendarRequest;
import com.metamorph_x.uams.dto.AcademicCalendarResponse;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.AcademicCalendar;
import com.metamorph_x.uams.model.CalendarEvent;
import com.metamorph_x.uams.model.Semester;
import com.metamorph_x.uams.repository.AcademicCalendarRepository;
import com.metamorph_x.uams.repository.SemesterRepository;
import com.metamorph_x.uams.service.AcademicCalendarService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AcademicCalendarServiceImpl implements AcademicCalendarService {

    private final AcademicCalendarRepository calendarRepository;
    private final SemesterRepository semesterRepository;

    private static final List<String> DEFAULT_TITLES = List.of(
            "Advising & Registration",
            "Orientation Program (Newly Admitted Students)",
            "Classes Start",
            "Eid-Al-Fitr Vacation*",
            "Mid-Examination",
            "Eid-Al-Adha Vacation*",
            "Preparatory Leave",
            "Final Examination",
            "Last Date of Grade Submission",
            "Publication of Semester Results"
    );

    @Override
    public AcademicCalendarResponse getCalendarBySemester(UUID semesterId) {
        AcademicCalendar calendar = calendarRepository.findBySemesterId(semesterId).orElse(null);

        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found with id: " + semesterId));

        if (calendar == null) {
            // Return empty structure with default titles to guide Admin
            return AcademicCalendarResponse.builder()
                    .semesterId(semester.getId())
                    .semesterName(semester.getName())
                    .events(DEFAULT_TITLES.stream()
                            .map(t -> new AcademicCalendarResponse.EventDto(t, null))
                            .collect(Collectors.toList()))
                    .build();
        }

        return mapToResponse(calendar, false);
    }

    // For student view (filtered)
    public AcademicCalendarResponse getPublicCalendar(UUID semesterId) {
        return calendarRepository.findBySemesterId(semesterId)
                .map(c -> mapToResponse(c, true))
                .orElse(null);
    }

    @Override
    @Transactional
    public AcademicCalendarResponse saveCalendar(UUID semesterId, AcademicCalendarRequest request) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));

        AcademicCalendar calendar = calendarRepository.findBySemesterId(semesterId)
                .orElseGet(() -> AcademicCalendar.builder().semester(semester).build());

        calendar.setAcademicYear(request.getAcademicYear());
        calendar.setDuration(request.getDuration());

        // Clear existing and re-add from request
        calendar.getEvents().clear();

        if (request.getEvents() != null) {
            for (int i = 0; i < request.getEvents().size(); i++) {
                AcademicCalendarRequest.EventRequest eReq = request.getEvents().get(i);
                calendar.getEvents().add(CalendarEvent.builder()
                        .calendar(calendar)
                        .title(eReq.getTitle())
                        .dateValue(eReq.getDateValue())
                        .orderIndex(eReq.getOrderIndex() != null ? eReq.getOrderIndex() : i)
                        .build());
            }
        }

        AcademicCalendar saved = calendarRepository.save(calendar);
        return mapToResponse(saved, false);
    }

    private AcademicCalendarResponse mapToResponse(AcademicCalendar calendar, boolean filterEmpty) {
        List<AcademicCalendarResponse.EventDto> eventDtos = calendar.getEvents().stream()
                .filter(e -> !filterEmpty || (e.getDateValue() != null && !e.getDateValue().trim().isEmpty()))
                .map(e -> AcademicCalendarResponse.EventDto.builder()
                        .title(e.getTitle())
                        .dateValue(e.getDateValue())
                        .build())
                .collect(Collectors.toList());

        return AcademicCalendarResponse.builder()
                .id(calendar.getId())
                .semesterId(calendar.getSemester().getId())
                .semesterName(calendar.getSemester().getName())
                .academicYear(calendar.getAcademicYear())
                .duration(calendar.getDuration())
                .events(eventDtos)
                .build();
    }
}
