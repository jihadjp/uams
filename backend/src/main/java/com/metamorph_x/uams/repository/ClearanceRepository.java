package com.metamorph_x.uams.repository;

import com.metamorph_x.uams.model.SemesterClearance;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClearanceRepository extends JpaRepository<SemesterClearance, UUID> {
    @EntityGraph(attributePaths = {"semester"})
    List<SemesterClearance> findByStudent_IdOrderByCreatedAtDesc(UUID studentId);

    java.util.Optional<SemesterClearance> findByStudent_IdAndSemester_Id(UUID studentId, UUID semesterId);
}
