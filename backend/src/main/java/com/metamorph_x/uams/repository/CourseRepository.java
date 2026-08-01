package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    Optional<Course> findByCourseCode(String courseCode);
    List<Course> findByDepartmentId(UUID departmentId);

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Course c WHERE " +
            "(:search IS NULL OR LOWER(c.title) LIKE :search OR LOWER(c.courseCode) LIKE :search) AND " +
            "(:departmentId IS NULL OR c.department.id = :departmentId) AND " +
            "(:type IS NULL OR c.courseType = :type) AND " +
            "(:isActive IS NULL OR c.isActive = :isActive)")
    org.springframework.data.domain.Page<Course> findAllFiltered(
            @org.springframework.data.repository.query.Param("search") String search,
            @org.springframework.data.repository.query.Param("departmentId") UUID departmentId,
            @org.springframework.data.repository.query.Param("type") com.metamorph_x.uams.model.enums.CourseType type,
            @org.springframework.data.repository.query.Param("isActive") Boolean isActive,
            org.springframework.data.domain.Pageable pageable
    );
}
