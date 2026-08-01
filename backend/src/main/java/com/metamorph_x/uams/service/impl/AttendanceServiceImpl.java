package com.metamorph_x.uams.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.AttendanceRequest;
import com.metamorph_x.uams.dto.AttendanceResponse;
import com.metamorph_x.uams.model.Attendance;
import com.metamorph_x.uams.model.Enrollment;
import com.metamorph_x.uams.model.enums.AttendanceStatus;
import com.metamorph_x.uams.repository.AttendanceRepository;
import com.metamorph_x.uams.repository.EnrollmentRepository;
import com.metamorph_x.uams.service.AttendanceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public Page<AttendanceResponse> getAllAttendance(Pageable pageable) {
        return attendanceRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public List<AttendanceResponse> getAttendanceByOfferingAndDate(UUID offeringId, LocalDate date) {
        return attendanceRepository.findByEnrollment_Offering_IdAndClassDate(offeringId, date).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponse> getStudentAttendance(UUID studentId) {
        return attendanceRepository.findByEnrollment_Student_Id(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AttendanceResponse> markBulkAttendance(List<AttendanceRequest> requests) {
        return requests.stream().map(request -> {
            Enrollment enrollment = enrollmentRepository.findById(request.getEnrollmentId())
                    .orElseThrow(() -> new RuntimeException("Enrollment not found"));

            Attendance attendance = attendanceRepository.findByEnrollmentAndClassDate(enrollment, request.getClassDate())
                    .orElse(Attendance.builder()
                            .enrollment(enrollment)
                            .classDate(request.getClassDate())
                            .build());

            attendance.setStatus(request.getStatus());
            return mapToResponse(attendanceRepository.save(attendance));
        }).collect(Collectors.toList());
    }

    @Override
    public double getAttendancePercentage(UUID studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        if (enrollments.isEmpty()) return 0.0;

        long totalClasses = attendanceRepository.countByEnrollmentIn(enrollments);
        if (totalClasses == 0) return 0.0;

        long presentClasses = attendanceRepository.countByEnrollmentInAndStatus(enrollments, AttendanceStatus.PRESENT);
        return (double) presentClasses / totalClasses * 100;
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentName(attendance.getEnrollment().getStudent().getUser().getName())
                .classDate(attendance.getClassDate())
                .status(attendance.getStatus())
                .build();
    }
}
