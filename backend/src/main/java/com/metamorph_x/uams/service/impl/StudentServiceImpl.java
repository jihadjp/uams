package com.metamorph_x.uams.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.StudentRequest;
import com.metamorph_x.uams.dto.StudentResponse;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.Batch;
import com.metamorph_x.uams.model.Faculty;
import com.metamorph_x.uams.model.Guardian;
import com.metamorph_x.uams.model.Program;
import com.metamorph_x.uams.model.Section;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.model.enums.UserRole;
import com.metamorph_x.uams.repository.BatchRepository;
import com.metamorph_x.uams.repository.FacultyRepository;
import com.metamorph_x.uams.repository.ProgramRepository;
import com.metamorph_x.uams.repository.SectionRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.repository.ResultRepository;
import com.metamorph_x.uams.repository.GradingPolicyRepository;
import com.metamorph_x.uams.service.PasswordGeneratorService;
import com.metamorph_x.uams.service.StudentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final ProgramRepository programRepository;
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final BatchRepository batchRepository;
    private final SectionRepository sectionRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentIdGeneratorServiceImpl idGeneratorService;
    private final PasswordGeneratorService passwordGeneratorService;
    private final ResultRepository resultRepository;
    private final GradingPolicyRepository gradingPolicyRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getAllStudents(Pageable pageable, String search, UUID programId, com.metamorph_x.uams.model.enums.StudentStatus status) {
        String searchPattern = (search != null && !search.trim().isEmpty()) ? "%" + search.trim().toLowerCase() + "%" : null;
        return studentRepository.findAllFiltered(searchPattern, programId, status, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(UUID id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToResponse(student);
    }

    @Override
    public List<StudentResponse> getAdvisees(UUID advisorId) {
        return studentRepository.findByAdvisorId(advisorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        if (programRepository.count() == 0) {
            throw new IllegalArgumentException("No programs found. Please create a Program before registering a student.");
        }
        if (batchRepository.count() == 0) {
            throw new IllegalArgumentException("No batches found. Please create a Batch before registering a student.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String tempPassword = passwordGeneratorService.generateRandomPassword(10);

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(tempPassword))
                .role(UserRole.STUDENT)
                .phone(request.getPhone())
                .gender(request.getGender())
                .bloodGroup(request.getBloodGroup())
                .dateOfBirth(request.getDateOfBirth())
                .isActive(true)
                .isVerified(true)
                .mustChangePassword(true)
                .build();

        user = userRepository.save(user);

        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found"));

        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        Faculty advisor = null;
        if (request.getAdvisorId() != null) {
            advisor = facultyRepository.findById(request.getAdvisorId())
                    .orElseThrow(() -> new RuntimeException("Faculty advisor not found"));
        }

        Map<String, String> ids = idGeneratorService.generateStudentIds(batch.getBatchInitial(), program.getDepartment().getId());

        Guardian guardian = null;
        if (request.getGuardianName() != null && !request.getGuardianName().isEmpty()) {
            guardian = Guardian.builder()
                    .name(request.getGuardianName())
                    .phone(request.getGuardianPhone())
                    .relation(request.getGuardianRelation())
                    .otherRelation(request.getGuardianOtherRelation())
                    .build();
        }

        Student student = Student.builder()
                .user(user)
                .program(program)
                .advisor(advisor)
                .batch(batch)
                .guardian(guardian)
                .admittedAt(LocalDate.now())
                .status(request.getStatus())
                .currentSemester(1)
                .studentId(ids.get("studentId"))
                .registrationNo(ids.get("registrationNo"))
                .build();

        StudentResponse response = mapToResponse(studentRepository.save(student));
        response.setTemporaryPassword(tempPassword);
        return response;
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(UUID id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        User user = student.getUser();
        if (request.getName() != null) user.setName(request.getName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getBloodGroup() != null) user.setBloodGroup(request.getBloodGroup());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);
        
        if (request.getProgramId() != null) {
            Program program = programRepository.findById(request.getProgramId())
                    .orElseThrow(() -> new ResourceNotFoundException("Program not found with id: " + request.getProgramId()));
            student.setProgram(program);
        }

        if (request.getAdvisorId() != null) {
            Faculty advisor = facultyRepository.findById(request.getAdvisorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Faculty advisor not found with id: " + request.getAdvisorId()));
            student.setAdvisor(advisor);
        } else {
            student.setAdvisor(null);
        }

        if (request.getBatchId() != null) {
            Batch batch = batchRepository.findById(request.getBatchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));
            student.setBatch(batch);
        }
        
        // Update Guardian Info
        if (request.getGuardianName() != null && !request.getGuardianName().trim().isEmpty()) {
            Guardian guardian = student.getGuardian();
            if (guardian == null) {
                guardian = new Guardian();
            }
            guardian.setName(request.getGuardianName().trim());
            guardian.setPhone(request.getGuardianPhone());
            guardian.setRelation(request.getGuardianRelation());
            guardian.setOtherRelation(request.getGuardianOtherRelation());
            student.setGuardian(guardian);
        }
        // Note: We don't set name to null if it's empty to avoid DB constraints.
        // If a guardian exists, we just update what's provided.
        
        if (request.getStatus() != null) student.setStatus(request.getStatus());

        return mapToResponse(studentRepository.save(student));
    }

    @Override
    @Transactional
    public StudentResponse updateRegistrationClearance(UUID id, boolean isCleared) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setRegistrationCleared(isCleared);
        return mapToResponse(studentRepository.save(student));
    }

    @Override
    @Transactional
    public StudentResponse updateLaptopStatus(UUID id, boolean hasReceived) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setHasReceivedLaptop(hasReceived);
        return mapToResponse(studentRepository.save(student));
    }

    @Override
    @Transactional
    public StudentResponse updateSection(UUID id, UUID sectionId) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found"));
        
        if (!section.getBatch().getId().equals(student.getBatch().getId())) {
            throw new IllegalArgumentException("Section does not belong to student's batch");
        }
        
        student.setSection(section);
        return mapToResponse(studentRepository.save(student));
    }

    @Override
    @Transactional
    public void deleteStudent(UUID id) {
        studentRepository.deleteById(id);
    }

    @Override
    @Transactional
    public StudentResponse completeProfile(UUID userId, UUID programId, String batchStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        // For completeProfile, we might need a way to find/create batch or handle differently.
        // Assuming we look up the batch by number and program.
        Batch batch = batchRepository.findAll().stream()
                .filter(b -> b.getBatchNumber().equals(batchStr) && b.getProgram().getId().equals(programId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Batch not found for this program. Please contact admin."));

        Map<String, String> ids = idGeneratorService.generateStudentIds(batch.getBatchInitial(), program.getDepartment().getId());

        Student student = Student.builder()
                .user(user)
                .program(program)
                .batch(batch)
                .admittedAt(LocalDate.now())
                .currentSemester(1)
                .studentId(ids.get("studentId"))
                .registrationNo(ids.get("registrationNo"))
                .build();

        return mapToResponse(studentRepository.save(student));
    }

    private StudentResponse mapToResponse(Student student) {
        String batchStr = "N/A";
        if (student.getBatch() != null) {
            batchStr = student.getBatch().getBatchNumber() + " (" + student.getBatch().getBatchInitial() + ")";
        }

        // Calculate CGPA dynamically
        java.math.BigDecimal totalWeightedGradePoints = java.math.BigDecimal.ZERO;
        java.math.BigDecimal totalCredits = java.math.BigDecimal.ZERO;
        
        List<com.metamorph_x.uams.model.Result> finalResults = resultRepository.findByEnrollment_Student_IdAndIsFinalResult(student.getId(), true);
        
        for (com.metamorph_x.uams.model.Result res : finalResults) {
            java.math.BigDecimal credits = res.getEnrollment().getOffering().getCourse().getCreditHours();
            com.metamorph_x.uams.model.GradingPolicy policy = gradingPolicyRepository.findByMarks(res.getMarksObtained())
                    .orElse(com.metamorph_x.uams.model.GradingPolicy.builder().gradePoint(java.math.BigDecimal.ZERO).build());
            
            totalWeightedGradePoints = totalWeightedGradePoints.add(policy.getGradePoint().multiply(credits));
            totalCredits = totalCredits.add(credits);
        }

        java.math.BigDecimal cgpa = totalCredits.compareTo(java.math.BigDecimal.ZERO) > 0 
                ? totalWeightedGradePoints.divide(totalCredits, 2, java.math.RoundingMode.HALF_UP) 
                : java.math.BigDecimal.ZERO;

        return StudentResponse.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .name(student.getUser().getName())
                .email(student.getUser().getEmail())
                .studentId(student.getStudentId())
                .registrationNo(student.getRegistrationNo())
                .programId(student.getProgram() != null ? student.getProgram().getId() : null)
                .programName(student.getProgram() != null ? student.getProgram().getName() : "N/A")
                .advisorId(student.getAdvisor() != null ? student.getAdvisor().getId() : null)
                .advisorName(student.getAdvisor() != null ? student.getAdvisor().getUser().getName() : "NOT ASSIGNED")
                .advisorEmail(student.getAdvisor() != null ? student.getAdvisor().getUser().getEmail() : null)
                .advisorPhone(student.getAdvisor() != null ? student.getAdvisor().getUser().getPhone() : null)
                .advisorProfileImage(student.getAdvisor() != null ? student.getAdvisor().getUser().getProfileImage() : null)
                .advisorDesignation(student.getAdvisor() != null ? student.getAdvisor().getDesignation() : null)
                .batchId(student.getBatch() != null ? student.getBatch().getId() : null)
                .batch(batchStr)
                .batchNumber(student.getBatch() != null ? student.getBatch().getBatchNumber() : null)
                .sectionId(student.getSection() != null ? student.getSection().getId() : null)
                .sectionName(student.getSection() != null ? student.getSection().getName() : "NOT ASSIGNED")
                .currentSemester(student.getCurrentSemester())
                .cgpa(cgpa)
                .isRegistrationCleared(student.isRegistrationCleared())
                .hasReceivedLaptop(student.isHasReceivedLaptop())
                .status(student.getStatus())
                .guardianName(student.getGuardian() != null ? student.getGuardian().getName() : null)
                .guardianPhone(student.getGuardian() != null ? student.getGuardian().getPhone() : null)
                .guardianRelation(student.getGuardian() != null ? student.getGuardian().getRelation() : null)
                .guardianOtherRelation(student.getGuardian() != null ? student.getGuardian().getOtherRelation() : null)
                .admittedAt(student.getAdmittedAt())
                .phone(student.getUser().getPhone())
                .gender(student.getUser().getGender())
                .bloodGroup(student.getUser().getBloodGroup())
                .dateOfBirth(student.getUser().getDateOfBirth())
                .profileImage(student.getUser().getProfileImage())
                .build();
    }
}
