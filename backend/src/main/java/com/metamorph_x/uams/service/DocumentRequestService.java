package com.metamorph_x.uams.service;

import java.util.List;
import java.util.UUID;

import com.metamorph_x.uams.dto.DocumentRequestRequest;
import com.metamorph_x.uams.dto.DocumentRequestResponse;
import com.metamorph_x.uams.model.enums.RequestStatus;

public interface DocumentRequestService {
    DocumentRequestResponse createRequest(String email, DocumentRequestRequest request);
    List<DocumentRequestResponse> getMyRequests(String email);
    List<DocumentRequestResponse> getAllRequests();
    DocumentRequestResponse updateStatus(UUID id, RequestStatus status, String adminNote, boolean isPaid);
}
