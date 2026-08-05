package com.metamorph_x.uams.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metamorph_x.uams.dto.RegistrarRequest;
import com.metamorph_x.uams.dto.RegistrarResponse;
import com.metamorph_x.uams.service.RegistrarService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/registrars")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class RegistrarController {

    private final RegistrarService registrarService;

    @GetMapping
    public ResponseEntity<List<RegistrarResponse>> getAll() {
        return ResponseEntity.ok(registrarService.getAllRegistrars());
    }

    @PostMapping
    public ResponseEntity<RegistrarResponse> create(@Valid @RequestBody RegistrarRequest request) {
        return ResponseEntity.ok(registrarService.createRegistrar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistrarResponse> update(@PathVariable UUID id, @Valid @RequestBody RegistrarRequest request) {
        return ResponseEntity.ok(registrarService.updateRegistrar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        registrarService.deleteRegistrar(id);
        return ResponseEntity.noContent().build();
    }
}
