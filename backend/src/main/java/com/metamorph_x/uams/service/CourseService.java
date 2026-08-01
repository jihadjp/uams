package com.metamorph_x.uams.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.metamorph_x.uams.dto.CourseRequest;
import com.metamorph_x.uams.dto.CourseResponse;

public interface CourseService {
    Page<CourseResponse> getAllCourses(Pageable pageable, String search, UUID departmentId, com.metamorph_x.uams.model.enums.CourseType type, Boolean isActive);
    CourseResponse getCourseById(UUID id);
    CourseResponse createCourse(CourseRequest request);
    CourseResponse updateCourse(UUID id, CourseRequest request);
    void deleteCourse(UUID id);
}
