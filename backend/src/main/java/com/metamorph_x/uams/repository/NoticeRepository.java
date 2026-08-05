package com.metamorph_x.uams.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.Notice;
import com.metamorph_x.uams.model.enums.NoticeTargetRole;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, UUID> {
    List<Notice> findByTargetRole(NoticeTargetRole targetRole);
    List<Notice> findByDepartmentId(UUID departmentId);
    long countByDepartmentId(UUID departmentId);

    List<Notice> findByTargetRoleInOrderByCreatedAtDesc(java.util.Collection<com.metamorph_x.uams.model.enums.NoticeTargetRole> targetRoles);

    @org.springframework.data.jpa.repository.Query("SELECT n FROM Notice n WHERE " +
            "(:search IS NULL OR LOWER(n.title) LIKE :search OR LOWER(n.content) LIKE :search) AND " +
            "(:departmentId IS NULL OR n.department.id = :departmentId)")
    org.springframework.data.domain.Page<Notice> findAllFiltered(
            @org.springframework.data.repository.query.Param("search") String search,
            @org.springframework.data.repository.query.Param("departmentId") UUID departmentId,
            org.springframework.data.domain.Pageable pageable
    );
}
