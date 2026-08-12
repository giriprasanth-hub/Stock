package com.smartstock.service;

import com.smartstock.dto.request.UpdateUserRoleRequest;
import com.smartstock.dto.request.UpdateUserStatusRequest;
import com.smartstock.dto.response.AdminUserResponse;
import com.smartstock.entity.User;
import com.smartstock.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;

    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AdminUserResponse getUserById(Long id) {

        User user = findUser(id);

        return toResponse(user);
    }

    @Transactional
    public AdminUserResponse updateRole(
            Long id,
            UpdateUserRoleRequest request) {

        User user = findUser(id);

        user.setRole(request.getRole());

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public AdminUserResponse updateStatus(
            Long id,
            UpdateUserStatusRequest request) {

        User user = findUser(id);

        user.setActive(request.getActive());

        return toResponse(userRepository.save(user));
    }

    private User findUser(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "User not found with id: " + id
                        ));
    }

    private AdminUserResponse toResponse(User user) {

        return new AdminUserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}