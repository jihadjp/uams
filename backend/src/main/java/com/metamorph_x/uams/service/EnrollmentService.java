package com.metamorph_x.uams.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.EnrollmentRequest;
import com.metamorph_x.uams.dto.EnrollmentResponse;

public interface EnrollmentService {
    Page<EnrollmentResponse> getAllEnrollments(Pageable pageable);
    Page<EnrollmentResponse> getEnrollmentsByOffering(UUID offeringId, Pageable pageable);
    List<EnrollmentResponse> getMyEnrollments(UUID studentId);
    List<EnrollmentResponse> getMyEnrollments(UUID studentId, UUID semesterId);
    EnrollmentResponse registerCourse(EnrollmentRequest request);
    List<EnrollmentResponse> registerCoursesBulk(com.metamorph_x.uams.dto.BulkEnrollmentRequest request);
    EnrollmentResponse dropCourse(UUID enrollmentId);
    void deleteEnrollment(UUID id);
}
