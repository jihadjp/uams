package com.metamorph_x.uams.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.metamorph_x.uams.dto.FeeRequest;
import com.metamorph_x.uams.dto.FeeResponse;
import com.metamorph_x.uams.service.FeeService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<Page<FeeResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(feeService.getAllFees(pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<FeeResponse> create(@RequestBody FeeRequest request) {
        return ResponseEntity.ok(feeService.createFee(request));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN', 'REGISTRAR')")
    public ResponseEntity<List<FeeResponse>> getByStudent(@PathVariable UUID studentId) {
        return ResponseEntity.ok(feeService.getFeesByStudent(studentId));
    }

    @PostMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN', 'REGISTRAR')")
    public ResponseEntity<FeeResponse> pay(@PathVariable UUID id, @RequestParam BigDecimal amount) {
        return ResponseEntity.ok(feeService.payFee(id, amount));
    }
}
