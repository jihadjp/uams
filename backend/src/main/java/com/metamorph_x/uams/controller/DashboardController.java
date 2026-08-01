package com.metamorph_x.uams.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metamorph_x.uams.dto.AdminStatsResponse;
import com.metamorph_x.uams.dto.FacultyOverviewResponse;
import com.metamorph_x.uams.dto.StudentSummaryResponse;
import com.metamorph_x.uams.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin/dashboard/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<AdminStatsResponse> getAdminStats() {
        return ResponseEntity.ok(dashboardService.getAdminStats());
    }

    @GetMapping("/faculty/dashboard/overview")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<FacultyOverviewResponse> getFacultyOverview() {
        return ResponseEntity.ok(dashboardService.getFacultyOverview());
    }

    @GetMapping("/student/dashboard/summary")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentSummaryResponse> getStudentSummary() {
        return ResponseEntity.ok(dashboardService.getStudentSummary());
    }
}
