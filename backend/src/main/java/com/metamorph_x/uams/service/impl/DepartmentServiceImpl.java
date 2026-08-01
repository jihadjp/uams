package com.metamorph_x.uams.service.impl;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.DepartmentRequest;
import com.metamorph_x.uams.dto.DepartmentResponse;
import com.metamorph_x.uams.model.Department;
import com.metamorph_x.uams.model.Faculty;
import com.metamorph_x.uams.repository.DepartmentRepository;
import com.metamorph_x.uams.repository.FacultyRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.service.DepartmentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;

    @Override
    public Page<DepartmentResponse> getAllDepartments(Pageable pageable, String search) {
        String searchPattern = (search != null && !search.trim().isEmpty()) ? "%" + search.trim().toLowerCase() + "%" : null;
        return departmentRepository.findAllFiltered(searchPattern, pageable).map(this::mapToResponse);
    }

    @Override
    public DepartmentResponse getDepartmentById(UUID id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        return mapToResponse(department);
    }

    @Override
    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        Department department = Department.builder()
                .name(request.getName())
                .code(request.getCode())
                .deptNumber(request.getDeptNumber())
                .build();

        if (request.getHeadFacultyId() != null) {
            Faculty head = facultyRepository.findById(request.getHeadFacultyId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found"));
            department.setHeadFaculty(head);
        }

        return mapToResponse(departmentRepository.save(department));
    }

    @Override
    @Transactional
    public DepartmentResponse updateDepartment(UUID id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        
        department.setName(request.getName());
        department.setCode(request.getCode());
        department.setDeptNumber(request.getDeptNumber());

        if (request.getHeadFacultyId() != null) {
            Faculty head = facultyRepository.findById(request.getHeadFacultyId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found"));
            department.setHeadFaculty(head);
        }

        return mapToResponse(departmentRepository.save(department));
    }

    @Override
    @Transactional
    public void deleteDepartment(UUID id) {
        departmentRepository.deleteById(id);
    }

    private DepartmentResponse mapToResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .code(department.getCode())
                .deptNumber(department.getDeptNumber())
                .headFacultyName(department.getHeadFaculty() != null ? department.getHeadFaculty().getUser().getName() : "Not Assigned")
                .totalFaculty(department.getFaculties() != null ? department.getFaculties().size() : 0)
                .totalStudents(studentRepository.countByProgram_Department_Id(department.getId()))
                .build();
    }
}
