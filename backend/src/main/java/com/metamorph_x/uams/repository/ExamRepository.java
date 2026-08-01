package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Exam;

@Repository
public interface ExamRepository extends JpaRepository<Exam, UUID> {
    List<Exam> findByOfferingId(UUID offeringId);
}
