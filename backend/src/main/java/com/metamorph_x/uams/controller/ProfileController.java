package com.metamorph_x.uams.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.metamorph_x.uams.service.ProfileService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(profileService.getMyProfile(email));
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody Map<String, Object> data) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        profileService.updateProfile(email, data);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String fileName = profileService.uploadProfilePicture(email, file);
        return ResponseEntity.ok(Map.of("imageUrl", "/api/uploads/" + fileName));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> data) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        profileService.changePassword(email, data.get("currentPassword"), data.get("newPassword"));
        return ResponseEntity.ok().build();
    }
}
