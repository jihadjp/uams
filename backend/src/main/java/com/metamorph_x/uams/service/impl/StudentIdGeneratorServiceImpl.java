package com.metamorph_x.uams.service.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.metamorph_x.uams.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.model.Department;
import com.metamorph_x.uams.repository.DepartmentRepository;
import com.metamorph_x.uams.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentIdGeneratorServiceImpl {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

    @Value("${uams.campus.code:005}")
    private String campusCode;

    @Transactional
    public Map<String, String> generateStudentIds(String batchInitial, UUID departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        String deptCode = department.getDeptNumber();
        String prefix = batchInitial + "-" + deptCode + "-";
        
        long count = studentRepository.countByRegistrationNoStartingWith(prefix);
        String serial = String.format("%03d", count + 1);
        
        String registrationNo = prefix + serial;
        
        // 16-digit ID: 0 + BatchInitial(3) + Dept(2) + Campus(3) + Serial(7)
        // Adjusting padding for 3-digit batch initial
        String batchPadded = String.format("%03d", Integer.parseInt(batchInitial));
        String deptPadded = String.format("%02d", Integer.parseInt(deptCode));
        String serialPadded = String.format("%07d", count + 1);
        
        String studentId = "0" + batchPadded + deptPadded + campusCode + serialPadded;
        
        Map<String, String> ids = new HashMap<>();
        ids.put("studentId", studentId);
        ids.put("registrationNo", registrationNo);
        
        return ids;
    }
}
