package com.metamorph_x.uams.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.metamorph_x.uams.model.NoticeView;

@Repository
public interface NoticeViewRepository extends JpaRepository<NoticeView, UUID> {
    boolean existsByNoticeIdAndUserId(UUID noticeId, UUID userId);
}
