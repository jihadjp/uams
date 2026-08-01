package com.metamorph_x.uams.service.impl;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metamorph_x.uams.dto.CourseOfferingRequest;
import com.metamorph_x.uams.dto.CourseOfferingResponse;
import com.metamorph_x.uams.exception.ResourceNotFoundException;
import com.metamorph_x.uams.model.Batch;
import com.metamorph_x.uams.model.Course;
import com.metamorph_x.uams.model.CourseOffering;
import com.metamorph_x.uams.model.Faculty;
import com.metamorph_x.uams.model.Section;
import com.metamorph_x.uams.model.Semester;
import com.metamorph_x.uams.model.enums.EnrollmentStatus;
import com.metamorph_x.uams.repository.BatchRepository;
import com.metamorph_x.uams.repository.CourseOfferingRepository;
import com.metamorph_x.uams.repository.CourseRepository;
import com.metamorph_x.uams.repository.EnrollmentRepository;
import com.metamorph_x.uams.repository.FacultyRepository;
import com.metamorph_x.uams.repository.SectionRepository;
import com.metamorph_x.uams.repository.SemesterRepository;
import com.metamorph_x.uams.service.CourseOfferingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseOfferingServiceImpl implements CourseOfferingService {

    private final CourseOfferingRepository courseOfferingRepository;
    private final CourseRepository courseRepository;
    private final SemesterRepository semesterRepository;
    private final FacultyRepository facultyRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final BatchRepository batchRepository;
    private final SectionRepository sectionRepository;

    @Override
    public Page<CourseOfferingResponse> getAllOfferings(Pageable pageable, UUID semesterId, UUID departmentId, String batch, String search) {
        String searchPattern = (search != null && !search.trim().isEmpty()) ? "%" + search.trim().toLowerCase() + "%" : null;
        return courseOfferingRepository.findAllFiltered(semesterId, departmentId, batch, searchPattern, pageable).map(this::mapToResponse);
    }

    @Override
    public CourseOfferingResponse getOfferingById(UUID id) {
        CourseOffering offering = courseOfferingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offering not found"));
        return mapToResponse(offering);
    }

    @Override
    @Transactional
    public CourseOfferingResponse createOffering(CourseOfferingRequest request) {
        // Validate Duplicate Section
        if (courseOfferingRepository.existsByCourseIdAndSemesterIdAndBatchIdAndSectionId(
                request.getCourseId(), request.getSemesterId(), request.getBatchId(), request.getSectionId())) {
            throw new IllegalArgumentException("This section already exists for the selected batch.");
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));
        Faculty faculty = facultyRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));
        Section section = sectionRepository.findById(request.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));

        CourseOffering offering = CourseOffering.builder()
                .course(course)
                .semester(semester)
                .faculty(faculty)
                .batch(batch)
                .section(section)
                .scheduleInfo(request.getScheduleInfo())
                .seatLimit(request.getSeatLimit())
                .build();

        return mapToResponse(courseOfferingRepository.save(offering));
    }

    @Override
    @Transactional
    public CourseOfferingResponse updateOffering(UUID id, CourseOfferingRequest request) {
        CourseOffering offering = courseOfferingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offering not found"));

        if (courseOfferingRepository.existsByCourseIdAndSemesterIdAndBatchIdAndSectionIdAndIdNot(
                request.getCourseId(), request.getSemesterId(), request.getBatchId(), request.getSectionId(), id)) {
            throw new IllegalArgumentException("This section already exists for the selected batch.");
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));
        Faculty faculty = facultyRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));
        Section section = sectionRepository.findById(request.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));

        offering.setCourse(course);
        offering.setSemester(semester);
        offering.setFaculty(faculty);
        offering.setBatch(batch);
        offering.setSection(section);
        offering.setScheduleInfo(request.getScheduleInfo());
        offering.setSeatLimit(request.getSeatLimit());

        return mapToResponse(courseOfferingRepository.save(offering));
    }

    @Override
    @Transactional
    public void deleteOffering(UUID id) {
        courseOfferingRepository.deleteById(id);
    }

    private CourseOfferingResponse mapToResponse(CourseOffering offering) {
        return CourseOfferingResponse.builder()
                .id(offering.getId())
                .courseCode(offering.getCourse().getCourseCode())
                .courseTitle(offering.getCourse().getTitle())
                .creditHours(offering.getCourse().getCreditHours())
                .semesterName(offering.getSemester().getName())
                .facultyName(offering.getFaculty().getUser().getName())
                .courseId(offering.getCourse().getId())
                .semesterId(offering.getSemester().getId())
                .facultyId(offering.getFaculty().getId())
                .departmentId(offering.getCourse().getDepartment().getId())
                .departmentName(offering.getCourse().getDepartment().getName())
                .batchId(offering.getBatch().getId())
                .targetBatch(offering.getBatch().getBatchNumber())
                .sectionId(offering.getSection().getId())
                .section(offering.getSection().getName())
                .scheduleInfo(offering.getScheduleInfo())
                .seatLimit(offering.getSeatLimit())
                .enrolledCount(enrollmentRepository.countByOfferingAndStatus(offering, EnrollmentStatus.REGISTERED))
                .build();
    }
}
