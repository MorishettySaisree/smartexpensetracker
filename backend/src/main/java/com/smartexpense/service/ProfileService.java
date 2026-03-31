package com.smartexpense.service;

import com.smartexpense.dto.ChangePasswordRequest;
import com.smartexpense.dto.UpdateProfileRequest;
import com.smartexpense.dto.UserResponse;
import com.smartexpense.entity.User;
import com.smartexpense.exception.BadRequestException;
import com.smartexpense.exception.ResourceNotFoundException;
import com.smartexpense.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail());
    }

    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            // Check if email is taken by another user
            boolean emailTaken = userRepository.findByEmail(request.getEmail())
                    .map(u -> !u.getId().equals(userId))
                    .orElse(false);
            if (emailTaken) throw new BadRequestException("Email is already in use.");
            user.setEmail(request.getEmail());
        }

        User saved = userRepository.save(user);
        return new UserResponse(saved.getId(), saved.getFullName(), saved.getEmail(),
                "Profile updated successfully!");
    }

    public String changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect.");
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password changed successfully!";
    }
}
