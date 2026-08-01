package com.metamorph_x.uams.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metamorph_x.uams.dto.AcademicCalendarRequest;
import com.metamorph_x.uams.dto.AcademicCalendarResponse;
import com.metamorph_x.uams.service.AcademicCalendarService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/academic-calendar")
@RequiredArgsConstructor
public class AcademicCalendarController {

    private final AcademicCalendarService calendarService;

    @GetMapping("/{semesterId}")
    public ResponseEntity<AcademicCalendarResponse> getBySemester(@PathVariable UUID semesterId) {
        return ResponseEntity.ok(calendarService.getCalendarBySemester(semesterId));
    }

    @PostMapping("/{semesterId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<AcademicCalendarResponse> saveCalendar(
            @PathVariable UUID semesterId,
            @RequestBody AcademicCalendarRequest request
    ) {
        return ResponseEntity.ok(calendarService.saveCalendar(semesterId, request));
    }
}
