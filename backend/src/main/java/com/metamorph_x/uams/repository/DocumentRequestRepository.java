package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.DocumentRequest;

@Repository
public interface DocumentRequestRepository extends JpaRepository<DocumentRequest, UUID> {
    List<DocumentRequest> findByStudentIdOrderByRequestedAtDesc(UUID studentId);
    List<DocumentRequest> findAllByOrderByRequestedAtDesc();
}
