package com.metamorph_x.uams.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.CourseOfferingRequest;
import com.metamorph_x.uams.dto.CourseOfferingResponse;

public interface CourseOfferingService {
    Page<CourseOfferingResponse> getAllOfferings(Pageable pageable, UUID semesterId, UUID departmentId, String batch, String search);
    CourseOfferingResponse getOfferingById(UUID id);
    CourseOfferingResponse createOffering(CourseOfferingRequest request);
    CourseOfferingResponse updateOffering(UUID id, CourseOfferingRequest request);
    void deleteOffering(UUID id);
}
