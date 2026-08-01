package com.metamorph_x.uams.service.impl;

import java.util.UUID;

import com.metamorph_x.uams.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.metamorph_x.uams.dto.FacultyRequest;
import com.metamorph_x.uams.dto.FacultyResponse;
import com.metamorph_x.uams.model.Department;
import com.metamorph_x.uams.model.Faculty;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.model.enums.UserRole;
import com.metamorph_x.uams.service.FacultyService;
import com.metamorph_x.uams.service.PasswordGeneratorService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl implements FacultyService {

    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final CourseOfferingRepository offeringRepository;
    private final SemesterRepository semesterRepository;
    private final PasswordEncoder passwordEncoder;
    private final FacultyIdGeneratorServiceImpl idGeneratorService;
    private final PasswordGeneratorService passwordGeneratorService;

    @Override
    public Page<FacultyResponse> getAllFaculties(Pageable pageable, String search, UUID departmentId) {
        String searchPattern = (search != null && !search.trim().isEmpty()) ? "%" + search.trim().toLowerCase() + "%" : null;
        return facultyRepository.findAllFiltered(searchPattern, departmentId, pageable).map(this::mapToResponse);
    }

    @Override
    public FacultyResponse getFacultyById(UUID id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        return mapToResponse(faculty);
    }

    @Override
    public FacultyResponse getFacultyByEmail(String email) {
        Faculty faculty = facultyRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Faculty profile not found for email: " + email));
        return mapToResponse(faculty);
    }

    @Override
    @Transactional
    public FacultyResponse createFaculty(FacultyRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String tempPassword = passwordGeneratorService.generateRandomPassword(10);

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(tempPassword))
                .role(UserRole.FACULTY)
                .isActive(true)
                .isVerified(true)
                .mustChangePassword(true)
                .build();

        user = userRepository.save(user);

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        int maxRetries = 5;
        int offset = 0;
        Faculty savedFaculty = null;

        while (offset < maxRetries) {
            try {
                String generatedId = idGeneratorService.generateEmployeeId(request.getDepartmentId(), offset);
                
                Faculty faculty = Faculty.builder()
                        .user(user)
                        .department(department)
                        .employeeId(generatedId)
                        .designation(request.getDesignation())
                        .joinedAt(LocalDate.now())
                        .build();

                savedFaculty = facultyRepository.save(faculty);
                break;
            } catch (Exception e) {
                // If unique constraint violation, increment offset and retry
                offset++;
                if (offset >= maxRetries) throw new RuntimeException("Failed to generate unique Employee ID after " + maxRetries + " attempts");
            }
        }

        FacultyResponse response = mapToResponse(savedFaculty);
        response.setTemporaryPassword(tempPassword);
        return response;
    }

    @Override
    @Transactional
    public FacultyResponse updateFaculty(UUID id, FacultyRequest request) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        if (request.getName() != null) faculty.getUser().setName(request.getName());
        if (request.getDesignation() != null) faculty.setDesignation(request.getDesignation());
        
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            faculty.setDepartment(department);
        }

        return mapToResponse(facultyRepository.save(faculty));
    }

    @Override
    @Transactional
    public void deleteFaculty(UUID id) {
        facultyRepository.deleteById(id);
    }

    private FacultyResponse mapToResponse(Faculty faculty) {
        long teachingLoad = 0;
        try {
            com.metamorph_x.uams.model.Semester activeSemester = semesterRepository.findByActiveTrue().orElse(null);
            if (activeSemester != null) {
                teachingLoad = offeringRepository.findBySemesterIdAndFacultyId(activeSemester.getId(), faculty.getId()).size();
            }
        } catch (Exception e) {
            // Fallback for cases where repositories might not be fully initialized or other errors
        }

        return FacultyResponse.builder()
                .id(faculty.getId())
                .name(faculty.getUser().getName())
                .email(faculty.getUser().getEmail())
                .employeeId(faculty.getEmployeeId())
                .departmentName(faculty.getDepartment().getName())
                .designation(faculty.getDesignation())
                .phone(faculty.getUser().getPhone())
                .joinedAt(faculty.getJoinedAt())
                .profileImage(faculty.getUser().getProfileImage())
                .currentTeachingLoad(teachingLoad)
                .build();
    }
}
