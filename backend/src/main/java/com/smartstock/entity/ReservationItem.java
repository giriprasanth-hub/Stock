package com.smartstock.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "reservation_items")
public class ReservationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    public ReservationItem() {
    }

    public ReservationItem(Long id, Reservation reservation, Product product, Integer quantity, BigDecimal unitPrice) {
        this.id = id;
        this.reservation = reservation;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public static ReservationItemBuilder builder() {
        return new ReservationItemBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public static class ReservationItemBuilder {
        private Long id;
        private Reservation reservation;
        private Product product;
        private Integer quantity;
        private BigDecimal unitPrice;

        public ReservationItemBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ReservationItemBuilder reservation(Reservation reservation) {
            this.reservation = reservation;
            return this;
        }

        public ReservationItemBuilder product(Product product) {
            this.product = product;
            return this;
        }

        public ReservationItemBuilder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public ReservationItemBuilder unitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
            return this;
        }

        public ReservationItem build() {
            return new ReservationItem(id, reservation, product, quantity, unitPrice);
        }
    }
}
