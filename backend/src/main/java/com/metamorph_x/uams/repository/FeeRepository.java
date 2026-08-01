package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Fee;

@Repository
public interface FeeRepository extends JpaRepository<Fee, UUID> {
    List<Fee> findByStudentId(UUID studentId);
    List<Fee> findByStudentIdAndSemesterId(UUID studentId, UUID semesterId);

    boolean existsByStudentIdAndSemesterId(UUID studentId, UUID semesterId);
}