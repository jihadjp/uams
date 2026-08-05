package com.metamorph_x.uams.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.BatchSemesterFeeRequest;
import com.metamorph_x.uams.dto.BatchSemesterFeeResponse;
import com.metamorph_x.uams.model.Batch;
import com.metamorph_x.uams.model.BatchSemesterFee;
import com.metamorph_x.uams.model.Semester;
import com.metamorph_x.uams.repository.BatchRepository;
import com.metamorph_x.uams.repository.BatchSemesterFeeRepository;
import com.metamorph_x.uams.repository.SemesterRepository;
import com.metamorph_x.uams.service.BatchSemesterFeeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BatchSemesterFeeServiceImpl implements BatchSemesterFeeService {

    private final BatchSemesterFeeRepository repository;
    private final BatchRepository batchRepository;
    private final SemesterRepository semesterRepository;

    @Override
    @Transactional
    public BatchSemesterFeeResponse saveFee(BatchSemesterFeeRequest request) {
        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Semester not found"));

        BatchSemesterFee fee = repository.findByBatchIdAndSemesterId(request.getBatchId(), request.getSemesterId())
                .orElse(new BatchSemesterFee());
        
        fee.setBatch(batch);
        fee.setSemester(semester);
        fee.setRegistrationFee(request.getRegistrationFee());

        return mapToResponse(repository.save(fee));
    }

    @Override
    public List<BatchSemesterFeeResponse> getFeesBySemester(UUID semesterId) {
        // Here we could return all batches with their fee (even if 0) but for now just saved ones
        return repository.findAll().stream()
                .filter(f -> f.getSemester().getId().equals(semesterId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BatchSemesterFeeResponse mapToResponse(BatchSemesterFee fee) {
        return BatchSemesterFeeResponse.builder()
                .id(fee.getId())
                .batchId(fee.getBatch().getId())
                .batchNumber(fee.getBatch().getBatchNumber())
                .semesterId(fee.getSemester().getId())
                .semesterName(fee.getSemester().getName())
                .registrationFee(fee.getRegistrationFee())
                .build();
    }
}
