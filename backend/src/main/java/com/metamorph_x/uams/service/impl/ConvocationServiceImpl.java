package com.metamorph_x.uams.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.ConvocationApplicationRequest;
import com.metamorph_x.uams.dto.ConvocationApplicationResponse;
import com.metamorph_x.uams.dto.ConvocationStatusUpdateRequest;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.ConvocationApplication;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.model.enums.ConvocationStatus;
import com.metamorph_x.uams.repository.ConvocationRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.service.ConvocationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConvocationServiceImpl implements ConvocationService {

    private final ConvocationRepository convocationRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ConvocationApplicationResponse apply(ConvocationApplicationRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Student student = studentRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        // Check for existing application for the same year
        convocationRepository.findByStudentAndConvocationYear(student, request.getConvocationYear())
                .ifPresent(a -> {
                    throw new IllegalStateException("Already applied for convocation " + request.getConvocationYear());
                });

        ConvocationApplication application = ConvocationApplication.builder()
                .student(student)
                .cgpa(request.getCgpa())
                .creditsCompleted(request.getCreditsCompleted())
                .convocationYear(request.getConvocationYear())
                .gownSize(request.getGownSize())
                .guestCount(request.getGuestCount())
                .feeAmount(new BigDecimal("5000.00")) // Fixed fee for convocation
                .status(ConvocationStatus.PENDING)
                .paid(false)
                .build();

        return mapToResponse(convocationRepository.save(application));
    }

    @Override
    public List<ConvocationApplicationResponse> getMyApplications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Student student = studentRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return convocationRepository.findByStudent(student).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ConvocationApplicationResponse> getAllApplications() {
        return convocationRepository.findAllByOrderByAppliedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ConvocationApplicationResponse updateStatus(UUID id, ConvocationStatusUpdateRequest request) {
        ConvocationApplication application = convocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Convocation application not found"));
        
        application.setStatus(request.getStatus());
        if (request.getStatus() == ConvocationStatus.APPROVED) {
            application.setPaid(true); // Assuming approval implies fee verification/payment in this flow
        }
        
        return mapToResponse(convocationRepository.save(application));
    }

    @Override
    @Transactional
    public ConvocationApplicationResponse updateApplication(UUID id, ConvocationApplicationRequest request) {
        ConvocationApplication application = convocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Convocation application not found"));

        if (application.getStatus() != ConvocationStatus.PENDING) {
            throw new IllegalStateException("Only PENDING applications can be edited.");
        }

        application.setGownSize(request.getGownSize());
        application.setGuestCount(request.getGuestCount());
        application.setConvocationYear(request.getConvocationYear());
        // CGPA and Credits are normally fixed/re-verified, but we update them to keep data fresh from form if needed
        application.setCgpa(request.getCgpa());
        application.setCreditsCompleted(request.getCreditsCompleted());

        return mapToResponse(convocationRepository.save(application));
    }

    private ConvocationApplicationResponse mapToResponse(ConvocationApplication application) {
        Student student = application.getStudent();
        return ConvocationApplicationResponse.builder()
                .id(application.getId())
                .studentInternalId(student.getId())
                .studentName(student.getUser().getName())
                .studentId(student.getStudentId())
                .registrationNo(student.getRegistrationNo())
                .programName(student.getProgram().getName())
                .profileImage(student.getUser().getProfileImage())
                .cgpa(application.getCgpa())
                .creditsCompleted(application.getCreditsCompleted())
                .convocationYear(application.getConvocationYear())
                .gownSize(application.getGownSize())
                .guestCount(application.getGuestCount())
                .feeAmount(application.getFeeAmount())
                .paid(application.isPaid())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
