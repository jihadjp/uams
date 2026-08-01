package com.metamorph_x.uams.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.BatchRequest;
import com.metamorph_x.uams.dto.BatchResponse;
import com.metamorph_x.uams.dto.SectionRequest;
import com.metamorph_x.uams.dto.SectionResponse;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.Batch;
import com.metamorph_x.uams.model.Program;
import com.metamorph_x.uams.model.Section;
import com.metamorph_x.uams.repository.BatchRepository;
import com.metamorph_x.uams.repository.ProgramRepository;
import com.metamorph_x.uams.repository.SectionRepository;
import com.metamorph_x.uams.service.BatchService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BatchServiceImpl implements BatchService {

    private final BatchRepository batchRepository;
    private final SectionRepository sectionRepository;
    private final ProgramRepository programRepository;

    @Override
    public List<BatchResponse> getAllBatches() {
        return batchRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<BatchResponse> getBatchesByProgram(UUID programId) {
        return batchRepository.findByProgramId(programId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BatchResponse createBatch(BatchRequest request) {
        if (batchRepository.existsByBatchNumberAndProgramId(request.getBatchNumber(), request.getProgramId())) {
            throw new IllegalArgumentException("Batch already exists for this program");
        }

        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new ResourceNotFoundException("Program not found"));

        Batch batch = Batch.builder()
                .batchNumber(request.getBatchNumber())
                .program(program)
                .build();

        return mapToResponse(batchRepository.save(batch));
    }

    @Override
    @Transactional
    public void deleteBatch(UUID id) {
        batchRepository.deleteById(id);
    }

    @Override
    @Transactional
    public SectionResponse addSection(SectionRequest request) {
        if (sectionRepository.existsByNameAndBatchId(request.getName(), request.getBatchId())) {
            throw new IllegalArgumentException("Section already exists for this batch");
        }

        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));

        Section section = Section.builder()
                .name(request.getName())
                .batch(batch)
                .build();

        return mapToSectionResponse(sectionRepository.save(section));
    }

    @Override
    @Transactional
    public void deleteSection(UUID id) {
        sectionRepository.deleteById(id);
    }

    @Override
    public List<SectionResponse> getSectionsByBatch(UUID batchId) {
        return sectionRepository.findByBatchId(batchId).stream().map(this::mapToSectionResponse).collect(Collectors.toList());
    }

    private BatchResponse mapToResponse(Batch batch) {
        return BatchResponse.builder()
                .id(batch.getId())
                .batchNumber(batch.getBatchNumber())
                .programId(batch.getProgram().getId())
                .programName(batch.getProgram().getName())
                .sections(batch.getSections().stream().map(this::mapToSectionResponse).collect(Collectors.toList()))
                .build();
    }

    private SectionResponse mapToSectionResponse(Section section) {
        return SectionResponse.builder()
                .id(section.getId())
                .name(section.getName())
                .batchId(section.getBatch().getId())
                .build();
    }
}
