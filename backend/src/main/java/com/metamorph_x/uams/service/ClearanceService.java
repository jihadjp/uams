package com.metamorph_x.uams.service;

import com.metamorph_x.uams.dto.ClearanceResponse;
import java.util.List;
import java.util.UUID;

public interface ClearanceService {
    List<ClearanceResponse> getMyClearance(UUID studentId);
}
