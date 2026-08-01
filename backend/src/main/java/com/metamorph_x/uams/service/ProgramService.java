package com.metamorph_x.uams.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.ProgramRequest;
import com.metamorph_x.uams.dto.ProgramResponse;

public interface ProgramService {
    // 👈 search এবং departmentId প্যারামিটার যোগ করা হয়েছে
    Page<ProgramResponse> getAllPrograms(Pageable pageable, String search, UUID departmentId);

    ProgramResponse getProgramById(UUID id);
    ProgramResponse createProgram(ProgramRequest request);
    ProgramResponse updateProgram(UUID id, ProgramRequest request);
    void deleteProgram(UUID id);
}