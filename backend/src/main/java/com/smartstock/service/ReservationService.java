package com.smartstock.service;

import com.smartstock.dto.request.ReservationRequest;
import com.smartstock.dto.response.ReservationResponse;
import com.smartstock.entity.*;
import com.smartstock.exception.BusinessRuleViolationException;
import com.smartstock.exception.ResourceNotFoundException;
import com.smartstock.repository.ProductRepository;
import com.smartstock.repository.ReservationItemRepository;
import com.smartstock.repository.ReservationRepository;
import com.smartstock.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ReservationService {

    private static final Logger logger = LoggerFactory.getLogger(ReservationService.class);

    private final ReservationRepository reservationRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReservationItemRepository reservationItemRepository;

    @Value("${reservation.expiration.minutes:10}")
    private int expirationMinutes;

    public ReservationService(ReservationRepository reservationRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            ReservationItemRepository reservationItemRepository) {
        this.reservationRepository = reservationRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.reservationItemRepository = reservationItemRepository;
    }

    @Transactional
    public ReservationResponse reserveStock(ReservationRequest request, String userEmail) {
        logger.info("Processing reservation request for product ID: {} and quantity: {} by user: {}",
                request.getProductId(), request.getQuantity(), userEmail);

        if (request.getQuantity() <= 0) {
            throw new BusinessRuleViolationException("Quantity must be greater than zero");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // Use Pessimistic Lock (PESSIMISTIC_WRITE) on the Product table
        Product product = productRepository.findByIdForUpdate(request.getProductId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (!product.isActive()) {
            throw new BusinessRuleViolationException("Product is inactive and cannot be reserved");
        }

        if (product.getAvailableStock() < request.getQuantity()) {
            throw new BusinessRuleViolationException("Insufficient stock available for product: " + product.getName()
                    + ". Requested: " + request.getQuantity() + ", Available: " + product.getAvailableStock());
        }

        // Deduct available stock
        int originalStock = product.getAvailableStock();
        product.setAvailableStock(originalStock - request.getQuantity());
        productRepository.save(product);

        // Create reservation
        String reservationCode = "RSV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Reservation reservation = Reservation.builder()
                .reservationCode(reservationCode)
                .user(user)
                .status(ReservationStatus.PENDING)
                .expiresAt(LocalDateTime.now().plusMinutes(expirationMinutes))
                .build();

        // Create reservation item
        ReservationItem item = ReservationItem.builder()
                .product(product)
                .quantity(request.getQuantity())
                .unitPrice(product.getPrice())
                .build();

        reservation.addItem(item);

        Reservation savedReservation = reservationRepository.save(reservation);

        logger.info("Successfully reserved {} units of product: {}. Reservation code: {}. Stock updated: {} -> {}",
                request.getQuantity(), product.getName(), reservationCode, originalStock, product.getAvailableStock());

        return mapToResponse(savedReservation, product.getAvailableStock());
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponse> getMyReservations(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Page<Reservation> reservations;
        if (user.getRole() == Role.ADMIN) {
            reservations = reservationRepository.findAll(pageable);
        } else {
            reservations = reservationRepository.findByUserId(user.getId(), pageable);
        }

        return reservations.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationById(Long id, String userEmail) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        validateAccess(reservation, userEmail);

        return mapToResponse(reservation);
    }

    @Transactional
    public ReservationResponse confirmReservation(Long id, String userEmail) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        validateAccess(reservation, userEmail);

        // Idempotency: If already confirmed, return success
        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            logger.info("Reservation {} is already CONFIRMED. Returning success.", reservation.getReservationCode());
            return mapToResponse(reservation);
        }

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new BusinessRuleViolationException("Cannot confirm a cancelled reservation");
        }

        if (reservation.getStatus() == ReservationStatus.EXPIRED
                || reservation.getExpiresAt().isBefore(LocalDateTime.now())) {
            if (reservation.getStatus() == ReservationStatus.PENDING) {
                // If it is expired but status wasn't updated yet, expire it and restore stock.
                expireSingleReservationInternal(reservation);
            }
            throw new BusinessRuleViolationException("Cannot confirm an expired reservation");
        }

        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setConfirmedAt(LocalDateTime.now());
        Reservation confirmed = reservationRepository.save(reservation);

        logger.info("Reservation {} successfully CONFIRMED", reservation.getReservationCode());
        return mapToResponse(confirmed);
    }

    @Transactional
    public ReservationResponse cancelReservation(Long id, String userEmail) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        validateAccess(reservation, userEmail);

        // Idempotency: If already cancelled, return success
        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            logger.info("Reservation {} is already CANCELLED. Returning success.", reservation.getReservationCode());
            return mapToResponse(reservation);
        }

        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            throw new BusinessRuleViolationException("A confirmed reservation cannot be cancelled");
        }

        if (reservation.getStatus() == ReservationStatus.EXPIRED) {
            throw new BusinessRuleViolationException("Cannot cancel an expired reservation");
        }

        // Restore stock
        for (ReservationItem item : reservation.getItems()) {
            Product product = productRepository.findByIdForUpdate(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with id: " + item.getProduct().getId()));

            int originalStock = product.getAvailableStock();
            product.setAvailableStock(originalStock + item.getQuantity());
            productRepository.save(product);

            logger.info("Restored {} stock for product {}. Stock updated: {} -> {}",
                    item.getQuantity(), product.getName(), originalStock, product.getAvailableStock());
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setCancelledAt(LocalDateTime.now());
        Reservation cancelled = reservationRepository.save(reservation);

        logger.info("Reservation {} successfully CANCELLED and stock restored.", reservation.getReservationCode());
        return mapToResponse(cancelled);
    }

    @Scheduled(fixedRateString = "${reservation.expiration.check.rate:10000}")
    @Transactional
    public void expireReservationsScheduler() {
        LocalDateTime now = LocalDateTime.now();
        List<Reservation> expiredList = reservationRepository.findExpiredReservations(ReservationStatus.PENDING, now);

        if (!expiredList.isEmpty()) {
            logger.info("Scheduler: Found {} expired pending reservations to process.", expiredList.size());
            for (Reservation reservation : expiredList) {
                try {
                    expireSingleReservationInternal(reservation);
                } catch (Exception e) {
                    logger.error("Error expiring reservation: " + reservation.getId(), e);
                }
            }
        }
    }

    private void expireSingleReservationInternal(Reservation reservation) {
        // Double-check status is still PENDING (and prevent double restoration)
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            return;
        }

        for (ReservationItem item : reservation.getItems()) {
            Product product = productRepository.findByIdForUpdate(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with id: " + item.getProduct().getId()));

            int originalStock = product.getAvailableStock();
            product.setAvailableStock(originalStock + item.getQuantity());
            productRepository.save(product);

            logger.info("Restored {} stock for product {} (Expired reservation {}). Stock: {} -> {}",
                    item.getQuantity(), product.getName(), reservation.getReservationCode(), originalStock,
                    product.getAvailableStock());
        }

        reservation.setStatus(ReservationStatus.EXPIRED);
        reservationRepository.save(reservation);
        logger.info("Reservation {} marked as EXPIRED", reservation.getReservationCode());
    }

    private void validateAccess(Reservation reservation, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        if (user.getRole() != Role.ADMIN && !reservation.getUser().getEmail().equals(userEmail)) {
            logger.warn("Unauthorized access attempt. User: {} tried to access Reservation owned by: {}",
                    userEmail, reservation.getUser().getEmail());
            throw new AccessDeniedException("You do not have permission to access this reservation");
        }
    }

    private ReservationResponse mapToResponse(Reservation reservation) {
        Long productId = null;
        Integer quantity = null;
        Integer availableStock = null;

        if (reservation.getItems() != null && !reservation.getItems().isEmpty()) {
            ReservationItem item = reservation.getItems().get(0);
            productId = item.getProduct().getId();
            quantity = item.getQuantity();
            availableStock = item.getProduct().getAvailableStock();
        }

        return new ReservationResponse(
                reservation.getId(),
                reservation.getReservationCode(),
                productId,
                quantity,
                reservation.getStatus(),
                reservation.getExpiresAt(),
                availableStock);
    }

    private ReservationResponse mapToResponse(Reservation reservation, Integer availableStockAfterReservation) {
        ReservationResponse response = mapToResponse(reservation);
        response.setAvailableStockAfterReservation(availableStockAfterReservation);
        return response;
    }
}
