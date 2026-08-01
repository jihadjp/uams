package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Result;

@Repository
public interface ResultRepository extends JpaRepository<Result, UUID> {
    List<Result> findByEnrollmentId(UUID enrollmentId);
    List<Result> findByExamId(UUID examId);
    List<Result> findByEnrollment_Student_IdAndIsFinalResult(UUID studentId, boolean isFinalResult);
    Optional<Result> findByEnrollmentIdAndExamId(UUID enrollmentId, UUID examId);
    List<Result> findByEnrollment_Offering_Id(UUID offeringId);
}
