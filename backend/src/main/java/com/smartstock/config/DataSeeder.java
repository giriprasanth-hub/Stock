package com.smartstock.config;

import com.smartstock.entity.Product;
import com.smartstock.entity.Role;
import com.smartstock.entity.User;
import com.smartstock.repository.ProductRepository;
import com.smartstock.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Bean
    CommandLineRunner seedData(UserRepository userRepository,
                               ProductRepository productRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed admin user
            if (!userRepository.existsByEmail("admin@smartstock.com")) {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@smartstock.com")
                        .passwordHash(passwordEncoder.encode("Admin@123"))
                        .role(Role.ADMIN)
                        .active(true)
                        .build();
                userRepository.save(admin);
                logger.info("Seeded ADMIN user: admin@smartstock.com / Admin@123");
            }

            // Seed regular user
            if (!userRepository.existsByEmail("user@smartstock.com")) {
                User user = User.builder()
                        .username("giri")
                        .email("user@smartstock.com")
                        .passwordHash(passwordEncoder.encode("User@123"))
                        .role(Role.USER)
                        .active(true)
                        .build();
                userRepository.save(user);
                logger.info("Seeded USER: user@smartstock.com / User@123");
            }

            // Seed products
            if (!productRepository.existsBySku("LAP-001")) {
                productRepository.save(Product.builder()
                        .sku("LAP-001")
                        .name("Business Laptop Pro")
                        .description("High-performance business laptop with 16GB RAM and 512GB SSD")
                        .price(new BigDecimal("74999.00"))
                        .availableStock(10)
                        .active(true)
                        .build());
                logger.info("Seeded product: LAP-001");
            }

            if (!productRepository.existsBySku("KEY-001")) {
                productRepository.save(Product.builder()
                        .sku("KEY-001")
                        .name("Mechanical Keyboard RGB")
                        .description("Cherry MX Blue mechanical keyboard with RGB lighting")
                        .price(new BigDecimal("2499.00"))
                        .availableStock(5)
                        .active(true)
                        .build());
                logger.info("Seeded product: KEY-001");
            }

            if (!productRepository.existsBySku("MON-001")) {
                productRepository.save(Product.builder()
                        .sku("MON-001")
                        .name("Ultra-Wide Monitor 34\"")
                        .description("34-inch curved ultra-wide QHD monitor")
                        .price(new BigDecimal("32999.00"))
                        .availableStock(0)
                        .active(true)
                        .build());
                logger.info("Seeded product: MON-001 (stock = 0)");
            }

            if (!productRepository.existsBySku("MOU-001")) {
                productRepository.save(Product.builder()
                        .sku("MOU-001")
                        .name("Wireless Ergonomic Mouse")
                        .description("Ergonomic wireless mouse with silent clicks")
                        .price(new BigDecimal("1299.00"))
                        .availableStock(25)
                        .active(true)
                        .build());
                logger.info("Seeded product: MOU-001");
            }

            if (!productRepository.existsBySku("HDS-001")) {
                productRepository.save(Product.builder()
                        .sku("HDS-001")
                        .name("Noise Cancelling Headset")
                        .description("Over-ear noise cancelling headset with microphone (DISCONTINUED)")
                        .price(new BigDecimal("4999.00"))
                        .availableStock(8)
                        .active(false)
                        .build());
                logger.info("Seeded product: HDS-001 (inactive)");
            }
        };
    }
}
