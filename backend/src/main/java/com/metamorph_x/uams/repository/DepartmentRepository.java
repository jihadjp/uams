package com.metamorph_x.uams.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, UUID> {
    Optional<Department> findByCode(String code);
    Optional<Department> findByName(String name);

    @org.springframework.data.jpa.repository.Query("SELECT d FROM Department d WHERE " +
            "(:search IS NULL OR LOWER(d.name) LIKE :search OR LOWER(d.code) LIKE :search)")
    org.springframework.data.domain.Page<Department> findAllFiltered(
            @org.springframework.data.repository.query.Param("search") String search,
            org.springframework.data.domain.Pageable pageable
    );
}
