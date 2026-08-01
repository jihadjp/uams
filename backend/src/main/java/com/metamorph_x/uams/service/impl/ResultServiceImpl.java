package com.metamorph_x.uams.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.ResultRequest;
import com.metamorph_x.uams.dto.ResultResponse;
import com.metamorph_x.uams.model.Enrollment;
import com.metamorph_x.uams.model.Exam;
import com.metamorph_x.uams.model.Result;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.enums.EnrollmentStatus;
import com.metamorph_x.uams.repository.EnrollmentRepository;
import com.metamorph_x.uams.repository.ExamRepository;
import com.metamorph_x.uams.repository.ResultRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.service.ResultService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {

    private final ResultRepository resultRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ExamRepository examRepository;
    private final StudentRepository studentRepository;

    @Override
    public Page<ResultResponse> getAllResults(Pageable pageable) {
        return resultRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public List<ResultResponse> markBulkResults(List<ResultRequest> requests) {
        return requests.stream().map(request -> {
            Enrollment enrollment = enrollmentRepository.findById(request.getEnrollmentId())
                    .orElseThrow(() -> new RuntimeException("Enrollment not found"));
            
            Exam exam = examRepository.findById(request.getExamId())
                    .orElseThrow(() -> new RuntimeException("Exam not found"));

            Result result = resultRepository.findByEnrollmentIdAndExamId(request.getEnrollmentId(), request.getExamId())
                    .orElse(Result.builder()
                            .enrollment(enrollment)
                            .exam(exam)
                            .build());

            result.setMarksObtained(request.getMarksObtained());
            result.setGrade(request.getGrade());
            result.setGradePoint(request.getGradePoint());
            result.setFinalResult(false);
            
            return mapToResponse(resultRepository.save(result));
        }).collect(Collectors.toList());
    }

    @Override
    public List<ResultResponse> calculateFinalResults(UUID offeringId) {
        List<Enrollment> enrollments = enrollmentRepository.findByOfferingId(offeringId);
        List<Exam> exams = examRepository.findByOfferingId(offeringId);
        
        return enrollments.stream().map(enrollment -> {
            BigDecimal totalWeightedMarks = BigDecimal.ZERO;
            
            for (Exam exam : exams) {
                Optional<Result> res = resultRepository.findByEnrollmentIdAndExamId(enrollment.getId(), exam.getId());
                if (res.isPresent() && res.get().getMarksObtained() != null) {
                    BigDecimal weight = exam.getWeightPercent().divide(new BigDecimal("100"));
                    BigDecimal score = res.get().getMarksObtained().divide(exam.getTotalMarks(), 4, RoundingMode.HALF_UP);
                    totalWeightedMarks = totalWeightedMarks.add(score.multiply(weight).multiply(new BigDecimal("100")));
                }
            }
            
            String grade = calculateGrade(totalWeightedMarks);
            BigDecimal gp = calculateGradePoint(grade);
            
            return ResultResponse.builder()
                    .studentName(enrollment.getStudent().getUser().getName())
                    .courseTitle(enrollment.getOffering().getCourse().getTitle())
                    .marksObtained(totalWeightedMarks)
                    .grade(grade)
                    .gradePoint(gp)
                    .isFinalResult(true)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void publishFinalResults(UUID offeringId) {
        List<ResultResponse> calculated = calculateFinalResults(offeringId);
        List<Enrollment> enrollments = enrollmentRepository.findByOfferingId(offeringId);
        
        for (ResultResponse resp : calculated) {
            Enrollment enrollment = enrollments.stream()
                    .filter(e -> e.getStudent().getUser().getName().equals(resp.getStudentName()))
                    .findFirst().orElseThrow();
            
            Result finalResult = Result.builder()
                    .enrollment(enrollment)
                    .marksObtained(resp.getMarksObtained())
                    .grade(resp.getGrade())
                    .gradePoint(resp.getGradePoint())
                    .isFinalResult(true)
                    .publishedAt(LocalDateTime.now())
                    .build();
            
            resultRepository.save(finalResult);
            
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
            enrollmentRepository.save(enrollment);
            calculateAndUpdateCGPA(enrollment.getStudent());
        }
    }

    private String calculateGrade(BigDecimal marks) {
        double m = marks.doubleValue();
        if (m >= 80) return "A+";
        if (m >= 75) return "A";
        if (m >= 70) return "A-";
        if (m >= 65) return "B+";
        if (m >= 60) return "B";
        if (m >= 55) return "B-";
        if (m >= 50) return "C+";
        if (m >= 45) return "C";
        if (m >= 40) return "D";
        return "F";
    }

    private BigDecimal calculateGradePoint(String grade) {
        return switch (grade) {
            case "A+" -> new BigDecimal("4.00");
            case "A" -> new BigDecimal("3.75");
            case "A-" -> new BigDecimal("3.50");
            case "B+" -> new BigDecimal("3.25");
            case "B" -> new BigDecimal("3.00");
            case "B-" -> new BigDecimal("2.75");
            case "C+" -> new BigDecimal("2.50");
            case "C" -> new BigDecimal("2.25");
            case "D" -> new BigDecimal("2.00");
            default -> BigDecimal.ZERO;
        };
    }

    @Override
    @Transactional
    public ResultResponse publishResult(ResultRequest request) {
        Enrollment enrollment = enrollmentRepository.findById(request.getEnrollmentId())
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        Exam exam = null;
        if (request.getExamId() != null) {
            exam = examRepository.findById(request.getExamId())
                    .orElseThrow(() -> new RuntimeException("Exam not found"));
        }

        Result result = Result.builder()
                .enrollment(enrollment)
                .exam(exam)
                .marksObtained(request.getMarksObtained())
                .grade(request.getGrade())
                .gradePoint(request.getGradePoint())
                .isFinalResult(request.isFinalResult())
                .publishedAt(LocalDateTime.now())
                .build();

        if (request.isFinalResult()) {
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
            enrollmentRepository.save(enrollment);
            calculateAndUpdateCGPA(enrollment.getStudent());
        }

        return mapToResponse(resultRepository.save(result));
    }

    @Override
    public List<ResultResponse> getTranscript(UUID studentId) {
        return resultRepository.findByEnrollment_Student_IdAndIsFinalResult(studentId, true)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private void calculateAndUpdateCGPA(Student student) {
        List<Result> finalResults = resultRepository.findByEnrollment_Student_IdAndIsFinalResult(student.getId(), true);
        if (finalResults.isEmpty()) return;

        BigDecimal totalGradePoints = BigDecimal.ZERO;
        BigDecimal totalCredits = BigDecimal.ZERO;

        for (Result result : finalResults) {
            BigDecimal credits = result.getEnrollment().getOffering().getCourse().getCreditHours();
            totalGradePoints = totalGradePoints.add(result.getGradePoint().multiply(credits));
            totalCredits = totalCredits.add(credits);
        }

        if (totalCredits.compareTo(BigDecimal.ZERO) > 0) {
            student.setCgpa(totalGradePoints.divide(totalCredits, 2, RoundingMode.HALF_UP));
            studentRepository.save(student);
        }
    }

    private ResultResponse mapToResponse(Result result) {
        return ResultResponse.builder()
                .id(result.getId())
                .studentName(result.getEnrollment().getStudent().getUser().getName())
                .courseCode(result.getEnrollment().getOffering().getCourse().getCourseCode())
                .courseTitle(result.getEnrollment().getOffering().getCourse().getTitle())
                .semesterName(result.getEnrollment().getOffering().getSemester().getName())
                .examType(result.getExam() != null ? result.getExam().getExamType().name() : "FINAL")
                .marksObtained(result.getMarksObtained())
                .creditHours(result.getEnrollment().getOffering().getCourse().getCreditHours())
                .grade(result.getGrade())
                .gradePoint(result.getGradePoint())
                .isFinalResult(result.isFinalResult())
                .publishedAt(result.getPublishedAt())
                .build();
    }
}
