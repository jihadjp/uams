package com.metamorph_x.uams.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.BatchSemesterFee;

@Repository
public interface BatchSemesterFeeRepository extends JpaRepository<BatchSemesterFee, UUID> {
    Optional<BatchSemesterFee> findByBatchIdAndSemesterId(UUID batchId, UUID semesterId);
}
