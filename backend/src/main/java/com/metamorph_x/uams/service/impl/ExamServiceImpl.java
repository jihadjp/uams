package com.metamorph_x.uams.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.ExamRequest;
import com.metamorph_x.uams.dto.ExamResponse;
import com.metamorph_x.uams.model.CourseOffering;
import com.metamorph_x.uams.model.Exam;
import com.metamorph_x.uams.repository.CourseOfferingRepository;
import com.metamorph_x.uams.repository.ExamRepository;
import com.metamorph_x.uams.service.ExamService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final CourseOfferingRepository offeringRepository;

    @Override
    public Page<ExamResponse> getAllExams(Pageable pageable) {
        return examRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public List<ExamResponse> getExamsByOffering(UUID offeringId) {
        return examRepository.findByOfferingId(offeringId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ExamResponse getExamById(UUID id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        return mapToResponse(exam);
    }

    @Override
    @Transactional
    public ExamResponse createExam(ExamRequest request) {
        CourseOffering offering = offeringRepository.findById(request.getOfferingId())
                .orElseThrow(() -> new RuntimeException("Offering not found"));

        // Validate Weight Percent
        List<Exam> existingExams = examRepository.findByOfferingId(request.getOfferingId());
        BigDecimal currentTotalWeight = existingExams.stream()
                .map(Exam::getWeightPercent)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (currentTotalWeight.add(request.getWeightPercent()).compareTo(new BigDecimal("100.00")) > 0) {
            throw new RuntimeException("Total weight for this course exceeds 100%");
        }

        Exam exam = Exam.builder()
                .offering(offering)
                .examType(request.getExamType())
                .examDate(request.getExamDate())
                .totalMarks(request.getTotalMarks())
                .weightPercent(request.getWeightPercent())
                .build();

        return mapToResponse(examRepository.save(exam));
    }

    @Override
    @Transactional
    public void deleteExam(UUID id) {
        examRepository.deleteById(id);
    }

    private ExamResponse mapToResponse(Exam exam) {
        return ExamResponse.builder()
                .id(exam.getId())
                .courseTitle(exam.getOffering().getCourse().getTitle())
                .section(exam.getOffering().getSection() != null ? exam.getOffering().getSection().getName() : "N/A")
                .examType(exam.getExamType())
                .examDate(exam.getExamDate())
                .totalMarks(exam.getTotalMarks())
                .weightPercent(exam.getWeightPercent())
                .build();
    }
}
