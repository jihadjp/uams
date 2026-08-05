package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.metamorph_x.uams.model.Batch;

public interface BatchRepository extends JpaRepository<Batch, UUID> {
    List<Batch> findByProgramId(UUID programId);
    List<Batch> findByProgram_DepartmentId(UUID departmentId);
    boolean existsByBatchNumberAndProgramId(String batchNumber, UUID programId);
}
