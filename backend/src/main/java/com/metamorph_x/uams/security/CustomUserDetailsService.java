package com.metamorph_x.uams.security;

import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.repository.FacultyRepository;
import com.metamorph_x.uams.repository.StudentRepository;
import com.metamorph_x.uams.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user;

        if (identifier.contains("@")) {
            user = userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + identifier));
        } else {
            // Try lookup as Student Registration No
            Optional<User> studentReg = studentRepository.findByRegistrationNo(identifier).map(s -> s.getUser());
            if (studentReg.isPresent()) {
                user = studentReg.get();
            } else {
                // Try lookup as Student ID (Long format)
                Optional<User> studentId = studentRepository.findByStudentId(identifier).map(s -> s.getUser());
                if (studentId.isPresent()) {
                    user = studentId.get();
                } else {
                    // Try lookup as Faculty Employee ID
                    user = facultyRepository.findByEmployeeId(identifier).map(f -> f.getUser())
                            .orElseThrow(() -> new UsernameNotFoundException("No user found with identifier: " + identifier));
                }
            }
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
