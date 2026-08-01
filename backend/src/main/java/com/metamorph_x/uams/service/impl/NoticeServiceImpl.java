package com.metamorph_x.uams.service.impl;

import com.metamorph_x.uams.model.enums.NoticeTargetRole;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.NoticeRequest;
import com.metamorph_x.uams.dto.NoticeResponse;
import com.metamorph_x.uams.model.Department;
import com.metamorph_x.uams.model.Notice;
import com.metamorph_x.uams.model.NoticeView;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.repository.DepartmentRepository;
import com.metamorph_x.uams.repository.NoticeRepository;
import com.metamorph_x.uams.repository.NoticeViewRepository;
import com.metamorph_x.uams.repository.UserRepository;
import com.metamorph_x.uams.service.NoticeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;
    private final NoticeViewRepository noticeViewRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<NoticeResponse> getAllNotices(Pageable pageable, String search, UUID departmentId) {
        String searchPattern = (search != null && !search.trim().isEmpty()) ? "%" + search.trim().toLowerCase() + "%" : null;
        return noticeRepository.findAllFiltered(searchPattern, departmentId, pageable).map(this::mapToResponse);
    }

    @Override
    public List<NoticeResponse> getNoticesByRole(NoticeTargetRole role) {
        List<NoticeTargetRole> roles = new java.util.ArrayList<>();
        roles.add(NoticeTargetRole.ALL);
        if (role != NoticeTargetRole.ALL) {
            roles.add(role);
        }
        
        return noticeRepository.findByTargetRoleInOrderByCreatedAtDesc(roles).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NoticeResponse createNotice(NoticeRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
        }

        Notice notice = Notice.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory() != null ? request.getCategory() : "General")
                .postedBy(user)
                .targetRole(request.getTargetRole())
                .department(department)
                .viewCount(0)
                .build();

        return mapToResponse(noticeRepository.save(notice));
    }

    @Override
    @Transactional
    public NoticeResponse updateNotice(UUID id, NoticeRequest request) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));
        
        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        if (request.getCategory() != null) notice.setCategory(request.getCategory());
        notice.setTargetRole(request.getTargetRole());

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            notice.setDepartment(department);
        } else {
            notice.setDepartment(null);
        }

        return mapToResponse(noticeRepository.save(notice));
    }

    @Override
    @Transactional
    public void deleteNotice(UUID id) {
        noticeRepository.deleteById(id);
    }

    @Override
    @Transactional
    public long incrementViewCount(UUID id, UUID userId) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));

        if (!noticeViewRepository.existsByNoticeIdAndUserId(id, userId)) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                notice.setViewCount(notice.getViewCount() + 1);
                noticeRepository.save(notice);
                
                noticeViewRepository.save(NoticeView.builder()
                        .notice(notice)
                        .user(user)
                        .build());
            }
        }
        return notice.getViewCount();
    }

    @Override
    @Transactional(readOnly = true)
    public NoticeResponse getNoticeById(UUID id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));
        return mapToResponse(notice);
    }

    private NoticeResponse mapToResponse(Notice notice) {
        return NoticeResponse.builder()
                .id(notice.getId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .category(notice.getCategory())
                .viewCount(notice.getViewCount())
                .postedByName(notice.getPostedBy() != null ? notice.getPostedBy().getName() : "System")
                .targetRole(notice.getTargetRole())
                .departmentName(notice.getDepartment() != null ? notice.getDepartment().getName() : "ALL")
                .createdAt(notice.getCreatedAt())
                .build();
    }
}
