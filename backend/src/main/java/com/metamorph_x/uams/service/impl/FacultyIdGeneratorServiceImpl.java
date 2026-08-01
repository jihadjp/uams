package com.metamorph_x.uams.service.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.model.Department;
import com.metamorph_x.uams.repository.DepartmentRepository;
import com.metamorph_x.uams.repository.FacultyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FacultyIdGeneratorServiceImpl {

    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional
    public String generateEmployeeId(UUID departmentId, int offset) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        String deptCode = department.getDeptNumber();
        String prefix = deptCode + "-";
        
        long count = facultyRepository.countByEmployeeIdStartingWith(prefix);
        String serial = String.format("%03d", count + 1 + offset);
        
        return prefix + serial;
    }
}
