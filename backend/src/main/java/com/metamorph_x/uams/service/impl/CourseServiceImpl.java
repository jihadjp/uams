package com.metamorph_x.uams.service.impl;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.CourseRequest;
import com.metamorph_x.uams.dto.CourseResponse;
import com.metamorph_x.uams.model.Course;
import com.metamorph_x.uams.model.Department;
import com.metamorph_x.uams.model.enums.CourseType;
import com.metamorph_x.uams.repository.CourseRepository;
import com.metamorph_x.uams.repository.DepartmentRepository;
import com.metamorph_x.uams.service.CourseService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public Page<CourseResponse> getAllCourses(Pageable pageable, String search, UUID departmentId, CourseType type, Boolean isActive) {
        String searchPattern = (search != null && !search.trim().isEmpty()) ? "%" + search.trim().toLowerCase() + "%" : null;
        return courseRepository.findAllFiltered(searchPattern, departmentId, type, isActive, pageable).map(this::mapToResponse);
    }

    @Override
    public CourseResponse getCourseById(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return mapToResponse(course);
    }

    @Override
    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Course prerequisite = null;
        if (request.getPrerequisiteCourseId() != null) {
            prerequisite = courseRepository.findById(request.getPrerequisiteCourseId())
                    .orElseThrow(() -> new RuntimeException("Prerequisite course not found"));
        }

        Course course = Course.builder()
                .department(department)
                .courseCode(request.getCourseCode())
                .title(request.getTitle())
                .creditHours(request.getCreditHours())
                .prerequisiteCourse(prerequisite)
                .courseType(request.getCourseType() != null ? request.getCourseType() : CourseType.THEORY)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .description(request.getDescription())
                .build();

        return mapToResponse(courseRepository.save(course));
    }

    @Override
    @Transactional
    public CourseResponse updateCourse(UUID id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Course prerequisite = null;
        if (request.getPrerequisiteCourseId() != null) {
            prerequisite = courseRepository.findById(request.getPrerequisiteCourseId())
                    .orElseThrow(() -> new RuntimeException("Prerequisite course not found"));
        }

        course.setDepartment(department);
        course.setCourseCode(request.getCourseCode());
        course.setTitle(request.getTitle());
        course.setCreditHours(request.getCreditHours());
        course.setPrerequisiteCourse(prerequisite);
        if (request.getCourseType() != null) course.setCourseType(request.getCourseType());
        if (request.getIsActive() != null) course.setActive(request.getIsActive());
        course.setDescription(request.getDescription());

        return mapToResponse(courseRepository.save(course));
    }

    @Override
    @Transactional
    public void deleteCourse(UUID id) {
        courseRepository.deleteById(id);
    }

    private CourseResponse mapToResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .departmentName(course.getDepartment().getName())
                .courseCode(course.getCourseCode())
                .title(course.getTitle())
                .creditHours(course.getCreditHours())
                .prerequisiteCourseCode(course.getPrerequisiteCourse() != null ? course.getPrerequisiteCourse().getCourseCode() : null)
                .courseType(course.getCourseType())
                .isActive(course.isActive())
                .updatedAt(course.getUpdatedAt())
                .description(course.getDescription())
                .build();
    }
}
