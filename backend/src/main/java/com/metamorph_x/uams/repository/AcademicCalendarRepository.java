package com.metamorph_x.uams.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metamorph_x.uams.model.AcademicCalendar;

@Repository
public interface AcademicCalendarRepository extends JpaRepository<AcademicCalendar, UUID> {
    Optional<AcademicCalendar> findBySemesterId(UUID semesterId);
}
