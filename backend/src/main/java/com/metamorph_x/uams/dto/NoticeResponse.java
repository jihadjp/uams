package com.metamorph_x.uams.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import com.metamorph_x.uams.model.enums.NoticeTargetRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NoticeResponse {
    private UUID id;
    private String title;
    private String content;
    private String category;
    private long viewCount;
    private String postedByName;
    private NoticeTargetRole targetRole;
    private String departmentName;
    private LocalDateTime createdAt;
}
