package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "program", "advisor", "advisor.user", "guardian"})
    java.util.Optional<Student> findById(UUID id);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "program", "advisor", "advisor.user", "guardian"})
    Optional<Student> findByRegistrationNo(String registrationNo);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "program", "advisor", "advisor.user", "guardian"})
    Optional<Student> findByStudentId(String studentId);
    List<Student> findByProgramId(UUID programId);
    List<Student> findByBatch_BatchNumber(String batch);
    long countByRegistrationNoStartingWith(String prefix);
    long countByProgram_Department_Id(UUID departmentId);
    Optional<Student> findByUser_Id(UUID userId);
    List<Student> findByAdvisorId(UUID advisorId);
    long countByStatus(com.metamorph_x.uams.model.enums.StudentStatus status);
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "program", "advisor", "advisor.user", "guardian"})
    @org.springframework.data.jpa.repository.Query(
        "SELECT s FROM Student s " +
        "WHERE (:search IS NULL OR LOWER(s.user.name) LIKE :search OR " +
        "LOWER(s.user.email) LIKE :search OR " +
        "LOWER(s.studentId) LIKE :search) AND " +
        "(:programId IS NULL OR s.program.id = :programId) AND " +
        "(:status IS NULL OR s.status = :status)"
    )
    org.springframework.data.domain.Page<Student> findAllFiltered(
            @org.springframework.data.repository.query.Param("search") String search,
            @org.springframework.data.repository.query.Param("programId") UUID programId,
            @org.springframework.data.repository.query.Param("status") com.metamorph_x.uams.model.enums.StudentStatus status,
            org.springframework.data.domain.Pageable pageable
    );
}
