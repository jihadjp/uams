package com.metamorph_x.uams.dto;

import java.util.UUID;
import com.metamorph_x.uams.model.enums.NoticeTargetRole;
import lombok.Data;

@Data
public class NoticeRequest {
    private String title;
    private String content;
    private String category;
    private NoticeTargetRole targetRole;
    private UUID departmentId;
}
