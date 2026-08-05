package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.CourseOffering;

@Repository
public interface CourseOfferingRepository extends JpaRepository<CourseOffering, UUID> {
    List<CourseOffering> findBySemesterId(UUID semesterId);
    List<CourseOffering> findByFacultyId(UUID facultyId);
    List<CourseOffering> findByCourseIdAndSemesterId(UUID courseId, UUID semesterId);
    Page<CourseOffering> findBySemesterId(UUID semesterId, Pageable pageable);
    Page<CourseOffering> findBySemesterIdAndCourse_Department_Id(UUID semesterId, UUID departmentId, Pageable pageable);

    List<CourseOffering> findBySemesterIdAndFacultyId(UUID semesterId, UUID facultyId);

    // Duplicate Section Check Methods
    boolean existsByCourseIdAndSemesterIdAndBatchIdAndSectionId(
            UUID courseId, UUID semesterId, UUID batchId, UUID sectionId
    );

    boolean existsByCourseIdAndSemesterIdAndBatchIdAndSectionIdAndIdNot(
            UUID courseId, UUID semesterId, UUID batchId, UUID sectionId, UUID id
    );

    @Query("SELECT o FROM CourseOffering o WHERE " +
            "(:semesterId IS NULL OR o.semester.id = :semesterId) AND " +
            "(:departmentId IS NULL OR o.course.department.id = :departmentId) AND " +
            "(:facultyId IS NULL OR o.faculty.id = :facultyId) AND " +
            "(:batch IS NULL OR o.batch.batchNumber = :batch) AND " +
            "(:search IS NULL OR LOWER(o.course.title) LIKE :search OR " +
            "LOWER(o.course.courseCode) LIKE :search OR " +
            "LOWER(o.faculty.user.name) LIKE :search)")
    Page<CourseOffering> findAllFiltered(
            @Param("semesterId") UUID semesterId,
            @Param("departmentId") UUID departmentId,
            @Param("facultyId") UUID facultyId,
            @Param("batch") String batch,
            @Param("search") String search,
            Pageable pageable
    );
}
