package com.metamorph_x.uams.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.metamorph_x.uams.dto.BatchRequest;
import com.metamorph_x.uams.dto.BatchResponse;
import com.metamorph_x.uams.dto.SectionRequest;
import com.metamorph_x.uams.dto.SectionResponse;
import com.metamorph_x.uams.service.BatchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;

    @GetMapping
    public ResponseEntity<List<BatchResponse>> getAll() {
        return ResponseEntity.ok(batchService.getAllBatches());
    }

    @GetMapping("/by-program")
    public ResponseEntity<List<BatchResponse>> getByProgram(@RequestParam UUID programId) {
        return ResponseEntity.ok(batchService.getBatchesByProgram(programId));
    }

    @GetMapping("/by-department")
    public ResponseEntity<List<BatchResponse>> getByDepartment(@RequestParam UUID departmentId) {
        return ResponseEntity.ok(batchService.getBatchesByDepartment(departmentId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<BatchResponse> create(@RequestBody BatchRequest request) {
        return ResponseEntity.ok(batchService.createBatch(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        batchService.deleteBatch(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{batchId}/sections")
    public ResponseEntity<List<SectionResponse>> getSections(@PathVariable UUID batchId) {
        return ResponseEntity.ok(batchService.getSectionsByBatch(batchId));
    }

    @PostMapping("/sections")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<SectionResponse> addSection(@RequestBody SectionRequest request) {
        return ResponseEntity.ok(batchService.addSection(request));
    }

    @DeleteMapping("/sections/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<Void> deleteSection(@PathVariable UUID id) {
        batchService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}
