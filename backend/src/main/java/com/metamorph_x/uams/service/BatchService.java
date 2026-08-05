package com.metamorph_x.uams.service;

import java.util.List;
import java.util.UUID;
import com.metamorph_x.uams.dto.BatchRequest;
import com.metamorph_x.uams.dto.BatchResponse;
import com.metamorph_x.uams.dto.SectionRequest;
import com.metamorph_x.uams.dto.SectionResponse;

public interface BatchService {
    List<BatchResponse> getAllBatches();
    List<BatchResponse> getBatchesByProgram(UUID programId);
    List<BatchResponse> getBatchesByDepartment(UUID departmentId);
    BatchResponse createBatch(BatchRequest request);
    void deleteBatch(UUID id);

    SectionResponse addSection(SectionRequest request);
    void deleteSection(UUID id);
    List<SectionResponse> getSectionsByBatch(UUID batchId);
}
