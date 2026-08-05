package com.metamorph_x.uams.controller;

import java.util.List;
import java.util.UUID;

import com.metamorph_x.uams.model.CourseOffering;
import com.metamorph_x.uams.model.Faculty;
import com.metamorph_x.uams.repository.CourseOfferingRepository;
import com.metamorph_x.uams.repository.EnrollmentRepository;
import com.metamorph_x.uams.repository.FacultyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.metamorph_x.uams.dto.AcademicResultResponse;
import com.metamorph_x.uams.dto.LiveResultResponse;
import com.metamorph_x.uams.dto.ResultRequest;
import com.metamorph_x.uams.dto.ResultResponse;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.service.ResultService;
import org.springframework.security.core.context.SecurityContextHolder;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CourseOfferingRepository offeringRepository;
    private final EnrollmentRepository enrollmentRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR', 'FACULTY')")
    public ResponseEntity<Page<ResultResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(resultService.getAllResults(pageable));
    }

    @PostMapping("/publish")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<ResultResponse> publish(@RequestBody ResultRequest request) {
        return ResponseEntity.ok(resultService.publishResult(request));
    }

    @PostMapping("/marks/bulk")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<ResultResponse>> markBulk(@RequestBody List<ResultRequest> requests) {
        return ResponseEntity.ok(resultService.markBulkResults(requests));
    }

    @GetMapping("/preview/{offeringId}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<ResultResponse>> getPreview(@PathVariable UUID offeringId) {
        return ResponseEntity.ok(resultService.calculateFinalResults(offeringId));
    }

    @PostMapping("/publish-final/{offeringId}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<Void> publishFinal(@PathVariable UUID offeringId) {
        resultService.publishFinalResults(offeringId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/offering/{offeringId}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<LiveResultResponse>> getOfferingResults(@PathVariable UUID offeringId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        
        // If user is faculty, verify they are assigned to this offering
        if (user.getRole().name().equals("FACULTY")) {
            Faculty faculty = facultyRepository.findByUser_Id(user.getId())
                    .orElseThrow(() -> new RuntimeException("Faculty profile not found"));
            CourseOffering offering = offeringRepository.findById(offeringId)
                    .orElseThrow(() -> new RuntimeException("Offering not found"));
            
            if (!offering.getFaculty().getId().equals(faculty.getId())) {
                return ResponseEntity.status(403).build();
            }
        }
        
        return ResponseEntity.ok(resultService.getOfferingResults(offeringId));
    }

    @GetMapping("/offering/{offeringId}/matrix")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<LiveResultResponse>> getMarksMatrix(@PathVariable UUID offeringId) {
        return ResponseEntity.ok(resultService.getMarksMatrix(offeringId));
    }

    @PostMapping("/offering/{offeringId}/matrix")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<Void> saveMarksMatrix(@PathVariable UUID offeringId, @RequestBody List<LiveResultResponse> matrix) {
        resultService.saveMarksMatrix(offeringId, matrix);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/student/{studentId}/transcript")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN')")
    public ResponseEntity<List<ResultResponse>> getTranscript(@PathVariable UUID studentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        if (user.getRole().name().equals("FACULTY")) {
            Faculty faculty = facultyRepository.findByUser_Id(user.getId())
                    .orElseThrow(() -> new RuntimeException("Faculty profile not found"));
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // Faculty can only see transcript if they are the advisor
            boolean isAdvisor = student.getAdvisor() != null && student.getAdvisor().getId().equals(faculty.getId());

            if (!isAdvisor) {
                return ResponseEntity.status(403).build();
            }
        }

        return ResponseEntity.ok(resultService.getTranscript(studentId));
    }

    @GetMapping("/live")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN')")
    public ResponseEntity<List<LiveResultResponse>> getLiveResults(
            @RequestParam UUID studentId,
            @RequestParam UUID semesterId
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        if (user.getRole().name().equals("FACULTY")) {
            Faculty faculty = facultyRepository.findByUser_Id(user.getId())
                    .orElseThrow(() -> new RuntimeException("Faculty profile not found"));
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            boolean isAdvisor = student.getAdvisor() != null && student.getAdvisor().getId().equals(faculty.getId());

            if (!isAdvisor) {
                return ResponseEntity.status(403).build();
            }
        }

        return ResponseEntity.ok(resultService.getLiveResults(studentId, semesterId));
    }

    @GetMapping("/academic")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AcademicResultResponse> getAcademicResults(@RequestParam UUID semesterId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser_Id(user.getId()).orElseThrow();
        return ResponseEntity.ok(resultService.getAcademicResults(student.getId(), semesterId));
    }

    @GetMapping("/standing")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<com.metamorph_x.uams.dto.StudentAcademicStandingResponse> getStanding() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Student student = studentRepository.findByUser_Id(user.getId()).orElseThrow();
        return ResponseEntity.ok(resultService.getStudentAcademicStanding(student.getId()));
    }
}
