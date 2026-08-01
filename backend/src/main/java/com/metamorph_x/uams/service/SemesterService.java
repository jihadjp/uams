package com.metamorph_x.uams.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.SemesterRequest;
import com.metamorph_x.uams.dto.SemesterResponse;

public interface SemesterService {
    Page<SemesterResponse> getAllSemesters(Pageable pageable);
    SemesterResponse getSemesterById(UUID id);
    java.util.Optional<SemesterResponse> getActiveSemester();
    SemesterResponse createSemester(SemesterRequest request);
    SemesterResponse updateSemester(UUID id, SemesterRequest request);
    SemesterResponse setActiveSemester(UUID id);
    SemesterResponse updateStatus(UUID id, com.metamorph_x.uams.model.enums.SemesterStatus status);
    void deleteSemester(UUID id);
}
