package com.metamorph_x.uams.controller;

import com.metamorph_x.uams.dto.NoticeRequest;
import com.metamorph_x.uams.dto.NoticeResponse;
import com.metamorph_x.uams.model.User;
import com.metamorph_x.uams.model.enums.NoticeTargetRole;
import com.metamorph_x.uams.model.enums.UserRole;
import com.metamorph_x.uams.service.NoticeService;
import com.metamorph_x.uams.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<NoticeResponse>> getAll(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID departmentId
    ) {
        return ResponseEntity.ok(noticeService.getAllNotices(pageable, search, departmentId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<NoticeResponse>> getMyNotices() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        NoticeTargetRole targetRole;
        if (user.getRole() == UserRole.STUDENT) {
            targetRole = NoticeTargetRole.STUDENT;
        } else if (user.getRole() == UserRole.FACULTY) {
            targetRole = NoticeTargetRole.FACULTY;
        } else {
            targetRole = NoticeTargetRole.ALL;
        }
        return ResponseEntity.ok(noticeService.getNoticesByRole(targetRole));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticeResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(noticeService.getNoticeById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR', 'FACULTY')")
    public ResponseEntity<NoticeResponse> create(@RequestBody NoticeRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Logged in user not found"));
        return ResponseEntity.ok(noticeService.createNotice(request, user.getId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR', 'FACULTY')")
    public ResponseEntity<NoticeResponse> update(@PathVariable UUID id, @RequestBody NoticeRequest request) {
        return ResponseEntity.ok(noticeService.updateNotice(id, request));
    }

    @PutMapping("/{id}/view")
    public ResponseEntity<Long> incrementView(@PathVariable UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Logged in user not found"));
        return ResponseEntity.ok(noticeService.incrementViewCount(id, user.getId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }
}
