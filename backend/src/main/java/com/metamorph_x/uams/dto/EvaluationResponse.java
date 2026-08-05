package com.metamorph_x.uams.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EvaluationResponse {
    private UUID id;
    private String courseCode;
    private String courseTitle;
    private String facultyName;
    private BigDecimal averageRating;
    private String comments;
    private LocalDateTime createdAt;
}
