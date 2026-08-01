package com.metamorph_x.uams.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.EnrollmentRequest;
import com.metamorph_x.uams.dto.EnrollmentResponse;
import com.metamorph_x.uams.model.CourseOffering;
import com.metamorph_x.uams.model.Enrollment;
import com.metamorph_x.uams.model.Faculty;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.model.enums.EnrollmentStatus;
import com.metamorph_x.uams.repository.CourseOfferingRepository;
import com.metamorph_x.uams.repository.EnrollmentRepository;
import com.metamorph_x.uams.repository.FacultyRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.service.EnrollmentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseOfferingRepository offeringRepository;
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;

    @Override
    public Page<EnrollmentResponse> getAllEnrollments(Pageable pageable) {
        return enrollmentRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public List<EnrollmentResponse> getMyEnrollments(UUID studentId) {
        return enrollmentRepository.findByStudentId(studentId).stream()
                .filter(e -> e.getStatus() != EnrollmentStatus.DROPPED)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EnrollmentResponse> getMyEnrollments(UUID studentId, UUID semesterId) {
        return enrollmentRepository.findByStudentIdAndOffering_Semester_Id(studentId, semesterId).stream()
                .filter(e -> e.getStatus() != EnrollmentStatus.DROPPED)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EnrollmentResponse registerCourse(EnrollmentRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // 0. Registration Clearance Check
        if (!student.isRegistrationCleared()) {
            throw new RuntimeException("Registration blocked: Academic dues are not cleared for this student.");
        }

        // Security Check: If faculty, must be the student's advisor
        if (currentUser.getRole() == com.metamorph_x.uams.model.enums.UserRole.FACULTY) {
            Faculty faculty = facultyRepository.findByUserEmail(email)
                    .orElseThrow(() -> new RuntimeException("Faculty profile not found"));
            
            if (student.getAdvisor() == null || !student.getAdvisor().getId().equals(faculty.getId())) {
                throw new RuntimeException("Access Denied: You are not authorized to manage registration for this student.");
            }
        }

        CourseOffering offering = offeringRepository.findById(request.getOfferingId())
                .orElseThrow(() -> new RuntimeException("Course offering not found"));

        // 1. Deadline Check
        LocalDate now = LocalDate.now();
        if (now.isAfter(offering.getSemester().getRegistrationDeadline())) {
            throw new RuntimeException("Registration deadline has passed for this semester");
        }

        // 2. Duplicate Course Check
        boolean alreadyEnrolled = enrollmentRepository.existsByStudentIdAndOffering_CourseIdAndOffering_SemesterIdAndStatusNot(
                student.getId(), offering.getCourse().getId(), offering.getSemester().getId(), EnrollmentStatus.DROPPED
        );
        if (alreadyEnrolled) {
            throw new RuntimeException("You are already enrolled in this course for this semester");
        }

        // 3. Seat Limit Check
        long enrolledCount = enrollmentRepository.countByOfferingAndStatus(offering, EnrollmentStatus.REGISTERED);
        if (enrolledCount >= offering.getSeatLimit()) {
            throw new RuntimeException("This section is full");
        }

        // 4. Prerequisite Check
        if (offering.getCourse().getPrerequisiteCourse() != null) {
            boolean hasPassed = enrollmentRepository.existsByStudentAndOffering_CourseAndStatus(
                    student, offering.getCourse().getPrerequisiteCourse(), EnrollmentStatus.COMPLETED);
            if (!hasPassed) {
                throw new RuntimeException("Prerequisite not met: " + offering.getCourse().getPrerequisiteCourse().getCourseCode());
            }
        }

        // 5. Credit Hour Check (Max 18.0)
        List<Enrollment> currentEnrollments = enrollmentRepository.findByStudentIdAndOffering_Semester_Id(student.getId(), offering.getSemester().getId())
                .stream().filter(e -> e.getStatus() != EnrollmentStatus.DROPPED).toList();
        
        BigDecimal currentCredits = currentEnrollments.stream()
                .map(e -> e.getOffering().getCourse().getCreditHours())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (currentCredits.add(offering.getCourse().getCreditHours()).compareTo(new BigDecimal("18.0")) > 0) {
            throw new RuntimeException("Credit limit exceeded. Maximum 18.0 credits allowed per semester");
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .offering(offering)
                .status(EnrollmentStatus.REGISTERED)
                .enrollmentType(request.getEnrollmentType() != null ? request.getEnrollmentType() : com.metamorph_x.uams.model.enums.EnrollmentType.REGULAR)
                .build();

        return mapToResponse(enrollmentRepository.save(enrollment));
    }

    @Override
    @Transactional
    public List<EnrollmentResponse> registerCoursesBulk(com.metamorph_x.uams.dto.BulkEnrollmentRequest request) {
        List<EnrollmentResponse> responses = new java.util.ArrayList<>();
        for (UUID offeringId : request.getOfferingIds()) {
            EnrollmentRequest individualRequest = new EnrollmentRequest();
            individualRequest.setStudentId(request.getStudentId());
            individualRequest.setOfferingId(offeringId);
            responses.add(registerCourse(individualRequest));
        }
        return responses;
    }

    @Override
    @Transactional
    public EnrollmentResponse dropCourse(UUID enrollmentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        // Security Check: If faculty, must be the student's advisor
        if (currentUser.getRole() == com.metamorph_x.uams.model.enums.UserRole.FACULTY) {
            Faculty faculty = facultyRepository.findByUserEmail(email)
                    .orElseThrow(() -> new RuntimeException("Faculty profile not found"));
            
            if (enrollment.getStudent().getAdvisor() == null || !enrollment.getStudent().getAdvisor().getId().equals(faculty.getId())) {
                throw new RuntimeException("Access Denied: You are not authorized to drop courses for this student.");
            }
        }
        
        enrollment.setStatus(EnrollmentStatus.DROPPED);
        return mapToResponse(enrollmentRepository.save(enrollment));
    }

    @Override
    @Transactional
    public void deleteEnrollment(UUID id) {
        enrollmentRepository.deleteById(id);
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .offeringId(enrollment.getOffering().getId())
                .studentName(enrollment.getStudent().getUser().getName())
                .courseCode(enrollment.getOffering().getCourse().getCourseCode())
                .courseTitle(enrollment.getOffering().getCourse().getTitle())
                .creditHours(enrollment.getOffering().getCourse().getCreditHours())
                .section(enrollment.getOffering().getSection() != null ? enrollment.getOffering().getSection().getName() : "N/A")
                .facultyName(enrollment.getOffering().getFaculty().getUser().getName())
                .status(enrollment.getStatus())
                .enrollmentType(enrollment.getEnrollmentType())
                .enrolledAt(enrollment.getEnrolledAt())
                .build();
    }
}
