package com.smartstock.controller;

import com.smartstock.dto.request.UpdateUserRoleRequest;
import com.smartstock.dto.request.UpdateUserStatusRequest;
import com.smartstock.dto.response.AdminUserResponse;

import jakarta.validation.Valid;
import com.smartstock.dto.response.AdminInventoryResponse;
import com.smartstock.service.AdminInventoryService;
import java.util.List;
import com.smartstock.dto.response.AdminDashboardResponse;
import com.smartstock.service.AdminUserService;
import com.smartstock.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DashboardService dashboardService;
    private final AdminUserService adminUserService;
    private final AdminInventoryService adminInventoryService;

    public AdminController(
            DashboardService dashboardService,
            AdminUserService adminUserService,
            AdminInventoryService adminInventoryService) {

        this.dashboardService = dashboardService;
        this.adminUserService = adminUserService;
        this.adminInventoryService = adminInventoryService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                adminUserService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserResponse> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminUserService.getUserById(id));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<AdminUserResponse> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequest request) {

        return ResponseEntity.ok(
                adminUserService.updateRole(id, request));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<AdminUserResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request) {

        return ResponseEntity.ok(
                adminUserService.updateStatus(id, request));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboard());
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<AdminInventoryResponse>> getInventory() {

        return ResponseEntity.ok(
                adminInventoryService.getInventory());
    }

    @GetMapping("/inventory/low-stock")
    public ResponseEntity<List<AdminInventoryResponse>> getLowStockInventory(
            @RequestParam(defaultValue = "5") Integer threshold) {

        return ResponseEntity.ok(
                adminInventoryService.getLowStockInventory(threshold));
    }

}