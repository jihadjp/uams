package com.metamorph_x.uams.service;

import java.util.List;
import java.util.UUID;

import com.metamorph_x.uams.dto.ConvocationApplicationRequest;
import com.metamorph_x.uams.dto.ConvocationApplicationResponse;
import com.metamorph_x.uams.dto.ConvocationStatusUpdateRequest;

public interface ConvocationService {
    ConvocationApplicationResponse apply(ConvocationApplicationRequest request);
    List<ConvocationApplicationResponse> getMyApplications();
    List<ConvocationApplicationResponse> getAllApplications();
    ConvocationApplicationResponse updateStatus(UUID id, ConvocationStatusUpdateRequest request);
    ConvocationApplicationResponse updateApplication(UUID id, ConvocationApplicationRequest request);
}
