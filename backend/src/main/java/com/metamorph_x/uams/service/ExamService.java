package com.metamorph_x.uams.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.ExamRequest;
import com.metamorph_x.uams.dto.ExamResponse;

public interface ExamService {
    Page<ExamResponse> getAllExams(Pageable pageable);
    List<ExamResponse> getExamsByOffering(UUID offeringId);
    ExamResponse getExamById(UUID id);
    ExamResponse createExam(ExamRequest request);
    void deleteExam(UUID id);
}
