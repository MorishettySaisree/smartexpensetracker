package com.smartexpense.controller;

import com.smartexpense.dto.ChangePasswordRequest;
import com.smartexpense.dto.UpdateProfileRequest;
import com.smartexpense.dto.UserResponse;
import com.smartexpense.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // GET /api/profile/{userId}
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    // PUT /api/profile/{userId}
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateProfile(
            @PathVariable Long userId,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(userId, request));
    }

    // PUT /api/profile/change-password/{userId}
    @PutMapping("/change-password/{userId}")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordRequest request) {
        String message = profileService.changePassword(userId, request);
        return ResponseEntity.ok(Map.of("message", message));
    }
}
