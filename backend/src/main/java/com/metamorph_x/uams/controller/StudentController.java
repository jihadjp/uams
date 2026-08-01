package com.metamorph_x.uams.controller;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metamorph_x.uams.dto.StudentRequest;
import com.metamorph_x.uams.dto.StudentResponse;
import com.metamorph_x.uams.service.StudentService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR', 'FACULTY')")
    public ResponseEntity<Page<StudentResponse>> getAll(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID programId,
            @RequestParam(required = false) com.metamorph_x.uams.model.enums.StudentStatus status
    ) {
        return ResponseEntity.ok(studentService.getAllStudents(pageable, search, programId, status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR', 'FACULTY', 'STUDENT')")
    public ResponseEntity<StudentResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/advisor/{advisorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR', 'FACULTY')")
    public ResponseEntity<java.util.List<StudentResponse>> getAdvisees(@PathVariable UUID advisorId) {
        return ResponseEntity.ok(studentService.getAdvisees(advisorId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<StudentResponse> create(@RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.createStudent(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<StudentResponse> update(@PathVariable UUID id, @RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @PutMapping("/profile/complete")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentResponse> completeProfile(
            @RequestParam UUID userId, 
            @RequestParam UUID programId, 
            @RequestParam String batch
    ) {
        return ResponseEntity.ok(studentService.completeProfile(userId, programId, batch));
    }

    @PutMapping("/{id}/clearance")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<StudentResponse> updateClearance(@PathVariable UUID id, @RequestParam boolean isCleared) {
        return ResponseEntity.ok(studentService.updateRegistrationClearance(id, isCleared));
    }

    @PutMapping("/{id}/laptop")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<StudentResponse> updateLaptopStatus(@PathVariable UUID id, @RequestParam boolean status) {
        return ResponseEntity.ok(studentService.updateLaptopStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
