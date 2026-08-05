package com.metamorph_x.uams.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metamorph_x.uams.dto.FinancialAidApplicationRequest;
import com.metamorph_x.uams.dto.FinancialAidApplicationResponse;
import com.metamorph_x.uams.dto.FinancialAidCircularResponse;
import com.metamorph_x.uams.dto.FinancialAidStatusUpdateRequest;
import com.metamorph_x.uams.model.FinancialAidCircular;
import com.metamorph_x.uams.service.FinancialAidService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/financial-aid")
@RequiredArgsConstructor
public class FinancialAidController {

    private final FinancialAidService financialAidService;

    // --- Circulars ---

    @GetMapping("/circulars/active")
    public ResponseEntity<List<FinancialAidCircularResponse>> getActiveCirculars() {
        return ResponseEntity.ok(financialAidService.getActiveCirculars());
    }

    @GetMapping("/circulars/{id}")
    public ResponseEntity<FinancialAidCircularResponse> getCircularById(@PathVariable UUID id) {
        return ResponseEntity.ok(financialAidService.getCircularById(id));
    }

    @GetMapping("/admin/circulars")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<List<FinancialAidCircularResponse>> getAllCirculars() {
        return ResponseEntity.ok(financialAidService.getAllCirculars());
    }

    @PostMapping("/admin/circulars")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<FinancialAidCircularResponse> createCircular(@Valid @RequestBody FinancialAidCircular circular) {
        return ResponseEntity.ok(financialAidService.createCircular(circular));
    }

    @PutMapping("/admin/circulars/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<FinancialAidCircularResponse> updateCircular(@PathVariable UUID id, @Valid @RequestBody FinancialAidCircular circular) {
        return ResponseEntity.ok(financialAidService.updateCircular(id, circular));
    }

    @DeleteMapping("/admin/circulars/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<Void> deleteCircular(@PathVariable UUID id) {
        financialAidService.deleteCircular(id);
        return ResponseEntity.noContent().build();
    }

    // --- Applications ---

    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<FinancialAidApplicationResponse> apply(@Valid @RequestBody FinancialAidApplicationRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(financialAidService.applyForAid(email, request));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<FinancialAidApplicationResponse>> getMyApplications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(financialAidService.getMyApplications(email));
    }

    @GetMapping("/admin/applications")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<List<FinancialAidApplicationResponse>> getAllApplications() {
        return ResponseEntity.ok(financialAidService.getAllApplications());
    }

    @PutMapping("/admin/applications/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<FinancialAidApplicationResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody FinancialAidStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(financialAidService.updateApplicationStatus(id, request));
    }
}
