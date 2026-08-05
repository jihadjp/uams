package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Evaluation;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, UUID> {
    boolean existsByStudentIdAndOfferingId(UUID studentId, UUID offeringId);
    
    @Query("SELECT e FROM Evaluation e WHERE e.offering.faculty.id = :facultyId")
    List<Evaluation> findByFacultyId(@Param("facultyId") UUID facultyId);
}
