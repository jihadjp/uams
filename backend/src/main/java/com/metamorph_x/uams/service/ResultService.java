package com.metamorph_x.uams.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.ResultRequest;
import com.metamorph_x.uams.dto.ResultResponse;

public interface ResultService {
    Page<ResultResponse> getAllResults(Pageable pageable);
    ResultResponse publishResult(ResultRequest request);
    List<ResultResponse> markBulkResults(List<ResultRequest> requests);
    List<ResultResponse> calculateFinalResults(UUID offeringId);
    void publishFinalResults(UUID offeringId);
    List<ResultResponse> getTranscript(UUID studentId);
}
