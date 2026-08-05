package com.metamorph_x.uams.service;

import java.util.List;
import java.util.UUID;
import com.metamorph_x.uams.dto.BatchSemesterFeeRequest;
import com.metamorph_x.uams.dto.BatchSemesterFeeResponse;

public interface BatchSemesterFeeService {
    BatchSemesterFeeResponse saveFee(BatchSemesterFeeRequest request);
    List<BatchSemesterFeeResponse> getFeesBySemester(UUID semesterId);
}
