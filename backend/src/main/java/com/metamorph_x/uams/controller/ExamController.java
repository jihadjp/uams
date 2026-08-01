package com.metamorph_x.uams.controller;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.metamorph_x.uams.dto.ExamRequest;
import com.metamorph_x.uams.dto.ExamResponse;
import com.metamorph_x.uams.service.ExamService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @GetMapping
    public ResponseEntity<Page<ExamResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(examService.getAllExams(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(examService.getExamById(id));
    }

    @GetMapping("/offering/{offeringId}")
    public ResponseEntity<List<ExamResponse>> getByOffering(@PathVariable UUID offeringId) {
        return ResponseEntity.ok(examService.getExamsByOffering(offeringId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR', 'FACULTY')")
    public ResponseEntity<ExamResponse> create(@RequestBody ExamRequest request) {
        return ResponseEntity.ok(examService.createExam(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        examService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }
}
