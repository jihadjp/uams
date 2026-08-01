package com.metamorph_x.uams.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.FeeRequest;
import com.metamorph_x.uams.dto.FeeResponse;
import com.metamorph_x.uams.model.Fee;
import com.metamorph_x.uams.model.Semester;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.enums.FeeStatus;
import com.metamorph_x.uams.repository.FeeRepository;
import com.metamorph_x.uams.repository.SemesterRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.service.FeeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeeServiceImpl implements FeeService {

    private final FeeRepository feeRepository;
    private final StudentRepository studentRepository;
    private final SemesterRepository semesterRepository;

    @Override
    public Page<FeeResponse> getAllFees(Pageable pageable) {
        return feeRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public FeeResponse createFee(FeeRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Semester not found"));

        Fee fee = Fee.builder()
                .student(student)
                .semester(semester)
                .amountDue(request.getAmountDue())
                .amountPaid(BigDecimal.ZERO)
                .dueDate(request.getDueDate())
                .status(request.getStatus() != null ? request.getStatus() : FeeStatus.DUE)
                .build();

        return mapToResponse(feeRepository.save(fee));
    }

    @Override
    @Transactional
    public FeeResponse payFee(UUID feeId, BigDecimal amount) {
        Fee fee = feeRepository.findById(feeId)
                .orElseThrow(() -> new RuntimeException("Fee record not found"));

        fee.setAmountPaid(fee.getAmountPaid().add(amount));
        if (fee.getAmountPaid().compareTo(fee.getAmountDue()) >= 0) {
            fee.setStatus(FeeStatus.PAID);
        } else {
            fee.setStatus(FeeStatus.PARTIAL);
        }
        fee.setPaidAt(LocalDateTime.now());

        return mapToResponse(feeRepository.save(fee));
    }

    @Override
    public List<FeeResponse> getFeesByStudent(UUID studentId) {
        return feeRepository.findByStudentId(studentId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private FeeResponse mapToResponse(Fee fee) {
        return FeeResponse.builder()
                .id(fee.getId())
                .studentName(fee.getStudent().getUser().getName())
                .semesterName(fee.getSemester().getName())
                .amountDue(fee.getAmountDue())
                .amountPaid(fee.getAmountPaid())
                .status(fee.getStatus())
                .dueDate(fee.getDueDate())
                .build();
    }
}
