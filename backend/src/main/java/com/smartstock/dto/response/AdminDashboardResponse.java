package com.smartstock.dto.response;

public class AdminDashboardResponse {

    private long totalProducts;
    private long activeProducts;
    private long inactiveProducts;
    private long totalUsers;
    private long pendingReservations;
    private long confirmedReservations;
    private long cancelledReservations;
    private long expiredReservations;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(
            long totalProducts,
            long activeProducts,
            long inactiveProducts,
            long totalUsers,
            long pendingReservations,
            long confirmedReservations,
            long cancelledReservations,
            long expiredReservations) {

        this.totalProducts = totalProducts;
        this.activeProducts = activeProducts;
        this.inactiveProducts = inactiveProducts;
        this.totalUsers = totalUsers;
        this.pendingReservations = pendingReservations;
        this.confirmedReservations = confirmedReservations;
        this.cancelledReservations = cancelledReservations;
        this.expiredReservations = expiredReservations;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public long getActiveProducts() {
        return activeProducts;
    }

    public long getInactiveProducts() {
        return inactiveProducts;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getPendingReservations() {
        return pendingReservations;
    }

    public long getConfirmedReservations() {
        return confirmedReservations;
    }

    public long getCancelledReservations() {
        return cancelledReservations;
    }

    public long getExpiredReservations() {
        return expiredReservations;
    }
}