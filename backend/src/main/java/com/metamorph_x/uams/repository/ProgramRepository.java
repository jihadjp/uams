package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Program;

@Repository
public interface ProgramRepository extends JpaRepository<Program, UUID> {
    List<Program> findByDepartmentId(UUID departmentId);
    List<Program> findByDegreeLevel(String degreeLevel);

    @Query("SELECT p FROM Program p WHERE " +
            "(:search IS NULL OR LOWER(p.name) LIKE :search) AND " +
            "(:departmentId IS NULL OR p.department.id = :departmentId)")
    Page<Program> findAllFiltered(
            @Param("search") String search,
            @Param("departmentId") UUID departmentId,
            Pageable pageable
    );
}