package com.metamorph_x.uams.controller;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.metamorph_x.uams.dto.CourseOfferingRequest;
import com.metamorph_x.uams.dto.CourseOfferingResponse;
import com.metamorph_x.uams.service.CourseOfferingService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/course-offerings")
@RequiredArgsConstructor
public class CourseOfferingController {

    private final CourseOfferingService courseOfferingService;

    @GetMapping
    public ResponseEntity<Page<CourseOfferingResponse>> getAll(
            Pageable pageable,
            @RequestParam(required = false) UUID semesterId,
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(required = false) UUID facultyId,
            @RequestParam(required = false) String batch,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isResultsPublished
    ) {
        return ResponseEntity.ok(courseOfferingService.getAllOfferings(pageable, semesterId, departmentId, facultyId, batch, search, isResultsPublished));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseOfferingResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(courseOfferingService.getOfferingById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<CourseOfferingResponse> create(@RequestBody CourseOfferingRequest request) {
        return ResponseEntity.ok(courseOfferingService.createOffering(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<CourseOfferingResponse> update(@PathVariable UUID id, @RequestBody CourseOfferingRequest request) {
        return ResponseEntity.ok(courseOfferingService.updateOffering(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        courseOfferingService.deleteOffering(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/approve-results")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<Void> approveResults(@PathVariable UUID id) {
        courseOfferingService.approveResults(id);
        return ResponseEntity.ok().build();
    }
}
