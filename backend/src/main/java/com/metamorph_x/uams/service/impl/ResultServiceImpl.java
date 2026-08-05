package com.metamorph_x.uams.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.AcademicResultResponse;
import com.metamorph_x.uams.dto.LiveResultResponse;
import com.metamorph_x.uams.dto.ResultRequest;
import com.metamorph_x.uams.dto.ResultResponse;
import com.metamorph_x.uams.model.Batch;
import com.metamorph_x.uams.model.Attendance;
import com.metamorph_x.uams.model.CourseOffering;
import com.metamorph_x.uams.model.Enrollment;
import com.metamorph_x.uams.model.Exam;
import com.metamorph_x.uams.model.Result;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.enums.EnrollmentStatus;
import com.metamorph_x.uams.model.enums.ExamType;
import com.metamorph_x.uams.repository.CourseOfferingRepository;
import com.metamorph_x.uams.repository.EnrollmentRepository;
import com.metamorph_x.uams.repository.EvaluationRepository;
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
    private final EvaluationRepository evaluationRepository;
    private final CourseOfferingRepository offeringRepository;

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

            if (request.getMarksObtained() != null && request.getMarksObtained().compareTo(exam.getTotalMarks()) > 0) {
                throw new IllegalArgumentException("Marks obtained cannot exceed total marks (" + exam.getTotalMarks() + ") for " + exam.getExamType());
            }

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
            BigDecimal midMarks = BigDecimal.ZERO;
            BigDecimal impMarks = BigDecimal.ZERO;
            
            for (Exam exam : exams) {
                Optional<Result> res = resultRepository.findByEnrollmentIdAndExamId(enrollment.getId(), exam.getId());
                if (res.isPresent() && res.get().getMarksObtained() != null) {
                    BigDecimal weight = exam.getWeightPercent().divide(new BigDecimal("100"));
                    BigDecimal score = res.get().getMarksObtained().divide(exam.getTotalMarks(), 4, RoundingMode.HALF_UP);
                    BigDecimal weighted = score.multiply(weight).multiply(new BigDecimal("100"));

                    if (exam.getExamType() == ExamType.MIDTERM) {
                        midMarks = weighted;
                    } else if (exam.getExamType() == ExamType.MIDTERM_IMPROVEMENT) {
                        impMarks = weighted;
                    } else {
                        totalWeightedMarks = totalWeightedMarks.add(weighted);
                    }
                }
            }

            // Best of Midterm vs Improvement
            totalWeightedMarks = totalWeightedMarks.add(midMarks.max(impMarks));
            
            String grade = calculateGrade(totalWeightedMarks);
            BigDecimal gp = calculateGradePoint(grade);
            
            return ResultResponse.builder()
                    .enrollmentId(enrollment.getId())
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
        
        for (ResultResponse resp : calculated) {
            Enrollment enrollment = enrollmentRepository.findById(resp.getEnrollmentId())
                    .orElseThrow(() -> new RuntimeException("Enrollment not found"));
            
            Result finalResult = resultRepository.findByEnrollmentIdAndIsFinalResult(enrollment.getId(), true)
                    .orElse(Result.builder()
                            .enrollment(enrollment)
                            .isFinalResult(true)
                            .build());
            
            finalResult.setMarksObtained(resp.getMarksObtained());
            finalResult.setGrade(resp.getGrade());
            finalResult.setGradePoint(resp.getGradePoint());
            finalResult.setPublishedAt(LocalDateTime.now());
            
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

            if (request.getMarksObtained() != null && request.getMarksObtained().compareTo(exam.getTotalMarks()) > 0) {
                throw new IllegalArgumentException("Marks obtained cannot exceed total marks (" + exam.getTotalMarks() + ")");
            }
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

    @Override
    public List<LiveResultResponse> getLiveResults(UUID studentId, UUID semesterId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentIdAndOffering_Semester_Id(studentId, semesterId);
        return enrollments.stream()
                .filter(e -> e.getStatus() != EnrollmentStatus.DROPPED)
                .map(this::mapToLiveResult)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<LiveResultResponse> getMarksMatrix(UUID offeringId) {
        ensureStandardExams(offeringId);
        List<Enrollment> enrollments = enrollmentRepository.findByOfferingId(offeringId);
        return enrollments.stream()
                .filter(e -> e.getStatus() != EnrollmentStatus.DROPPED)
                .map(this::mapToLiveResult)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void saveMarksMatrix(UUID offeringId, List<LiveResultResponse> matrix) {
        ensureStandardExams(offeringId);
        List<Exam> exams = examRepository.findByOfferingId(offeringId);
        
        for (LiveResultResponse row : matrix) {
            Enrollment enrollment = enrollmentRepository.findById(row.getEnrollmentId())
                    .orElseThrow(() -> new RuntimeException("Enrollment not found"));

            saveMark(enrollment, exams, ExamType.QUIZ, "Quiz 1", row.getQuiz1());
            saveMark(enrollment, exams, ExamType.QUIZ, "Quiz 2", row.getQuiz2());
            saveMark(enrollment, exams, ExamType.QUIZ, "Quiz 3", row.getQuiz3());
            saveMark(enrollment, exams, ExamType.PRESENTATION, "Presentation", row.getPresentation());
            saveMark(enrollment, exams, ExamType.ATTENDANCE, "Attendance", row.getAttendanceMarks());
            saveMark(enrollment, exams, ExamType.ASSIGNMENT, "Assignment", row.getAssignment());
            saveMark(enrollment, exams, ExamType.MIDTERM, "Midterm", row.getMidterm());
            saveMark(enrollment, exams, ExamType.FINAL, "Final Exam", row.getFinalExam());
            
            // Lab components
            saveMark(enrollment, exams, ExamType.PROJECT_SHOW, "Project Show", row.getProjectShow());
            saveMark(enrollment, exams, ExamType.LAB_REPORT, "Lab Report", row.getLabReport());
            saveMark(enrollment, exams, ExamType.LAB_EVALUATION, "Lab Final Evaluation", row.getLabEvaluation());
        }
    }

    private void saveMark(Enrollment enrollment, List<Exam> exams, ExamType type, String title, BigDecimal marks) {
        if (marks == null) return;

        Exam exam = exams.stream()
                .filter(e -> e.getExamType() == type && (e.getTitle() != null && e.getTitle().equalsIgnoreCase(title)))
                .findFirst()
                .orElse(null);

        if (exam == null) return;

        if (marks.compareTo(exam.getTotalMarks()) > 0) {
            throw new IllegalArgumentException("Marks " + marks + " for " + title + " exceeds limit of " + exam.getTotalMarks());
        }

        Result result = resultRepository.findByEnrollmentIdAndExamId(enrollment.getId(), exam.getId())
                .orElse(Result.builder()
                        .enrollment(enrollment)
                        .exam(exam)
                        .build());

        result.setMarksObtained(marks);
        // Auto-calculate grade point if needed, or leave for final publish
        resultRepository.save(result);
    }

    private void ensureStandardExams(UUID offeringId) {
        CourseOffering offering = offeringRepository.findById(offeringId)
                .orElseThrow(() -> new com.metamorph_x.uams.exception.ResourceNotFoundException("Course offering not found"));

        List<Exam> existingExams = examRepository.findByOfferingId(offeringId);
        
        if (offering.getCourse().getCourseType() == com.metamorph_x.uams.model.enums.CourseType.THEORY) {
            createIfMissing(offering, existingExams, ExamType.QUIZ, "Quiz 1", new BigDecimal("15.00"), new BigDecimal("5.00"));
            createIfMissing(offering, existingExams, ExamType.QUIZ, "Quiz 2", new BigDecimal("15.00"), new BigDecimal("5.00"));
            createIfMissing(offering, existingExams, ExamType.QUIZ, "Quiz 3", new BigDecimal("15.00"), new BigDecimal("5.00"));
            createIfMissing(offering, existingExams, ExamType.PRESENTATION, "Presentation", new BigDecimal("8.00"), new BigDecimal("8.00"));
            createIfMissing(offering, existingExams, ExamType.ATTENDANCE, "Attendance", new BigDecimal("7.00"), new BigDecimal("7.00"));
            createIfMissing(offering, existingExams, ExamType.ASSIGNMENT, "Assignment", new BigDecimal("5.00"), new BigDecimal("5.00"));
            createIfMissing(offering, existingExams, ExamType.MIDTERM, "Midterm", new BigDecimal("25.00"), new BigDecimal("25.00"));
            createIfMissing(offering, existingExams, ExamType.FINAL, "Final Exam", new BigDecimal("40.00"), new BigDecimal("40.00"));
        } else {
            // LAB
            createIfMissing(offering, existingExams, ExamType.ATTENDANCE, "Attendance", new BigDecimal("10.00"), new BigDecimal("10.00"));
            createIfMissing(offering, existingExams, ExamType.PROJECT_SHOW, "Project Show", new BigDecimal("25.00"), new BigDecimal("25.00"));
            createIfMissing(offering, existingExams, ExamType.LAB_REPORT, "Lab Report", new BigDecimal("25.00"), new BigDecimal("25.00"));
            createIfMissing(offering, existingExams, ExamType.LAB_EVALUATION, "Lab Final Evaluation", new BigDecimal("40.00"), new BigDecimal("40.00"));
        }
    }

    private void createIfMissing(CourseOffering offering, List<Exam> existing, ExamType type, String title, BigDecimal total, BigDecimal weight) {
        Optional<Exam> existingExam = existing.stream()
                .filter(e -> e.getExamType() == type && (e.getTitle() != null && e.getTitle().equalsIgnoreCase(title)))
                .findFirst();

        if (existingExam.isPresent()) {
            Exam exam = existingExam.get();
            // If it's still using the old default of 100, update it to the correct university limit
            if (exam.getTotalMarks().compareTo(new BigDecimal("100")) == 0) {
                exam.setTotalMarks(total);
                exam.setWeightPercent(weight);
                examRepository.save(exam);
            }
        } else {
            Exam exam = Exam.builder()
                    .offering(offering)
                    .examType(type)
                    .title(title)
                    .totalMarks(total)
                    .weightPercent(weight)
                    .examDate(LocalDate.now())
                    .build();
            examRepository.save(exam);
        }
    }

    @Override
    public List<LiveResultResponse> getOfferingResults(UUID offeringId) {
        List<Enrollment> enrollments = enrollmentRepository.findByOfferingId(offeringId);
        return enrollments.stream()
                .filter(e -> e.getStatus() != EnrollmentStatus.DROPPED)
                .map(this::mapToLiveResult)
                .collect(Collectors.toList());
    }

    @Override
    public AcademicResultResponse getAcademicResults(UUID studentId, UUID semesterId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Enrollment> enrollments = enrollmentRepository.findByStudentIdAndOffering_Semester_Id(studentId, semesterId)
                .stream()
                .filter(e -> e.getStatus() != EnrollmentStatus.DROPPED)
                .collect(Collectors.toList());

        List<AcademicResultResponse.CourseResult> courseResults = enrollments.stream().map(enrollment -> {
            CourseOffering offering = enrollment.getOffering();

            // Check for final result
            Optional<Result> finalResultOpt = resultRepository.findByEnrollmentIdAndIsFinalResult(enrollment.getId(), true);

            // Check for evaluation
            boolean evaluationPending = !evaluationRepository.existsByStudentIdAndOfferingId(studentId, offering.getId());

            AcademicResultResponse.CourseResult.CourseResultBuilder builder = AcademicResultResponse.CourseResult.builder()
                    .courseCode(offering.getCourse().getCourseCode())
                    .courseTitle(offering.getCourse().getTitle())
                    .credits(offering.getCourse().getCreditHours().doubleValue())
                    .evaluationPending(evaluationPending);

            if (finalResultOpt.isPresent()) {
                Result res = finalResultOpt.get();
                // If evaluation is pending OR results are not approved, hide grade
                if (evaluationPending || !offering.isResultsApproved()) {
                    builder.grade("N/A").gradePoint(null);
                } else {
                    builder.grade(res.getGrade()).gradePoint(res.getGradePoint().doubleValue());
                }
            } else {
                builder.grade("N/A").gradePoint(null);
            }

            return builder.build();
        }).collect(Collectors.toList());

        // Calculate SGPA
        double totalWeightedGradePoints = 0;
        double totalCreditsForSgpa = 0;
        double totalCredits = 0;

        for (AcademicResultResponse.CourseResult cr : courseResults) {
            totalCredits += cr.getCredits();
            if (!cr.isEvaluationPending() && cr.getGradePoint() != null) {
                totalWeightedGradePoints += cr.getGradePoint() * cr.getCredits();
                totalCreditsForSgpa += cr.getCredits();
            }
        }

        double sgpa = totalCreditsForSgpa > 0 ? totalWeightedGradePoints / totalCreditsForSgpa : 0.0;

        String batchStr = "N/A";
        if (student.getBatch() != null) {
            batchStr = student.getBatch().getBatchNumber() + "(" + student.getBatch().getBatchInitial() + ")";
        }

        return AcademicResultResponse.builder()
                .studentName(student.getUser().getName())
                .programName(student.getProgram().getName())
                .batch(batchStr)
                .studentId(student.getStudentId())
                .registrationNo(student.getRegistrationNo())
                .sgpa(BigDecimal.valueOf(sgpa).setScale(2, RoundingMode.HALF_UP).doubleValue())
                .totalCredits(totalCredits)
                .courses(courseResults)
                .build();
    }

    @Override
    public com.metamorph_x.uams.dto.StudentAcademicStandingResponse getStudentAcademicStanding(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Result> finalResults = resultRepository.findByEnrollment_Student_IdAndIsFinalResult(studentId, true);
        
        BigDecimal totalWeightedGradePoints = BigDecimal.ZERO;
        BigDecimal totalCredits = BigDecimal.ZERO;
        BigDecimal completedCredits = BigDecimal.ZERO;

        for (Result result : finalResults) {
            BigDecimal credits = result.getEnrollment().getOffering().getCourse().getCreditHours();
            totalCredits = totalCredits.add(credits);
            
            if (result.getGradePoint() != null) {
                totalWeightedGradePoints = totalWeightedGradePoints.add(result.getGradePoint().multiply(credits));
                if (result.getGradePoint().compareTo(BigDecimal.ZERO) > 0) {
                    completedCredits = completedCredits.add(credits);
                }
            }
        }

        BigDecimal cgpa = totalCredits.compareTo(BigDecimal.ZERO) > 0 
                ? totalWeightedGradePoints.divide(totalCredits, 2, RoundingMode.HALF_UP) 
                : BigDecimal.ZERO;

        BigDecimal requiredCredits = student.getProgram() != null ? student.getProgram().getTotalCredits() : BigDecimal.ZERO;

        return com.metamorph_x.uams.dto.StudentAcademicStandingResponse.builder()
                .cgpa(cgpa)
                .totalCreditsCompleted(completedCredits)
                .requiredCredits(requiredCredits)
                .build();
    }

    private LiveResultResponse mapToLiveResult(Enrollment enrollment) {
        String courseCode = "N/A";
        String courseTitle = "N/A";
        BigDecimal credits = BigDecimal.ZERO;
        String section = "N/A";
        String teacherName = "N/A";

        if (enrollment.getOffering() != null) {
            CourseOffering offering = enrollment.getOffering();
            if (offering.getCourse() != null) {
                courseCode = offering.getCourse().getCourseCode();
                courseTitle = offering.getCourse().getTitle();
                credits = offering.getCourse().getCreditHours();
            }
            if (offering.getSection() != null) {
                section = offering.getSection().getName();
            }
            if (offering.getFaculty() != null && offering.getFaculty().getUser() != null) {
                teacherName = offering.getFaculty().getUser().getName();
            }
        }

        String studentName = "Unknown";
        String regNo = "N/A";

        if (enrollment.getStudent() != null) {
            if (enrollment.getStudent().getUser() != null) {
                studentName = enrollment.getStudent().getUser().getName();
            }
            regNo = enrollment.getStudent().getRegistrationNo();
        }

        LiveResultResponse.LiveResultResponseBuilder builder = LiveResultResponse.builder()
                .enrollmentId(enrollment.getId())
                .courseCode(courseCode)
                .courseTitle(courseTitle)
                .credits(credits)
                .section(section)
                .teacherName(teacherName)
                .studentName(studentName)
                .studentId(regNo)
                .courseType(enrollment.getOffering() != null ? enrollment.getOffering().getCourse().getCourseType().name() : "THEORY");

        // Attendance Percentage
        List<Attendance> attendanceRecords = enrollment.getAttendanceRecords();
        if (attendanceRecords != null && !attendanceRecords.isEmpty()) {
            long presentCount = attendanceRecords.stream()
                    .filter(a -> a.getStatus().name().equals("PRESENT"))
                    .count();
            BigDecimal percentage = BigDecimal.valueOf(presentCount)
                    .multiply(new BigDecimal("100"))
                    .divide(BigDecimal.valueOf(attendanceRecords.size()), 2, RoundingMode.HALF_UP);
            builder.attendancePercentage(percentage);
        } else {
            builder.attendancePercentage(BigDecimal.ZERO);
        }

        // Results
        List<Result> results = enrollment.getResults();
        BigDecimal quiz1 = BigDecimal.ZERO;
        BigDecimal quiz2 = BigDecimal.ZERO;
        BigDecimal quiz3 = BigDecimal.ZERO;
        BigDecimal presentation = BigDecimal.ZERO;
        BigDecimal attendanceMarks = BigDecimal.ZERO;
        BigDecimal assignment = BigDecimal.ZERO;
        BigDecimal midterm = BigDecimal.ZERO;
        BigDecimal midtermImprovement = BigDecimal.ZERO;
        
        // Lab
        BigDecimal projectShow = BigDecimal.ZERO;
        BigDecimal labReport = BigDecimal.ZERO;
        BigDecimal labEvaluation = BigDecimal.ZERO;

        int quizCount = 0;
        BigDecimal quizSum = BigDecimal.ZERO;

        for (Result res : results) {
            if (res.getExam() == null) continue;
            ExamType type = res.getExam().getExamType();
            String title = res.getExam().getTitle();
            BigDecimal marks = res.getMarksObtained();
            if (marks == null) marks = BigDecimal.ZERO;

            if (type == ExamType.QUIZ) {
                if (title != null) {
                    if (title.equalsIgnoreCase("Quiz 1")) quiz1 = marks;
                    else if (title.equalsIgnoreCase("Quiz 2")) quiz2 = marks;
                    else if (title.equalsIgnoreCase("Quiz 3")) quiz3 = marks;
                }
                quizSum = quizSum.add(marks);
                quizCount++;
            }
            else if (type == ExamType.PRESENTATION) presentation = marks;
            else if (type == ExamType.ATTENDANCE) attendanceMarks = marks;
            else if (type == ExamType.ASSIGNMENT) assignment = marks;
            else if (type == ExamType.MIDTERM) midterm = marks;
            else if (type == ExamType.MIDTERM_IMPROVEMENT) midtermImprovement = marks;
            else if (type == ExamType.FINAL) builder.finalExam(marks);
            else if (type == ExamType.PROJECT_SHOW) projectShow = marks;
            else if (type == ExamType.LAB_REPORT) labReport = marks;
            else if (type == ExamType.LAB_EVALUATION) labEvaluation = marks;
        }

        builder.quiz1(quiz1)
               .quiz2(quiz2)
               .quiz3(quiz3)
               .quizAverage(quiz1.add(quiz2).add(quiz3).divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP))
               .presentation(presentation)
               .attendanceMarks(attendanceMarks)
               .assignment(assignment)
               .midterm(midterm)
               .midtermImprovement(midtermImprovement)
               .projectShow(projectShow)
               .labReport(labReport)
               .labEvaluation(labEvaluation);

        return builder.build();
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
                .enrollmentId(result.getEnrollment().getId())
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
