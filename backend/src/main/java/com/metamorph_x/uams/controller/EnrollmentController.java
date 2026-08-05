package com.metamorph_x.uams.controller;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.metamorph_x.uams.dto.EnrollmentRequest;
import com.metamorph_x.uams.dto.EnrollmentResponse;
import com.metamorph_x.uams.service.EnrollmentService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR', 'FACULTY')")
    public ResponseEntity<Page<EnrollmentResponse>> getAll(
            Pageable pageable,
            @RequestParam(required = false) UUID offeringId
    ) {
        if (offeringId != null) {
            return ResponseEntity.ok(enrollmentService.getEnrollmentsByOffering(offeringId, pageable));
        }
        return ResponseEntity.ok(enrollmentService.getAllEnrollments(pageable));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN', 'FACULTY')")
    public ResponseEntity<List<EnrollmentResponse>> getMy(
            @RequestParam UUID studentId,
            @RequestParam(required = false) UUID semesterId
    ) {
        if (semesterId != null) {
            return ResponseEntity.ok(enrollmentService.getMyEnrollments(studentId, semesterId));
        }
        return ResponseEntity.ok(enrollmentService.getMyEnrollments(studentId));
    }

    @PostMapping("/register")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN', 'REGISTRAR', 'FACULTY')")
    public ResponseEntity<EnrollmentResponse> register(@RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.registerCourse(request));
    }

    @PostMapping("/register-bulk")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN', 'REGISTRAR', 'FACULTY')")
    public ResponseEntity<List<EnrollmentResponse>> registerBulk(@RequestBody com.metamorph_x.uams.dto.BulkEnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.registerCoursesBulk(request));
    }

    @PostMapping("/{id}/drop")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN', 'REGISTRAR', 'FACULTY')")
    public ResponseEntity<EnrollmentResponse> drop(@PathVariable UUID id) {
        return ResponseEntity.ok(enrollmentService.dropCourse(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }
}
