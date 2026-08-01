package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Faculty;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, UUID> {
    Optional<Faculty> findByEmployeeId(String employeeId);
    List<Faculty> findByDepartmentId(UUID departmentId);
    Page<Faculty> findByDepartmentId(UUID departmentId, Pageable pageable);
    Optional<Faculty> findByUserEmail(String email);
    Optional<Faculty> findByUser_Id(UUID userId);
    long countByEmployeeIdStartingWith(String prefix);

    @org.springframework.data.jpa.repository.Query("SELECT f FROM Faculty f WHERE " +
            "(:search IS NULL OR LOWER(f.user.name) LIKE :search OR " +
            "LOWER(f.user.email) LIKE :search OR LOWER(f.employeeId) LIKE :search) AND " +
            "(:departmentId IS NULL OR f.department.id = :departmentId)")
    Page<Faculty> findAllFiltered(
            @org.springframework.data.repository.query.Param("search") String search,
            @org.springframework.data.repository.query.Param("departmentId") UUID departmentId,
            Pageable pageable
    );
}
