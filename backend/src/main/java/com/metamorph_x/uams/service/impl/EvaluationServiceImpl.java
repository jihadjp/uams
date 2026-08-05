package com.metamorph_x.uams.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.EvaluationRequest;
import com.metamorph_x.uams.dto.EvaluationResponse;
import com.metamorph_x.uams.dto.FacultyEvaluationSummary;
import com.metamorph_x.uams.dto.StudentEvaluationStatusResponse;
import com.metamorph_x.uams.exception.DuplicateResourceException;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.CourseOffering;
import com.metamorph_x.uams.model.Evaluation;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.repository.CourseOfferingRepository;
import com.metamorph_x.uams.repository.EnrollmentRepository;
import com.metamorph_x.uams.repository.EvaluationRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.service.EvaluationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EvaluationServiceImpl implements EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final StudentRepository studentRepository;
    private final CourseOfferingRepository offeringRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    @Transactional
    public EvaluationResponse submitEvaluation(EvaluationRequest request) {
        if (evaluationRepository.existsByStudentIdAndOfferingId(request.getStudentId(), request.getOfferingId())) {
            throw new DuplicateResourceException("You have already evaluated this course.");
        }

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        CourseOffering offering = offeringRepository.findById(request.getOfferingId())
                .orElseThrow(() -> new ResourceNotFoundException("Course offering not found"));

        double sum = request.getQ1() + request.getQ2() + request.getQ3() + request.getQ4() + request.getQ5() +
                     request.getQ6() + request.getQ7() + request.getQ8() + request.getQ9() + request.getQ10();
        BigDecimal avg = BigDecimal.valueOf(sum / 10.0).setScale(2, RoundingMode.HALF_UP);

        Evaluation evaluation = Evaluation.builder()
                .student(student)
                .offering(offering)
                .q1(request.getQ1())
                .q2(request.getQ2())
                .q3(request.getQ3())
                .q4(request.getQ4())
                .q5(request.getQ5())
                .q6(request.getQ6())
                .q7(request.getQ7())
                .q8(request.getQ8())
                .q9(request.getQ9())
                .q10(request.getQ10())
                .averageRating(avg)
                .comments(request.getComments())
                .build();

        Evaluation saved = evaluationRepository.save(evaluation);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentEvaluationStatusResponse> getEvaluationStatus(UUID studentId, UUID semesterId) {
        return enrollmentRepository.findByStudentIdAndOffering_Semester_Id(studentId, semesterId).stream()
                .filter(e -> e.getStatus() != com.metamorph_x.uams.model.enums.EnrollmentStatus.DROPPED)
                .map(enrollment -> {
                    CourseOffering offering = enrollment.getOffering();
                    if (offering == null) return null;
                    
                    boolean submitted = evaluationRepository.existsByStudentIdAndOfferingId(studentId, offering.getId());
                    
                    String code = offering.getCourse() != null ? offering.getCourse().getCourseCode() : "N/A";
                    String title = offering.getCourse() != null ? offering.getCourse().getTitle() : "N/A";
                    String faculty = (offering.getFaculty() != null && offering.getFaculty().getUser() != null) 
                            ? offering.getFaculty().getUser().getName() : "N/A";

                    return StudentEvaluationStatusResponse.builder()
                            .offeringId(offering.getId())
                            .courseCode(code)
                            .courseTitle(title)
                            .facultyName(faculty)
                            .submitted(submitted)
                            .build();
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Override
    public FacultyEvaluationSummary getFacultySummary(UUID facultyId) {
        List<Evaluation> evaluations = evaluationRepository.findByFacultyId(facultyId);
        if (evaluations.isEmpty()) {
            return FacultyEvaluationSummary.builder()
                    .overallRating(BigDecimal.ZERO)
                    .totalEvaluations(0)
                    .build();
        }

        double totalAvg = evaluations.stream()
                .mapToDouble(e -> e.getAverageRating().doubleValue())
                .average()
                .orElse(0.0);

        return FacultyEvaluationSummary.builder()
                .overallRating(BigDecimal.valueOf(totalAvg).setScale(2, RoundingMode.HALF_UP))
                .totalEvaluations(evaluations.size())
                .build();
    }

    private EvaluationResponse mapToResponse(Evaluation e) {
        String courseCode = "N/A";
        String courseTitle = "N/A";
        String facultyName = "N/A";

        if (e.getOffering() != null) {
            if (e.getOffering().getCourse() != null) {
                courseCode = e.getOffering().getCourse().getCourseCode();
                courseTitle = e.getOffering().getCourse().getTitle();
            }
            if (e.getOffering().getFaculty() != null && e.getOffering().getFaculty().getUser() != null) {
                facultyName = e.getOffering().getFaculty().getUser().getName();
            }
        }

        return EvaluationResponse.builder()
                .id(e.getId())
                .courseCode(courseCode)
                .courseTitle(courseTitle)
                .facultyName(facultyName)
                .averageRating(e.getAverageRating())
                .comments(e.getComments())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
