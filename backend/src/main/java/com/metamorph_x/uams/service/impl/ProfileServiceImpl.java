package com.metamorph_x.uams.service.impl;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import com.metamorph_x.uams.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.metamorph_x.uams.model.Faculty;
import com.metamorph_x.uams.model.Guardian;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.model.enums.GuardianRelation;
import com.metamorph_x.uams.model.enums.UserRole;
import com.metamorph_x.uams.repository.FacultyRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.service.FileStorageService;
import com.metamorph_x.uams.service.ProfileService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final com.metamorph_x.uams.repository.ResultRepository resultRepository;
    private final com.metamorph_x.uams.repository.GradingPolicyRepository gradingPolicyRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    @Override
    public Map<String, Object> getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> profile = new HashMap<>();
        
        // Return sanitized user data
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("phone", user.getPhone());
        userData.put("gender", user.getGender());
        userData.put("bloodGroup", user.getBloodGroup());
        userData.put("dateOfBirth", user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null);
        userData.put("profileImage", user.getProfileImage());
        userData.put("role", user.getRole());
        profile.put("user", userData);

        if (user.getRole() == UserRole.STUDENT) {
            studentRepository.findByUser_Id(user.getId()).ifPresent(s -> {
                Map<String, Object> studentData = new HashMap<>();
                studentData.put("id", s.getId());
                studentData.put("studentId", s.getStudentId());
                studentData.put("registrationNo", s.getRegistrationNo());
                studentData.put("batch", s.getBatch() != null ? s.getBatch().getBatchNumber() : "N/A");
                studentData.put("currentSemester", s.getCurrentSemester());

                // Calculate CGPA dynamically (3NF Compliance)
                java.math.BigDecimal totalWeightedGradePoints = java.math.BigDecimal.ZERO;
                java.math.BigDecimal totalCredits = java.math.BigDecimal.ZERO;
                
                java.util.List<com.metamorph_x.uams.model.Result> finalResults = resultRepository.findByEnrollment_Student_IdAndIsFinalResult(s.getId(), true);
                
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

                studentData.put("cgpa", cgpa);
                studentData.put("isRegistrationCleared", s.isRegistrationCleared());
                studentData.put("status", s.getStatus());
                studentData.put("guardianName", s.getGuardian() != null ? s.getGuardian().getName() : null);
                studentData.put("guardianPhone", s.getGuardian() != null ? s.getGuardian().getPhone() : null);
                studentData.put("guardianRelation", s.getGuardian() != null ? s.getGuardian().getRelation() : null);
                
                // Advisor Details (Mentor)
                if (s.getAdvisor() != null && s.getAdvisor().getUser() != null) {
                    studentData.put("advisorId", s.getAdvisor().getId());
                    studentData.put("advisorName", s.getAdvisor().getUser().getName());
                    studentData.put("advisorEmail", s.getAdvisor().getUser().getEmail());
                    studentData.put("advisorPhone", s.getAdvisor().getUser().getPhone());
                    studentData.put("advisorProfileImage", s.getAdvisor().getUser().getProfileImage());
                    studentData.put("advisorDesignation", s.getAdvisor().getDesignation());
                }

                if (s.getProgram() != null) {
                    studentData.put("programName", s.getProgram().getName());
                }
                profile.put("student", studentData);
            });
        } else if (user.getRole() == UserRole.FACULTY) {
            facultyRepository.findByUser_Id(user.getId()).ifPresent(f -> {
                Map<String, Object> facultyData = new HashMap<>();
                facultyData.put("id", f.getId());
                facultyData.put("employeeId", f.getEmployeeId());
                facultyData.put("designation", f.getDesignation());
                facultyData.put("joinedAt", f.getJoinedAt() != null ? f.getJoinedAt().toString() : null);
                if (f.getDepartment() != null) {
                    facultyData.put("departmentName", f.getDepartment().getName());
                }
                profile.put("faculty", facultyData);
            });
        }
        
        return profile;
    }

    @Override
    @Transactional
    public void updateProfile(String email, Map<String, Object> data) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 1. Update Core User Info
        if (data.containsKey("name")) user.setName((String) data.get("name"));
        if (data.containsKey("phone")) user.setPhone((String) data.get("phone"));
        if (data.containsKey("gender")) user.setGender((String) data.get("gender"));
        if (data.containsKey("bloodGroup")) user.setBloodGroup((String) data.get("bloodGroup"));
        
        String dob = (String) data.get("dateOfBirth");
        if (dob != null && !dob.isEmpty()) {
            try {
                user.setDateOfBirth(LocalDate.parse(dob));
            } catch (Exception e) {
                log.warn("Invalid DOB format for {}: {}", email, dob);
            }
        }

        if (data.containsKey("profileImage")) {
            String imgPath = (String) data.get("profileImage");
            if (imgPath != null && imgPath.contains("/api/uploads/")) {
                imgPath = imgPath.substring(imgPath.indexOf("/api/uploads/") + 13);
            }
            user.setProfileImage(imgPath);
        }
        userRepository.save(user);

        // 2. Role Specific Updates (Optional fields like Guardian Info)
        if (user.getRole() == UserRole.STUDENT) {
            studentRepository.findByUser_Id(user.getId()).ifPresent(s -> {
                if (data.get("student") instanceof Map<?, ?> sData) {
                    String gName = (String) sData.get("guardianName");
                    String gPhone = (String) sData.get("guardianPhone");
                    String gRelation = (String) sData.get("guardianRelation");

                    // Only update if at least a name is provided
                    if (gName != null && !gName.trim().isEmpty()) {
                        Guardian guardian = s.getGuardian();
                        if (guardian == null) guardian = new Guardian();
                        
                        guardian.setName(gName);
                        guardian.setPhone(gPhone);
                        
                        if (gRelation != null) {
                            try {
                                guardian.setRelation(com.metamorph_x.uams.model.enums.GuardianRelation.valueOf(gRelation));
                            } catch (Exception e) {}
                        }
                        if (sData.get("guardianOtherRelation") != null) guardian.setOtherRelation((String) sData.get("guardianOtherRelation"));
                        
                        s.setGuardian(guardian);
                    } else if ((gPhone != null && !gPhone.trim().isEmpty()) || (gRelation != null && !gRelation.trim().isEmpty())) {
                        // User provided other info but NO name
                        throw new IllegalArgumentException("Guardian Name is required if other guardian details are provided.");
                    }
                }
                studentRepository.save(s);
            });
        }
    }

    @Override
    @Transactional
    public String uploadProfilePicture(String email, MultipartFile file) {
        try {
            // Strictly just upload and return path. Don't save to user entity yet.
            // Saving will happen when they click "Save Changes" on the profile page.
            return fileStorageService.storeFile(file, "profile-pictures");
        } catch (Exception e) {
            log.error("Failed to upload profile picture for {}: {}", email, e.getMessage());
            throw new RuntimeException("Could not upload profile picture: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid current password");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
