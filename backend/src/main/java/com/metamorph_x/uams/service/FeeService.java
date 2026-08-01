package com.metamorph_x.uams.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.FeeRequest;
import com.metamorph_x.uams.dto.FeeResponse;

public interface FeeService {
    Page<FeeResponse> getAllFees(Pageable pageable);
    FeeResponse createFee(FeeRequest request);
    FeeResponse payFee(UUID feeId, BigDecimal amount);
    List<FeeResponse> getFeesByStudent(UUID studentId);
}
