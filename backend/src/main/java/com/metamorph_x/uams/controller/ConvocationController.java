package com.metamorph_x.uams.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metamorph_x.uams.dto.ConvocationApplicationRequest;
import com.metamorph_x.uams.dto.ConvocationApplicationResponse;
import com.metamorph_x.uams.dto.ConvocationStatusUpdateRequest;
import com.metamorph_x.uams.service.ConvocationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/convocation")
@RequiredArgsConstructor
public class ConvocationController {

    private final ConvocationService convocationService;

    // ১. আবেদন করার জন্য
    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ConvocationApplicationResponse> apply(@Valid @RequestBody ConvocationApplicationRequest request) {
        return ResponseEntity.ok(convocationService.apply(request));
    }

    // ২. স্টুডেন্টের নিজের আবেদন আপডেট করার জন্য
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ConvocationApplicationResponse> updateApplication(
            @PathVariable UUID id,
            @Valid @RequestBody ConvocationApplicationRequest request) {
        return ResponseEntity.ok(convocationService.updateApplication(id, request));
    }

    // ৩. স্টুডেন্টের নিজের সব আবেদন দেখার জন্য
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ConvocationApplicationResponse>> getMyApplications() {
        return ResponseEntity.ok(convocationService.getMyApplications());
    }

    // ৪. এডমিন বা রেজিস্ট্রারের জন্য সব আবেদন দেখার জন্য
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<List<ConvocationApplicationResponse>> getAllApplications() {
        return ResponseEntity.ok(convocationService.getAllApplications());
    }

    // ৫. আবেদনের স্ট্যাটাস আপডেট করার জন্য (ADMIN/REGISTRAR)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<ConvocationApplicationResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody ConvocationStatusUpdateRequest request) {
        return ResponseEntity.ok(convocationService.updateStatus(id, request));
    }
}