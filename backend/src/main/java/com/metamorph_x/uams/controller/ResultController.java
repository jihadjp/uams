package com.metamorph_x.uams.controller;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.metamorph_x.uams.dto.ResultRequest;
import com.metamorph_x.uams.dto.ResultResponse;
import com.metamorph_x.uams.service.ResultService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

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

    @GetMapping("/student/{studentId}/transcript")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN')")
    public ResponseEntity<List<ResultResponse>> getTranscript(@PathVariable UUID studentId) {
        return ResponseEntity.ok(resultService.getTranscript(studentId));
    }
}
