package com.metamorph_x.uams.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.DepartmentRequest;
import com.metamorph_x.uams.dto.DepartmentResponse;

public interface DepartmentService {
    Page<DepartmentResponse> getAllDepartments(Pageable pageable, String search);
    DepartmentResponse getDepartmentById(UUID id);
    DepartmentResponse createDepartment(DepartmentRequest request);
    DepartmentResponse updateDepartment(UUID id, DepartmentRequest request);
    void deleteDepartment(UUID id);
}
