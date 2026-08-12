package com.smartstock.dto.response;

import com.smartstock.entity.ReservationStatus;
import java.time.LocalDateTime;

public class ReservationResponse {
    private Long id;
    private String reservationCode;
    private Long productId;
    private Integer quantity;
    private ReservationStatus status;
    private LocalDateTime expiresAt;
    private Integer availableStockAfterReservation;

    public ReservationResponse() {
    }

    public ReservationResponse(Long id, String reservationCode, Long productId, Integer quantity, ReservationStatus status, LocalDateTime expiresAt, Integer availableStockAfterReservation) {
        this.id = id;
        this.reservationCode = reservationCode;
        this.productId = productId;
        this.quantity = quantity;
        this.status = status;
        this.expiresAt = expiresAt;
        this.availableStockAfterReservation = availableStockAfterReservation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReservationCode() {
        return reservationCode;
    }

    public void setReservationCode(String reservationCode) {
        this.reservationCode = reservationCode;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Integer getAvailableStockAfterReservation() {
        return availableStockAfterReservation;
    }

    public void setAvailableStockAfterReservation(Integer availableStockAfterReservation) {
        this.availableStockAfterReservation = availableStockAfterReservation;
    }
}
