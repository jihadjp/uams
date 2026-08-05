package com.metamorph_x.uams.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
import com.metamorph_x.uams.model.BatchSemesterFee;
import com.metamorph_x.uams.model.Enrollment;
import com.metamorph_x.uams.model.enums.FeeStatus;
import com.metamorph_x.uams.repository.BatchSemesterFeeRepository;
import com.metamorph_x.uams.repository.EnrollmentRepository;
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
    private final BatchSemesterFeeRepository batchSemesterFeeRepository;
    private final EnrollmentRepository enrollmentRepository;

    private static final BigDecimal COST_PER_CREDIT = new BigDecimal("6500");

    @Override
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
    public List<FeeResponse> getFeesByStudent(UUID studentId) {
        return feeRepository.findByStudent_Id(studentId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void syncSemesterFee(UUID studentId, UUID semesterId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new RuntimeException("Semester not found"));

        List<Fee> fees = feeRepository.findByStudent_IdAndSemester_Id(studentId, semesterId);
        Fee fee;
        if (fees.isEmpty()) {
            fee = Fee.builder()
                    .student(student)
                    .semester(semester)
                    .amountPaid(BigDecimal.ZERO)
                    .status(FeeStatus.DUE)
                    .build();
        } else {
            fee = fees.get(0);
        }

        // 1. Get Batch Registration Fee
        BigDecimal regFee = BigDecimal.ZERO;
        if (student.getBatch() != null) {
            Optional<BatchSemesterFee> batchFee = batchSemesterFeeRepository.findByBatchIdAndSemesterId(student.getBatch().getId(), semesterId);
            if (batchFee.isPresent()) {
                regFee = batchFee.get().getRegistrationFee();
            }
        }

        // 2. Calculate Credit Fee
        List<Enrollment> enrollments = enrollmentRepository.findByStudentIdAndOffering_Semester_Id(studentId, semesterId);
        BigDecimal totalCredits = BigDecimal.ZERO;
        for (Enrollment e : enrollments) {
            if (e.getOffering() != null && e.getOffering().getCourse() != null) {
                totalCredits = totalCredits.add(e.getOffering().getCourse().getCreditHours());
            }
        }
        
        BigDecimal creditFee = totalCredits.multiply(COST_PER_CREDIT);

        // 3. Update Fee Record
        fee.setRegistrationFee(regFee);
        fee.setCreditFee(creditFee);
        fee.setAmountDue(regFee.add(creditFee));

        // Update status based on payment
        if (fee.getAmountPaid().compareTo(fee.getAmountDue()) >= 0) {
            fee.setStatus(FeeStatus.PAID);
        } else if (fee.getAmountPaid().compareTo(BigDecimal.ZERO) > 0) {
            fee.setStatus(FeeStatus.PARTIAL);
        } else {
            fee.setStatus(FeeStatus.DUE);
        }

        feeRepository.save(fee);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isRegistrationPaid(UUID studentId, UUID semesterId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        BigDecimal requiredRegFee = BigDecimal.ZERO;
        if (student.getBatch() != null) {
            Optional<BatchSemesterFee> batchFee = batchSemesterFeeRepository.findByBatchIdAndSemesterId(student.getBatch().getId(), semesterId);
            if (batchFee.isPresent()) {
                requiredRegFee = batchFee.get().getRegistrationFee();
            }
        }

        if (requiredRegFee.compareTo(BigDecimal.ZERO) <= 0) return true;

        List<Fee> fees = feeRepository.findByStudent_IdAndSemester_Id(studentId, semesterId);
        if (fees.isEmpty()) return false;

        return fees.get(0).getAmountPaid().compareTo(requiredRegFee) >= 0;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFullFeePaid(UUID studentId, UUID semesterId) {
        List<Fee> fees = feeRepository.findByStudent_IdAndSemester_Id(studentId, semesterId);
        if (fees.isEmpty()) return false;

        Fee fee = fees.get(0);
        return fee.getAmountPaid().compareTo(fee.getAmountDue()) >= 0;
    }

    private FeeResponse mapToResponse(Fee fee) {
        String studentName = "Unknown";
        String semesterName = "Unknown";

        try {
            if (fee.getStudent() != null && fee.getStudent().getUser() != null) {
                studentName = fee.getStudent().getUser().getName();
            }

            if (fee.getSemester() != null) {
                semesterName = fee.getSemester().getName();
            }
        } catch (Exception e) {
            // Log and fall back to Unknown
        }

        return FeeResponse.builder()
                .id(fee.getId())
                .studentName(studentName)
                .semesterName(semesterName)
                .registrationFee(fee.getRegistrationFee() != null ? fee.getRegistrationFee() : BigDecimal.ZERO)
                .creditFee(fee.getCreditFee() != null ? fee.getCreditFee() : BigDecimal.ZERO)
                .amountDue(fee.getAmountDue() != null ? fee.getAmountDue() : BigDecimal.ZERO)
                .amountPaid(fee.getAmountPaid() != null ? fee.getAmountPaid() : BigDecimal.ZERO)
                .status(fee.getStatus() != null ? fee.getStatus() : FeeStatus.DUE)
                .dueDate(fee.getDueDate())
                .build();
    }
}
