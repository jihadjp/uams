package com.metamorph_x.uams.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.metamorph_x.uams.dto.AdminStatsResponse;
import com.metamorph_x.uams.dto.FacultyOverviewResponse;
import com.metamorph_x.uams.dto.StudentSummaryResponse;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.CourseOffering;
import com.metamorph_x.uams.model.Enrollment;
import com.metamorph_x.uams.model.Faculty;
import com.metamorph_x.uams.model.Fee;
import com.metamorph_x.uams.model.Result;
import com.metamorph_x.uams.model.Semester;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.model.enums.AttendanceStatus;
import com.metamorph_x.uams.model.enums.FeeStatus;
import com.metamorph_x.uams.repository.CourseOfferingRepository;
import com.metamorph_x.uams.repository.CourseRepository;
import com.metamorph_x.uams.repository.DepartmentRepository;
import com.metamorph_x.uams.repository.EnrollmentRepository;
import com.metamorph_x.uams.repository.FacultyRepository;
import com.metamorph_x.uams.repository.FeeRepository;
import com.metamorph_x.uams.repository.ResultRepository;
import com.metamorph_x.uams.repository.SemesterRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.repository.AttendanceRepository;
import com.metamorph_x.uams.service.DashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseOfferingRepository offeringRepository;
    private final ResultRepository resultRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final FeeRepository feeRepository;
    private final SemesterRepository semesterRepository;

    @Override
    public AdminStatsResponse getAdminStats() {
        List<AdminStatsResponse.DepartmentStats> deptStats = departmentRepository.findAll().stream()
                .map(d -> new AdminStatsResponse.DepartmentStats(
                        d.getCode(),
                        studentRepository.countByProgram_Department_Id(d.getId())
                ))
                .collect(Collectors.toList());

        List<AdminStatsResponse.StatusStats> statusStats = List.of(
                new AdminStatsResponse.StatusStats("Active", studentRepository.countByStatus(com.metamorph_x.uams.model.enums.StudentStatus.ACTIVE), "#8b5cf6"),
                new AdminStatsResponse.StatusStats("Graduated", studentRepository.countByStatus(com.metamorph_x.uams.model.enums.StudentStatus.GRADUATED), "#10b981"),
                new AdminStatsResponse.StatusStats("Dropped", studentRepository.countByStatus(com.metamorph_x.uams.model.enums.StudentStatus.DROPPED), "#ef4444"),
                new AdminStatsResponse.StatusStats("Suspended", studentRepository.countByStatus(com.metamorph_x.uams.model.enums.StudentStatus.SUSPENDED), "#f59e0b")
        );

        return AdminStatsResponse.builder()
                .totalStudents(studentRepository.count())
                .totalFaculty(facultyRepository.count())
                .totalCourses(courseRepository.count())
                .totalDepartments(departmentRepository.count())
                .studentsByDepartment(deptStats)
                .studentStatusDistribution(statusStats)
                .build();
    }

    @Override
    public FacultyOverviewResponse getFacultyOverview() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Faculty faculty = facultyRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty profile not found for email: " + email));

        Semester activeSemester = semesterRepository.findByActiveTrue()
                .orElse(null);

        if (activeSemester == null) {
            return FacultyOverviewResponse.builder()
                    .activeCourses(new ArrayList<>())
                    .todaySchedule(new ArrayList<>())
                    .build();
        }

        List<CourseOffering> activeOfferings = offeringRepository.findBySemesterId(activeSemester.getId())
                .stream()
                .filter(o -> o.getFaculty().getId().equals(faculty.getId()))
                .collect(Collectors.toList());

        String today = LocalDate.now().getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

        List<FacultyOverviewResponse.CourseSummary> courseSummaries = activeOfferings.stream()
                .map(o -> {
                    long studentCount = enrollmentRepository.countByOfferingId(o.getId());
                    return FacultyOverviewResponse.CourseSummary.builder()
                            .id(o.getId())
                            .code(o.getCourse().getCourseCode())
                            .title(o.getCourse().getTitle())
                            .section(o.getSection() != null ? o.getSection().getName() : "N/A")
                            .studentCount(studentCount)
                            .build();
                })
                .collect(Collectors.toList());

        List<FacultyOverviewResponse.ScheduleItem> todaySchedule = new ArrayList<>();
        // Schedule display removed in simplified system
        
        long totalStudents = courseSummaries.stream().mapToLong(s -> s.getStudentCount()).sum();

        // Real Pending Results: Enrollments in active semester offerings that don't have a final result yet
        long pendingResults = activeOfferings.stream()
                .mapToLong(o -> {
                    long studentCount = enrollmentRepository.countByOfferingId(o.getId());
                    long resultsCount = resultRepository.findByEnrollment_Offering_Id(o.getId()).stream()
                            .filter(Result::isFinalResult)
                            .count();
                    return studentCount - resultsCount;
                })
                .sum();

        return FacultyOverviewResponse.builder()
                .myCourses(courseSummaries.size())
                .totalStudents(totalStudents)
                .pendingResults(pendingResults)
                .todayClasses(todaySchedule.size())
                .activeCourses(courseSummaries)
                .todaySchedule(todaySchedule)
                .build();
    }

    @Override
    public StudentSummaryResponse getStudentSummary() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Optional<Student> studentOpt = studentRepository.findByUser_Id(user.getId());

        if (studentOpt.isEmpty()) {
            return StudentSummaryResponse.builder()
                    .studentName(user.getName())
                    .email(user.getEmail())
                    .enrolledCourses(0)
                    .cgpa(BigDecimal.ZERO)
                    .semesterResults(new ArrayList<>())
                    .build();
        }

        Student student = studentOpt.get();
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        long enrolledCount = enrollments.size();

        // Real Attendance Calculation
        double attendancePercent = 0.0;
        if (!enrollments.isEmpty()) {
            long totalClasses = attendanceRepository.countByEnrollmentIn(enrollments);
            if (totalClasses > 0) {
                long presentClasses = attendanceRepository.countByEnrollmentInAndStatus(enrollments, AttendanceStatus.PRESENT);
                attendancePercent = (double) presentClasses / totalClasses * 100;
            }
        }

        // Real Fee Status - Refined to respect manual clearance
        String feeStatusLabel = student.isRegistrationCleared() ? "Paid" : "Due";
        List<Fee> fees = feeRepository.findByStudentId(student.getId());
        if (!fees.isEmpty()) {
            boolean hasDue = fees.stream().anyMatch(f -> f.getStatus() != FeeStatus.PAID);
            if (!hasDue) feeStatusLabel = "Paid";
            else if (!student.isRegistrationCleared()) feeStatusLabel = "Due";
            // If student is manually cleared, we show Paid even if dues exist in DB (as a waiver/admin override)
        }

        // Real Semester Results
        List<Result> finalResults = resultRepository.findByEnrollment_Student_IdAndIsFinalResult(student.getId(), true);
        Map<String, List<Result>> resultsBySemester = finalResults.stream()
                .collect(Collectors.groupingBy(r -> r.getEnrollment().getOffering().getSemester().getName()));

        List<StudentSummaryResponse.SemesterGpa> semesterResults = resultsBySemester.entrySet().stream()
                .map(entry -> {
                    double avgGpa = entry.getValue().stream()
                            .map(Result::getGradePoint)
                            .filter(gp -> gp != null)
                            .mapToDouble(BigDecimal::doubleValue)
                            .average()
                            .orElse(0.0);
                    return new StudentSummaryResponse.SemesterGpa(entry.getKey(), Math.round(avgGpa * 100.0) / 100.0);
                })
                .sorted((a, b) -> a.getSemesterName().compareTo(b.getSemesterName())) // Simple sort, ideally by semester date
                .collect(Collectors.toList());

        return StudentSummaryResponse.builder()
                .studentName(user.getName())
                .programName(student.getProgram() != null ? student.getProgram().getName() : "N/A")
                .studentId(student.getStudentId())
                .registrationNo(student.getRegistrationNo())
                .email(user.getEmail())
                .dob(user.getDateOfBirth())
                .mobile(user.getPhone())
                .gender(user.getGender())
                .bloodGroup(user.getBloodGroup())
                .profileImage(user.getProfileImage())
                .campus("DSC")
                .cgpa(student.getCgpa() != null ? student.getCgpa() : BigDecimal.ZERO)
                .enrolledCourses(enrolledCount)
                .attendancePercent(Math.round(attendancePercent * 10.0) / 10.0)
                .feeStatus(feeStatusLabel)
                .isRegistrationCleared(student.isRegistrationCleared())
                .semesterResults(semesterResults)
                .build();
    }
}
