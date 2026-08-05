package com.metamorph_x.uams.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metamorph_x.uams.dto.DocumentRequestRequest;
import com.metamorph_x.uams.dto.DocumentRequestResponse;
import com.metamorph_x.uams.dto.DocumentStatusUpdateRequest;
import com.metamorph_x.uams.service.DocumentRequestService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentRequestController {

    private final DocumentRequestService documentRequestService;

    @PostMapping("/request")
    public ResponseEntity<DocumentRequestResponse> createRequest(@Valid @RequestBody DocumentRequestRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(documentRequestService.createRequest(email, request));
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<DocumentRequestResponse>> getMyRequests() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(documentRequestService.getMyRequests(email));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<List<DocumentRequestResponse>> getAllRequests() {
        return ResponseEntity.ok(documentRequestService.getAllRequests());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<DocumentRequestResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody DocumentStatusUpdateRequest request) {
        return ResponseEntity.ok(documentRequestService.updateStatus(
                id, request.getStatus(), request.getAdminNote(), request.getPaid()));
    }
}
