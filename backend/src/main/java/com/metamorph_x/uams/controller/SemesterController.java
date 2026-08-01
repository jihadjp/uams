package com.metamorph_x.uams.controller;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.metamorph_x.uams.dto.SemesterRequest;
import com.metamorph_x.uams.dto.SemesterResponse;
import com.metamorph_x.uams.service.SemesterService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/semesters")
@RequiredArgsConstructor
public class SemesterController {

    private final SemesterService semesterService;

    @GetMapping
    public ResponseEntity<Page<SemesterResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(semesterService.getAllSemesters(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SemesterResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(semesterService.getSemesterById(id));
    }

    @GetMapping("/active")
    public ResponseEntity<SemesterResponse> getActive() {
        return semesterService.getActiveSemester()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<SemesterResponse> create(@RequestBody SemesterRequest request) {
        return ResponseEntity.ok(semesterService.createSemester(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<SemesterResponse> update(@PathVariable UUID id, @RequestBody SemesterRequest request) {
        return ResponseEntity.ok(semesterService.updateSemester(id, request));
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<SemesterResponse> activate(@PathVariable UUID id) {
        return ResponseEntity.ok(semesterService.setActiveSemester(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<SemesterResponse> updateStatus(
            @PathVariable UUID id, 
            @RequestParam com.metamorph_x.uams.model.enums.SemesterStatus status
    ) {
        return ResponseEntity.ok(semesterService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        semesterService.deleteSemester(id);
        return ResponseEntity.noContent().build();
    }
}
