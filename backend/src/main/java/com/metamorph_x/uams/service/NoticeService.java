package com.metamorph_x.uams.service;

import com.metamorph_x.uams.model.enums.NoticeTargetRole;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.NoticeRequest;
import com.metamorph_x.uams.dto.NoticeResponse;

public interface NoticeService {
    Page<NoticeResponse> getAllNotices(Pageable pageable, String search, UUID departmentId);
    List<NoticeResponse> getNoticesByRole(NoticeTargetRole role);
    NoticeResponse createNotice(NoticeRequest request, UUID userId);
    NoticeResponse updateNotice(UUID id, NoticeRequest request);
    void deleteNotice(UUID id);
    long incrementViewCount(UUID id, UUID userId);
    NoticeResponse getNoticeById(UUID id);
}
