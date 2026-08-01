package com.metamorph_x.uams.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Attendance;
import com.metamorph_x.uams.model.Enrollment;
import com.metamorph_x.uams.model.enums.AttendanceStatus;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    List<Attendance> findByEnrollmentId(UUID enrollmentId);
    Optional<Attendance> findByEnrollmentAndClassDate(Enrollment enrollment, LocalDate classDate);
    List<Attendance> findByEnrollment_Offering_IdAndClassDate(UUID offeringId, LocalDate date);
    List<Attendance> findByEnrollment_Student_Id(UUID studentId);
    long countByEnrollmentIn(List<Enrollment> enrollments);
    long countByEnrollmentInAndStatus(List<Enrollment> enrollments, AttendanceStatus status);
}
