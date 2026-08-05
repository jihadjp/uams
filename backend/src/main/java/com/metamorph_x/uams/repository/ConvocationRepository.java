package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.ConvocationApplication;
import com.metamorph_x.uams.model.Student;

@Repository
public interface ConvocationRepository extends JpaRepository<ConvocationApplication, UUID> {
    List<ConvocationApplication> findByStudent(Student student);
    Optional<ConvocationApplication> findByStudentAndConvocationYear(Student student, Integer convocationYear);
    List<ConvocationApplication> findAllByOrderByAppliedAtDesc();
}
