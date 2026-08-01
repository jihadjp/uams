package com.metamorph_x.uams.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Semester;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, UUID> {
    Optional<Semester> findByName(String name);
    
    @Query("SELECT s FROM Semester s WHERE s.status = 'ONGOING' OR s.status = 'REGISTRATION'")
    Optional<Semester> findByActiveTrue();
}
