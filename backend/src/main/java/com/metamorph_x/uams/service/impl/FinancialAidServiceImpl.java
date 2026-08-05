package com.metamorph_x.uams.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.FinancialAidApplicationRequest;
import com.metamorph_x.uams.dto.FinancialAidApplicationResponse;
import com.metamorph_x.uams.dto.FinancialAidCircularResponse;
import com.metamorph_x.uams.dto.FinancialAidStatusUpdateRequest;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.FinancialAidApplication;
import com.metamorph_x.uams.model.FinancialAidCircular;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.model.enums.ApplicationStatus;
import com.metamorph_x.uams.repository.FinancialAidApplicationRepository;
import com.metamorph_x.uams.repository.FinancialAidCircularRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.service.FinancialAidService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FinancialAidServiceImpl implements FinancialAidService {

    private final FinancialAidCircularRepository circularRepository;
    private final FinancialAidApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public FinancialAidCircularResponse createCircular(FinancialAidCircular circular) {
        return mapToCircularResponse(circularRepository.save(circular));
    }

    @Override
    @Transactional
    public FinancialAidCircularResponse updateCircular(UUID id, FinancialAidCircular circularDetails) {
        FinancialAidCircular circular = circularRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Circular not found"));
        
        circular.setTitle(circularDetails.getTitle());
        circular.setDescription(circularDetails.getDescription());
        circular.setEligibilityCriteria(circularDetails.getEligibilityCriteria());
        circular.setBenefitDetails(circularDetails.getBenefitDetails());
        circular.setDeadline(circularDetails.getDeadline());
        circular.setActive(circularDetails.isActive());
        
        return mapToCircularResponse(circularRepository.save(circular));
    }

    @Override
    @Transactional
    public void deleteCircular(UUID id) {
        circularRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FinancialAidCircularResponse> getAllCirculars() {
        return circularRepository.findAll().stream()
                .map(this::mapToCircularResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FinancialAidCircularResponse> getActiveCirculars() {
        return circularRepository.findByIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToCircularResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FinancialAidCircularResponse getCircularById(UUID id) {
        return circularRepository.findById(id)
                .map(this::mapToCircularResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Circular not found"));
    }

    @Override
    @Transactional
    public FinancialAidApplicationResponse applyForAid(String userEmail, FinancialAidApplicationRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Student student = studentRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        
        FinancialAidCircular circular = circularRepository.findById(request.getCircularId())
                .orElseThrow(() -> new ResourceNotFoundException("Circular not found"));

        if (applicationRepository.existsByStudentIdAndCircularId(student.getId(), circular.getId())) {
            throw new RuntimeException("You have already applied for this circular");
        }

        FinancialAidApplication application = FinancialAidApplication.builder()
                .student(student)
                .circular(circular)
                .justification(request.getJustification())
                .monthlyIncome(request.getMonthlyIncome())
                .status(ApplicationStatus.PENDING)
                .build();

        return mapToApplicationResponse(applicationRepository.save(application));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FinancialAidApplicationResponse> getMyApplications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Student student = studentRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return applicationRepository.findByStudentId(student.getId()).stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FinancialAidApplicationResponse> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FinancialAidApplicationResponse updateApplicationStatus(UUID id, FinancialAidStatusUpdateRequest request) {
        FinancialAidApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        application.setStatus(request.getStatus());
        application.setAdminRemarks(request.getAdminRemarks());
        
        return mapToApplicationResponse(applicationRepository.save(application));
    }

    private FinancialAidCircularResponse mapToCircularResponse(FinancialAidCircular circular) {
        return FinancialAidCircularResponse.builder()
                .id(circular.getId())
                .title(circular.getTitle())
                .description(circular.getDescription())
                .eligibilityCriteria(circular.getEligibilityCriteria())
                .benefitDetails(circular.getBenefitDetails())
                .deadline(circular.getDeadline())
                .isActive(circular.isActive())
                .createdAt(circular.getCreatedAt())
                .build();
    }

    private FinancialAidApplicationResponse mapToApplicationResponse(FinancialAidApplication application) {
        return FinancialAidApplicationResponse.builder()
                .id(application.getId())
                .studentId(application.getStudent().getId())
                .studentName(application.getStudent().getUser().getName())
                .registrationNo(application.getStudent().getRegistrationNo())
                .circularId(application.getCircular().getId())
                .circularTitle(application.getCircular().getTitle())
                .justification(application.getJustification())
                .monthlyIncome(application.getMonthlyIncome())
                .status(application.getStatus())
                .adminRemarks(application.getAdminRemarks())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
