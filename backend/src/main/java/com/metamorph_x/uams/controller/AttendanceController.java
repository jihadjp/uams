package com.metamorph_x.uams.controller;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.metamorph_x.uams.dto.AttendanceRequest;
import com.metamorph_x.uams.dto.AttendanceResponse;
import com.metamorph_x.uams.service.AttendanceService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR', 'FACULTY')")
    public ResponseEntity<Page<AttendanceResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(attendanceService.getAllAttendance(pageable));
    }

    @GetMapping("/offering/{offeringId}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<AttendanceResponse>> getByOffering(
            @PathVariable UUID offeringId, 
            @RequestParam LocalDate date
    ) {
        return ResponseEntity.ok(attendanceService.getAttendanceByOfferingAndDate(offeringId, date));
    }

    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<AttendanceResponse>> markBulk(@RequestBody List<AttendanceRequest> requests) {
        return ResponseEntity.ok(attendanceService.markBulkAttendance(requests));
    }

    @GetMapping("/student/{studentId}/percentage")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN')")
    public ResponseEntity<Double> getPercentage(@PathVariable UUID studentId) {
        return ResponseEntity.ok(attendanceService.getAttendancePercentage(studentId));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<AttendanceResponse>> getMyAttendance(@RequestParam UUID studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendance(studentId));
    }
}
