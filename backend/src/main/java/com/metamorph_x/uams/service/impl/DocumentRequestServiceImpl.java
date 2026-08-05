package com.metamorph_x.uams.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.DocumentRequestRequest;
import com.metamorph_x.uams.dto.DocumentRequestResponse;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.DocumentRequest;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.model.enums.RequestStatus;
import com.metamorph_x.uams.repository.DocumentRequestRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.service.DocumentRequestService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentRequestServiceImpl implements DocumentRequestService {

    private final DocumentRequestRepository documentRequestRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public DocumentRequestResponse createRequest(String email, DocumentRequestRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        Student student = studentRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user: " + email));

        DocumentRequest documentRequest = DocumentRequest.builder()
                .student(student)
                .documentType(request.getDocumentType())
                .requestNote(request.getRequestNote())
                .feeAmount(calculateFee(request.getDocumentType()))
                .build();

        DocumentRequest saved = documentRequestRepository.save(documentRequest);
        return mapToResponse(saved);
    }

    @Override
    public List<DocumentRequestResponse> getMyRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Student student = studentRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user: " + email));

        return documentRequestRepository.findByStudentIdOrderByRequestedAtDesc(student.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentRequestResponse> getAllRequests() {
        return documentRequestRepository.findAllByOrderByRequestedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DocumentRequestResponse updateStatus(UUID id, RequestStatus status, String adminNote, boolean isPaid) {
        DocumentRequest request = documentRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document request not found with id: " + id));
        
        request.setStatus(status);
        request.setAdminNote(adminNote);
        request.setPaid(isPaid);
        
        DocumentRequest updated = documentRequestRepository.save(request);
        return mapToResponse(updated);
    }

    private BigDecimal calculateFee(com.metamorph_x.uams.model.enums.DocumentType type) {
        return switch (type) {
            case TRANSCRIPT -> new BigDecimal("500.00");
            case PROVISIONAL_CERTIFICATE -> new BigDecimal("1000.00");
            case MAIN_CERTIFICATE -> new BigDecimal("2000.00");
            case TESTIMONIAL -> new BigDecimal("200.00");
            case MEDIUM_OF_INSTRUCTION -> new BigDecimal("300.00");
            default -> new BigDecimal("0.00");
        };
    }

    private DocumentRequestResponse mapToResponse(DocumentRequest request) {
        Student student = request.getStudent();
        return DocumentRequestResponse.builder()
                .id(request.getId())
                .studentName(student.getUser().getName())
                .studentId(student.getStudentId())
                .registrationNo(student.getRegistrationNo())
                .programName(student.getProgram().getName())
                .documentType(request.getDocumentType())
                .status(request.getStatus())
                .feeAmount(request.getFeeAmount())
                .paid(request.isPaid())
                .requestNote(request.getRequestNote())
                .adminNote(request.getAdminNote())
                .requestedAt(request.getRequestedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}
