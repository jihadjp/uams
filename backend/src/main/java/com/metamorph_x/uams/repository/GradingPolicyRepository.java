package com.metamorph_x.uams.repository;

import com.metamorph_x.uams.model.GradingPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface GradingPolicyRepository extends JpaRepository<GradingPolicy, Long> {
    @Query("SELECT g FROM GradingPolicy g WHERE :marks >= g.minMarks AND :marks <= g.maxMarks")
    Optional<GradingPolicy> findByMarks(@Param("marks") BigDecimal marks);
}
