package com.metamorph_x.uams.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.model.enums.UserRole;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.repository.SemesterRepository;
import com.metamorph_x.uams.repository.FeeRepository;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.Semester;
import com.metamorph_x.uams.model.Fee;
import com.metamorph_x.uams.model.Batch;
import com.metamorph_x.uams.model.BatchSemesterFee;
import com.metamorph_x.uams.repository.BatchRepository;
import com.metamorph_x.uams.repository.BatchSemesterFeeRepository;
import com.metamorph_x.uams.service.FeeService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final SemesterRepository semesterRepository;
    private final FeeRepository feeRepository;
    private final BatchRepository batchRepository;
    private final BatchSemesterFeeRepository batchSemesterFeeRepository;
    private final FeeService feeService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createAdmin("System Admin", "admin@uams.edu", "admin123");
        createAdmin("Team Member 1", "admin1@uams.edu", "admin123");
        createAdmin("Team Member 2", "admin2@uams.edu", "admin123");
        createAdmin("Team Member 3", "admin3@uams.edu", "admin123");
        
        // Default Registrar
        createRoleUser("Academic Registrar", "registrar@uams.edu", "registrar123", UserRole.REGISTRAR);

        try {
            seedBatchFees();
            seedSampleFees();
        } catch (Exception e) {
            log.warn("Could not seed sample fees due to data inconsistency: {}. You may need to reset your database.", e.getMessage());
        }
    }

    private void seedBatchFees() {
        List<Batch> batches = batchRepository.findAll();
        List<Semester> semesters = semesterRepository.findAll();
        
        for (Batch batch : batches) {
            for (Semester semester : semesters) {
                if (batchSemesterFeeRepository.findByBatchIdAndSemesterId(batch.getId(), semester.getId()).isEmpty()) {
                    BatchSemesterFee bsf = BatchSemesterFee.builder()
                            .batch(batch)
                            .semester(semester)
                            .registrationFee(new BigDecimal("15000.00")) // Default 15k
                            .build();
                    batchSemesterFeeRepository.save(bsf);
                }
            }
        }
    }

    private void seedSampleFees() {
        List<Student> students;
        try {
            students = studentRepository.findAll();
        } catch (Exception e) {
            log.error("Failed to load students for fee seeding. This usually happens after a schema change. Error: {}", e.getMessage());
            return;
        }
        List<Semester> semesters = semesterRepository.findAll();
        
        if (students.isEmpty() || semesters.isEmpty()) return;

        for (Student student : students) {
            for (Semester semester : semesters) {
                // Use the new sync logic instead of hardcoded building
                try {
                    feeService.syncSemesterFee(student.getId(), semester.getId());
                    
                    // Optionally simulate a payment of the registration fee so they can register
                    feeRepository.findByStudent_IdAndSemester_Id(student.getId(), semester.getId()).stream()
                        .findFirst()
                        .ifPresent(fee -> {
                            if (fee.getAmountPaid().compareTo(BigDecimal.ZERO) == 0) {
                                fee.setAmountPaid(fee.getRegistrationFee());
                                fee.setStatus(com.metamorph_x.uams.model.enums.FeeStatus.PARTIAL);
                                feeRepository.save(fee);
                            }
                        });
                } catch (Exception e) {
                    log.error("Error seeding fee for student {}: {}", student.getStudentId(), e.getMessage());
                }
            }
        }
        log.info("Sample fee records seeded for testing using dynamic calculation logic.");
    }

    private void createAdmin(String name, String email, String password) {
        createRoleUser(name, email, password, UserRole.ADMIN);
    }

    private void createRoleUser(String name, String email, String password, UserRole role) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(password))
                    .role(role)
                    .isActive(true)
                    .isVerified(true)
                    .build();
            
            userRepository.save(user);
            log.info("{} user created: {} / {}", role, email, password);
        } else {
            log.info("{} user already exists: {}", role, email);
        }
    }
}
