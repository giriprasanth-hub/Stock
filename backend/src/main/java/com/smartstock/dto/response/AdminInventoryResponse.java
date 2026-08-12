package com.smartstock.dto.response;

import java.math.BigDecimal;

public class AdminInventoryResponse {

    private Long id;
    private String sku;
    private String name;
    private BigDecimal price;
    private Integer availableStock;
    private boolean active;

    public AdminInventoryResponse() {
    }

    public AdminInventoryResponse(
            Long id,
            String sku,
            String name,
            BigDecimal price,
            Integer availableStock,
            boolean active) {

        this.id = id;
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.availableStock = availableStock;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getSku() {
        return sku;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getAvailableStock() {
        return availableStock;
    }

    public boolean isActive() {
        return active;
    }
}