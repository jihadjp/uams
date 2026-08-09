package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Course;
import com.metamorph_x.uams.model.CourseOffering;
import com.metamorph_x.uams.model.Enrollment;
import com.metamorph_x.uams.model.Student;
import com.metamorph_x.uams.model.enums.EnrollmentStatus;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    List<Enrollment> findByStudentId(UUID studentId);
    List<Enrollment> findByStudentIdAndOffering_Semester_Id(UUID studentId, UUID semesterId);
    List<Enrollment> findByOfferingId(UUID offeringId);
    org.springframework.data.domain.Page<Enrollment> findByOfferingId(UUID offeringId, org.springframework.data.domain.Pageable pageable);
    java.util.Optional<Enrollment> findByStudentIdAndOfferingId(UUID studentId, UUID offeringId);
    long countByOfferingId(UUID offeringId);
    long countByOfferingAndStatusNot(CourseOffering offering, EnrollmentStatus status);
    boolean existsByOfferingAndStatus(CourseOffering offering, EnrollmentStatus status);
    boolean existsByStudentAndOffering_CourseAndStatus(Student student, Course course, EnrollmentStatus status);
    boolean existsByStudentIdAndOffering_CourseIdAndOffering_SemesterIdAndStatusNot(UUID studentId, UUID courseId, UUID semesterId, EnrollmentStatus status);

    List<Enrollment> findByOfferingIdAndStatusNot(UUID offeringId, EnrollmentStatus status);
    org.springframework.data.domain.Page<Enrollment> findByOfferingIdAndStatusNot(UUID offeringId, EnrollmentStatus status, org.springframework.data.domain.Pageable pageable);
}
