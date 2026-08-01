package com.metamorph_x.uams.service;

import java.util.UUID;
import com.metamorph_x.uams.dto.AcademicCalendarRequest;
import com.metamorph_x.uams.dto.AcademicCalendarResponse;

public interface AcademicCalendarService {
    AcademicCalendarResponse getCalendarBySemester(UUID semesterId);
    AcademicCalendarResponse saveCalendar(UUID semesterId, AcademicCalendarRequest request);
}
