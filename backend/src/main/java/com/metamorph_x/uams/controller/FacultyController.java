package com.metamorph_x.uams.controller;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.metamorph_x.uams.dto.FacultyRequest;
import com.metamorph_x.uams.dto.FacultyResponse;
import com.metamorph_x.uams.service.FacultyService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculties")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<Page<FacultyResponse>> getAll(
            Pageable pageable, 
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID departmentId
    ) {
        return ResponseEntity.ok(facultyService.getAllFaculties(pageable, search, departmentId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR', 'FACULTY')")
    public ResponseEntity<FacultyResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(facultyService.getFacultyById(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<FacultyResponse> getMe() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(facultyService.getFacultyByEmail(email));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<FacultyResponse> create(@RequestBody FacultyRequest request) {
        return ResponseEntity.ok(facultyService.createFaculty(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REGISTRAR')")
    public ResponseEntity<FacultyResponse> update(@PathVariable UUID id, @RequestBody FacultyRequest request) {
        return ResponseEntity.ok(facultyService.updateFaculty(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        facultyService.deleteFaculty(id);
        return ResponseEntity.noContent().build();
    }
}
