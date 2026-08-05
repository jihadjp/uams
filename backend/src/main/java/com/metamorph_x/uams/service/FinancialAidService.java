package com.metamorph_x.uams.service;

import java.util.List;
import java.util.UUID;

import com.metamorph_x.uams.dto.FinancialAidApplicationRequest;
import com.metamorph_x.uams.dto.FinancialAidApplicationResponse;
import com.metamorph_x.uams.dto.FinancialAidCircularResponse;
import com.metamorph_x.uams.dto.FinancialAidStatusUpdateRequest;
import com.metamorph_x.uams.model.FinancialAidCircular;

public interface FinancialAidService {
    // Circular Management (Admin)
    FinancialAidCircularResponse createCircular(FinancialAidCircular circular);
    FinancialAidCircularResponse updateCircular(UUID id, FinancialAidCircular circular);
    void deleteCircular(UUID id);
    List<FinancialAidCircularResponse> getAllCirculars();

    // Circular View (Student/Public)
    List<FinancialAidCircularResponse> getActiveCirculars();
    FinancialAidCircularResponse getCircularById(UUID id);

    // Application Management (Student)
    FinancialAidApplicationResponse applyForAid(String userEmail, FinancialAidApplicationRequest request);
    List<FinancialAidApplicationResponse> getMyApplications(String userEmail);

    // Application Management (Admin)
    List<FinancialAidApplicationResponse> getAllApplications();
    FinancialAidApplicationResponse updateApplicationStatus(UUID id, FinancialAidStatusUpdateRequest request);
}
