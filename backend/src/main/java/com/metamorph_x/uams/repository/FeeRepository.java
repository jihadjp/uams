package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Fee;

@Repository
public interface FeeRepository extends JpaRepository<Fee, UUID> {
    @EntityGraph(attributePaths = {"student", "student.user", "semester"})
    List<Fee> findByStudent_Id(UUID studentId);

    @EntityGraph(attributePaths = {"student", "student.user", "semester"})
    List<Fee> findByStudent_IdAndSemester_Id(UUID studentId, UUID semesterId);

    boolean existsByStudent_IdAndSemester_Id(UUID studentId, UUID semesterId);
}
