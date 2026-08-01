package com.metamorph_x.uams.service;

import com.metamorph_x.uams.dto.AdminStatsResponse;
import com.metamorph_x.uams.dto.FacultyOverviewResponse;
import com.metamorph_x.uams.dto.StudentSummaryResponse;

public interface DashboardService {
    AdminStatsResponse getAdminStats();
    FacultyOverviewResponse getFacultyOverview();
    StudentSummaryResponse getStudentSummary();
}
