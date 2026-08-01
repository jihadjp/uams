package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.metamorph_x.uams.model.Section;

public interface SectionRepository extends JpaRepository<Section, UUID> {
    List<Section> findByBatchId(UUID batchId);
    boolean existsByNameAndBatchId(String name, UUID batchId);
}
