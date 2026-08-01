package com.metamorph_x.uams.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.AttendanceRequest;
import com.metamorph_x.uams.dto.AttendanceResponse;

public interface AttendanceService {
    Page<AttendanceResponse> getAllAttendance(Pageable pageable);
    List<AttendanceResponse> getAttendanceByOfferingAndDate(UUID offeringId, LocalDate date);
    List<AttendanceResponse> markBulkAttendance(List<AttendanceRequest> requests);
    List<AttendanceResponse> getStudentAttendance(UUID studentId);
    double getAttendancePercentage(UUID studentId);
}
