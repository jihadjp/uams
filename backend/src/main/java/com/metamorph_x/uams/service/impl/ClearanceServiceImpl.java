package com.metamorph_x.uams.service.impl;

import com.metamorph_x.uams.dto.ClearanceResponse;
import com.metamorph_x.uams.model.Fee;
import com.metamorph_x.uams.model.SemesterClearance;
import com.metamorph_x.uams.repository.ClearanceRepository;
import com.metamorph_x.uams.repository.FeeRepository;
import com.metamorph_x.uams.service.ClearanceService;
import com.metamorph_x.uams.service.FeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClearanceServiceImpl implements ClearanceService {

    private final FeeRepository feeRepository;
    private final FeeService feeService;
    private final ClearanceRepository clearanceRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ClearanceResponse> getMyClearance(UUID studentId) {
        // Fetch all fees to identify the semesters the student is involved in
        List<Fee> fees = feeRepository.findByStudent_Id(studentId);
        
        return fees.stream()
                .map(fee -> {
                    UUID semesterId = fee.getSemester().getId();
                    
                    // Check for manual overrides in SemesterClearance table
                    Optional<SemesterClearance> manualClearance = clearanceRepository.findByStudent_IdAndSemester_Id(studentId, semesterId);
                    
                    boolean isRegPaid = feeService.isRegistrationPaid(studentId, semesterId);
                    boolean isFullPaid = feeService.isFullFeePaid(studentId, semesterId);

                    return ClearanceResponse.builder()
                            .semesterName(fee.getSemester().getName())
                            // If manually cleared OR fee is paid
                            .registrationCleared(manualClearance.map(SemesterClearance::isRegistrationCleared).orElse(false) || isRegPaid)
                            .midtermCleared(manualClearance.map(SemesterClearance::isMidtermCleared).orElse(false) || isRegPaid)
                            .finalExamCleared(manualClearance.map(SemesterClearance::isFinalExamCleared).orElse(false) || isFullPaid)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
