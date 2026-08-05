package com.metamorph_x.uams.service;

import java.util.List;
import java.util.UUID;

import com.metamorph_x.uams.dto.EvaluationRequest;
import com.metamorph_x.uams.dto.EvaluationResponse;
import com.metamorph_x.uams.dto.FacultyEvaluationSummary;
import com.metamorph_x.uams.dto.StudentEvaluationStatusResponse;

public interface EvaluationService {
    EvaluationResponse submitEvaluation(EvaluationRequest request);
    List<StudentEvaluationStatusResponse> getEvaluationStatus(UUID studentId, UUID semesterId);
    FacultyEvaluationSummary getFacultySummary(UUID facultyId);
}
