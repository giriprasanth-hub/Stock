package com.smartstock.repository;

import com.smartstock.entity.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findBySku(String sku);
    boolean existsBySku(String sku);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);

    Page<Product> findByActive(boolean active, Pageable pageable);
    long countByActive(boolean active);

    @Query("SELECT p FROM Product p WHERE (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%'))) AND (:active IS NULL OR p.active = :active)")
    Page<Product> searchProducts(@Param("search") String search, @Param("active") Boolean active, Pageable pageable);

    @Query("""
       SELECT p FROM Product p
       WHERE p.availableStock <= :threshold
       ORDER BY p.availableStock ASC
       """)
    List<Product> findLowStockProducts(@Param("threshold") Integer threshold);
}
