package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.FinancialAidApplication;
import com.metamorph_x.uams.model.FinancialAidCircular;
import com.metamorph_x.uams.model.Student;

@Repository
public interface FinancialAidApplicationRepository extends JpaRepository<FinancialAidApplication, UUID> {
    List<FinancialAidApplication> findByStudentId(UUID studentId);
    Optional<FinancialAidApplication> findByStudentAndCircular(Student student, FinancialAidCircular circular);
    boolean existsByStudentIdAndCircularId(UUID studentId, UUID circularId);
}
