package com.metamorph_x.uams.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metamorph_x.uams.dto.EvaluationRequest;
import com.metamorph_x.uams.dto.EvaluationResponse;
import com.metamorph_x.uams.dto.FacultyEvaluationSummary;
import com.metamorph_x.uams.dto.StudentEvaluationStatusResponse;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.service.EvaluationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EvaluationResponse> submit(@Valid @RequestBody EvaluationRequest request) {
        return ResponseEntity.ok(evaluationService.submitEvaluation(request));
    }

    @GetMapping("/status/{semesterId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<StudentEvaluationStatusResponse>> getStatus(@PathVariable UUID semesterId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Student student = studentRepository.findByUser_Id(
                userRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                        .getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return ResponseEntity.ok(evaluationService.getEvaluationStatus(student.getId(), semesterId));
    }

    @GetMapping("/faculty/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<FacultyEvaluationSummary> getFacultyPerformance(@PathVariable UUID facultyId) {
        return ResponseEntity.ok(evaluationService.getFacultySummary(facultyId));
    }
}
