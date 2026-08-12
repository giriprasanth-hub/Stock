package com.smartstock.repository;

import com.smartstock.entity.Reservation;
import com.smartstock.entity.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByReservationCode(String reservationCode);

    Page<Reservation> findByUserEmail(String email, Pageable pageable);

    Page<Reservation> findByUserId(Long userId, Pageable pageable);
    long countByStatus(ReservationStatus status);

    @Query("SELECT r FROM Reservation r WHERE r.status = :status AND r.expiresAt < :now")
    List<Reservation> findExpiredReservations(@Param("status") ReservationStatus status, @Param("now") LocalDateTime now);
}
