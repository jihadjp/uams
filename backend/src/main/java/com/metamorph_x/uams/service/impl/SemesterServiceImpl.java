package com.metamorph_x.uams.service.impl;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.SemesterRequest;
import com.metamorph_x.uams.dto.SemesterResponse;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.Semester;
import com.metamorph_x.uams.model.enums.SemesterStatus;
import com.metamorph_x.uams.repository.SemesterRepository;
import com.metamorph_x.uams.service.SemesterService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SemesterServiceImpl implements SemesterService {

    private final SemesterRepository semesterRepository;

    @Override
    public Page<SemesterResponse> getAllSemesters(Pageable pageable) {
        return semesterRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public SemesterResponse getSemesterById(UUID id) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));
        return mapToResponse(semester);
    }

    @Override
    public Optional<SemesterResponse> getActiveSemester() {
        return semesterRepository.findByActiveTrue()
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public SemesterResponse createSemester(SemesterRequest request) {
        validateSemesterDates(request);
        
        String autoName = request.getTerm().name() + " " + request.getAcademicYear();
        
        Semester semester = Semester.builder()
                .name(autoName)
                .term(request.getTerm())
                .academicYear(request.getAcademicYear())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .registrationDeadline(request.getRegistrationDeadline())
                .addDropDeadline(request.getAddDropDeadline())
                .gradeDeadline(request.getGradeDeadline())
                .status(SemesterStatus.UPCOMING)
                .build();

        return mapToResponse(semesterRepository.save(semester));
    }

    @Override
    @Transactional
    public SemesterResponse updateSemester(UUID id, SemesterRequest request) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));

        validateSemesterDates(request);

        String autoName = request.getTerm().name() + " " + request.getAcademicYear();
        
        semester.setName(autoName);
        semester.setTerm(request.getTerm());
        semester.setAcademicYear(request.getAcademicYear());
        semester.setStartDate(request.getStartDate());
        semester.setEndDate(request.getEndDate());
        semester.setRegistrationDeadline(request.getRegistrationDeadline());
        semester.setAddDropDeadline(request.getAddDropDeadline());
        semester.setGradeDeadline(request.getGradeDeadline());
        
        return mapToResponse(semesterRepository.save(semester));
    }

    @Override
    @Transactional
    public SemesterResponse setActiveSemester(UUID id) {
        // Logic: Deactivate all, then set one as ONGOING or REGISTRATION
        // But with lifecycle, we should probably just use updateStatus endpoint.
        // Keeping this for compatibility with existing UI trigger.
        
        semesterRepository.findAll().forEach(s -> {
            if (s.getStatus() == SemesterStatus.ONGOING || s.getStatus() == SemesterStatus.REGISTRATION) {
                s.setStatus(SemesterStatus.COMPLETED);
                semesterRepository.save(s);
            }
        });

        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));
        semester.setStatus(SemesterStatus.ONGOING);
        
        return mapToResponse(semesterRepository.save(semester));
    }

    @Override
    @Transactional
    public SemesterResponse updateStatus(UUID id, SemesterStatus status) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));
        
        // Logic to ensure only one semester is in REGISTRATION or ONGOING status
        if (status == SemesterStatus.REGISTRATION || status == SemesterStatus.ONGOING) {
            semesterRepository.findAll().forEach(s -> {
                if (!s.getId().equals(id) && (s.getStatus() == SemesterStatus.REGISTRATION || s.getStatus() == SemesterStatus.ONGOING)) {
                    s.setStatus(SemesterStatus.COMPLETED);
                    semesterRepository.save(s);
                }
            });
        }
        
        semester.setStatus(status);
        return mapToResponse(semesterRepository.save(semester));
    }

    @Override
    @Transactional
    public void deleteSemester(UUID id) {
        semesterRepository.deleteById(id);
    }

    private void validateSemesterDates(SemesterRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
        if (request.getRegistrationDeadline() != null && request.getRegistrationDeadline().isAfter(request.getStartDate())) {
            throw new IllegalArgumentException("Registration deadline should be on or before class start date");
        }
    }

    private SemesterResponse mapToResponse(Semester semester) {
        return SemesterResponse.builder()
                .id(semester.getId())
                .name(semester.getName())
                .term(semester.getTerm())
                .academicYear(semester.getAcademicYear())
                .startDate(semester.getStartDate())
                .endDate(semester.getEndDate())
                .registrationDeadline(semester.getRegistrationDeadline())
                .addDropDeadline(semester.getAddDropDeadline())
                .gradeDeadline(semester.getGradeDeadline())
                .status(semester.getStatus() != null ? semester.getStatus() : SemesterStatus.UPCOMING)
                .active(semester.isActive())
                .build();
    }
}
