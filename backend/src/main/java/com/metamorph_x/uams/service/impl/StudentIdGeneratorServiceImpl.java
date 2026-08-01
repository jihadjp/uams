package com.metamorph_x.uams.service.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

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
    public Map<String, String> generateStudentIds(String batch, UUID departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        String deptCode = department.getDeptNumber();
        String prefix = batch + "-" + deptCode + "-";
        
        long count = studentRepository.countByRegistrationNoStartingWith(prefix);
        String serial = String.format("%03d", count + 1);
        
        String registrationNo = prefix + serial;
        
        // 16-digit ID: 0 + Batch(4) + Dept(2) + Campus(3) + Serial(6)
        String batchPadded = String.format("%04d", Integer.parseInt(batch));
        String deptPadded = String.format("%02d", Integer.parseInt(deptCode));
        String serialPadded = String.format("%06d", count + 1);
        
        String studentId = "0" + batchPadded + deptPadded + campusCode + serialPadded;
        
        Map<String, String> ids = new HashMap<>();
        ids.put("studentId", studentId);
        ids.put("registrationNo", registrationNo);
        
        return ids;
    }
}
