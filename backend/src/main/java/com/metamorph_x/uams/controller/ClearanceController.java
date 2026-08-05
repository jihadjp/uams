package com.metamorph_x.uams.controller;

import com.metamorph_x.uams.dto.ClearanceResponse;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.service.ClearanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/clearance")
@RequiredArgsConstructor
public class ClearanceController {

    private final ClearanceService clearanceService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ClearanceResponse>> getMyClearance() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        Student student = studentRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student record not found for user: " + user.getId()));

        return ResponseEntity.ok(clearanceService.getMyClearance(student.getId()));
    }
}
