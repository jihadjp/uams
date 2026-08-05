package com.metamorph_x.uams.service.impl;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.ProgramRequest;
import com.metamorph_x.uams.dto.ProgramResponse;
import com.metamorph_x.uams.model.Department;
import com.metamorph_x.uams.model.Program;
import com.metamorph_x.uams.repository.DepartmentRepository;
import com.metamorph_x.uams.repository.ProgramRepository;
import com.metamorph_x.uams.service.ProgramService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProgramServiceImpl implements ProgramService {

    private final ProgramRepository programRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ProgramResponse> getAllPrograms(Pageable pageable, String search, UUID departmentId) {
        String searchPattern = (search != null && !search.trim().isEmpty()) ? "%" + search.trim().toLowerCase() + "%" : null;
        return programRepository.findAllFiltered(searchPattern, departmentId, pageable).map(this::mapToResponse);
    }

    @Override
    public ProgramResponse getProgramById(UUID id) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        return mapToResponse(program);
    }

    @Override
    @Transactional
    public ProgramResponse createProgram(ProgramRequest request) {
        if (departmentRepository.count() == 0) {
            throw new IllegalArgumentException("No departments found. Please create a Department before defining programs.");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Program program = Program.builder()
                .department(department)
                .name(request.getName())
                .degreeLevel(request.getDegreeLevel())
                .durationYears(request.getDurationYears())
                .totalCredits(request.getTotalCredits())
                .build();

        return mapToResponse(programRepository.save(program));
    }

    @Override
    @Transactional
    public ProgramResponse updateProgram(UUID id, ProgramRequest request) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        program.setDepartment(department);
        program.setName(request.getName());
        program.setDegreeLevel(request.getDegreeLevel());
        program.setDurationYears(request.getDurationYears());
        program.setTotalCredits(request.getTotalCredits());

        return mapToResponse(programRepository.save(program));
    }

    @Override
    @Transactional
    public void deleteProgram(UUID id) {
        programRepository.deleteById(id);
    }

    private ProgramResponse mapToResponse(Program program) {
        return ProgramResponse.builder()
                .id(program.getId())
                .departmentId(program.getDepartment().getId()) // 👈 এটি যোগ করুন
                .departmentName(program.getDepartment().getName())
                .name(program.getName())
                .degreeLevel(program.getDegreeLevel())
                .durationYears(program.getDurationYears())
                .totalCredits(program.getTotalCredits())
                .build();
    }
}
