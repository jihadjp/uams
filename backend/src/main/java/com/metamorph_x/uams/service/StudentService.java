package com.metamorph_x.uams.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.StudentRequest;
import com.metamorph_x.uams.dto.StudentResponse;

public interface StudentService {
    Page<StudentResponse> getAllStudents(Pageable pageable, String search, UUID programId, com.metamorph_x.uams.model.enums.StudentStatus status);
    StudentResponse getStudentById(UUID id);
    java.util.List<StudentResponse> getAdvisees(UUID advisorId);
    StudentResponse createStudent(StudentRequest request);
    StudentResponse updateStudent(UUID id, StudentRequest request);
    StudentResponse completeProfile(UUID userId, UUID programId, String batch);
    StudentResponse updateRegistrationClearance(UUID id, boolean isCleared);
    StudentResponse updateLaptopStatus(UUID id, boolean hasReceived);
    StudentResponse updateSection(UUID id, UUID sectionId);
    void deleteStudent(UUID id);
}
