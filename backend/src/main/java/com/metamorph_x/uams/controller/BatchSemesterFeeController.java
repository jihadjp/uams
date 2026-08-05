package com.metamorph_x.uams.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.metamorph_x.uams.dto.BatchSemesterFeeRequest;
import com.metamorph_x.uams.dto.BatchSemesterFeeResponse;
import com.metamorph_x.uams.service.BatchSemesterFeeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/batch-semester-fees")
@RequiredArgsConstructor
public class BatchSemesterFeeController {

    private final BatchSemesterFeeService service;

    @GetMapping
    public ResponseEntity<List<BatchSemesterFeeResponse>> getBySemester(@RequestParam UUID semesterId) {
        return ResponseEntity.ok(service.getFeesBySemester(semesterId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<BatchSemesterFeeResponse> save(@RequestBody BatchSemesterFeeRequest request) {
        return ResponseEntity.ok(service.saveFee(request));
    }
}
