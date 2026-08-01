package com.metamorph_x.uams.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.FacultyRequest;
import com.metamorph_x.uams.dto.FacultyResponse;

public interface FacultyService {
    Page<FacultyResponse> getAllFaculties(Pageable pageable, String search, UUID departmentId);
    FacultyResponse getFacultyById(UUID id);
    FacultyResponse getFacultyByEmail(String email);
    FacultyResponse createFaculty(FacultyRequest request);
    FacultyResponse updateFaculty(UUID id, FacultyRequest request);
    void deleteFaculty(UUID id);
}
