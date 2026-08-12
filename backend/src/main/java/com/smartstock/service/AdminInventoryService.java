package com.smartstock.service;

import com.smartstock.dto.response.AdminInventoryResponse;
import com.smartstock.entity.Product;
import com.smartstock.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminInventoryService {

    private final ProductRepository productRepository;

    public AdminInventoryService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<AdminInventoryResponse> getInventory() {

        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AdminInventoryResponse> getLowStockInventory(
            Integer threshold) {

        return productRepository.findLowStockProducts(threshold)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AdminInventoryResponse toResponse(Product product) {

        return new AdminInventoryResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getPrice(),
                product.getAvailableStock(),
                product.isActive());
    }
}