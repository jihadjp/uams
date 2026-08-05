package com.metamorph_x.uams.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClearanceResponse {
    private String semesterName;
    private boolean registrationCleared;
    private boolean midtermCleared;
    private boolean finalExamCleared;
}
