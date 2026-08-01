package com.metamorph_x.uams.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.UUID;

public interface ProfileService {
    Map<String, Object> getMyProfile(String email);
    void updateProfile(String email, Map<String, Object> data);
    String uploadProfilePicture(String email, MultipartFile file);
    void changePassword(String email, String currentPassword, String newPassword);
}
