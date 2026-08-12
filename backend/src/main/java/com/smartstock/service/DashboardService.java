package com.smartstock.service;

import com.smartstock.dto.response.AdminDashboardResponse;
import com.smartstock.entity.ReservationStatus;
import com.smartstock.repository.ProductRepository;
import com.smartstock.repository.ReservationRepository;
import com.smartstock.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    public DashboardService(
            ProductRepository productRepository,
            ReservationRepository reservationRepository,
            UserRepository userRepository) {

        this.productRepository = productRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    public AdminDashboardResponse getDashboard() {

        long totalProducts = productRepository.count();

        long activeProducts = productRepository.countByActive(true);

        long inactiveProducts = productRepository.countByActive(false);

        long totalUsers = userRepository.count();

        long pendingReservations =
                reservationRepository.countByStatus(ReservationStatus.PENDING);

        long confirmedReservations =
                reservationRepository.countByStatus(ReservationStatus.CONFIRMED);

        long cancelledReservations =
                reservationRepository.countByStatus(ReservationStatus.CANCELLED);

        long expiredReservations =
                reservationRepository.countByStatus(ReservationStatus.EXPIRED);

        return new AdminDashboardResponse(
                totalProducts,
                activeProducts,
                inactiveProducts,
                totalUsers,
                pendingReservations,
                confirmedReservations,
                cancelledReservations,
                expiredReservations
        );
    }
}