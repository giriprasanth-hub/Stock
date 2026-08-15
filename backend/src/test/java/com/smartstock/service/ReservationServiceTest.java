package com.smartstock.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.util.ReflectionTestUtils;

import com.smartstock.dto.request.ReservationRequest;
import com.smartstock.dto.response.ReservationResponse;
import com.smartstock.entity.Product;
import com.smartstock.entity.Reservation;
import com.smartstock.entity.ReservationItem;
import com.smartstock.entity.ReservationStatus;
import com.smartstock.entity.Role;
import com.smartstock.entity.User;
import com.smartstock.exception.BusinessRuleViolationException;
import com.smartstock.exception.ResourceNotFoundException;
import com.smartstock.repository.ProductRepository;
import com.smartstock.repository.ReservationItemRepository;
import com.smartstock.repository.ReservationRepository;
import com.smartstock.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ReservationItemRepository reservationItemRepository;

    @InjectMocks
    private ReservationService reservationService;

    private User user;
    private Product product;

    @BeforeEach
    void setUp() {
        user = mock(User.class);
        product = mock(Product.class);

        ReflectionTestUtils.setField(
                reservationService,
                "expirationMinutes",
                10
        );
    }

    // =========================================================
    // RESERVATION CREATION
    // =========================================================
@Test
void shouldCreateReservationWhenStockIsAvailable() {

    ReservationRequest request =
            new ReservationRequest(1L, 2);

    when(userRepository.findByEmail("user@test.com"))
            .thenReturn(Optional.of(user));

    when(productRepository.findByIdForUpdate(1L))
            .thenReturn(Optional.of(product));

    when(product.isActive())
            .thenReturn(true);

    when(product.getAvailableStock())
            .thenReturn(10);

    when(product.getName())
            .thenReturn("Business Laptop");

    when(product.getPrice())
            .thenReturn(new BigDecimal("74999.00"));

    when(product.getId())
            .thenReturn(1L);

    when(reservationRepository.save(any(Reservation.class)))
            .thenAnswer(invocation -> {

                Reservation reservation =
                        invocation.getArgument(0);

                ReflectionTestUtils.setField(
                        reservation,
                        "id",
                        1L
                );

                return reservation;
            });

    ReservationResponse response =
            reservationService.reserveStock(
                    request,
                    "user@test.com"
            );
assertNotNull(response);

assertEquals(1L, response.getProductId());
assertEquals(2, response.getQuantity());

assertEquals(
        ReservationStatus.PENDING,
        response.getStatus()
);

verify(product)
        .setAvailableStock(8);

verify(productRepository)
        .save(product);

verify(reservationRepository)
        .save(any(Reservation.class));
}

    @Test
    void shouldRejectZeroQuantity() {

        ReservationRequest request =
                new ReservationRequest(1L, 0);

        assertThrows(
                BusinessRuleViolationException.class,
                () -> reservationService.reserveStock(
                        request,
                        "user@test.com"
                )
        );

        verifyNoInteractions(
                userRepository,
                productRepository,
                reservationRepository
        );
    }

    @Test
    void shouldRejectNegativeQuantity() {

        ReservationRequest request =
                new ReservationRequest(1L, -5);

        assertThrows(
                BusinessRuleViolationException.class,
                () -> reservationService.reserveStock(
                        request,
                        "user@test.com"
                )
        );

        verifyNoInteractions(
                userRepository,
                productRepository,
                reservationRepository
        );
    }

    @Test
    void shouldRejectInactiveProduct() {

        ReservationRequest request =
                new ReservationRequest(1L, 2);

        when(userRepository.findByEmail("user@test.com"))
                .thenReturn(Optional.of(user));

        when(productRepository.findByIdForUpdate(1L))
                .thenReturn(Optional.of(product));

        when(product.isActive())
                .thenReturn(false);

        BusinessRuleViolationException exception =
                assertThrows(
                        BusinessRuleViolationException.class,
                        () -> reservationService.reserveStock(
                                request,
                                "user@test.com"
                        )
                );

        assertEquals(
                "Product is inactive and cannot be reserved",
                exception.getMessage()
        );

        verify(productRepository, never()).save(product);
        verify(reservationRepository, never())
                .save(any(Reservation.class));
    }

    @Test
    void shouldRejectWhenStockIsInsufficient() {

        ReservationRequest request =
                new ReservationRequest(1L, 100);

        when(userRepository.findByEmail("user@test.com"))
                .thenReturn(Optional.of(user));

        when(productRepository.findByIdForUpdate(1L))
                .thenReturn(Optional.of(product));

        when(product.isActive())
                .thenReturn(true);

        when(product.getAvailableStock())
                .thenReturn(8);

        when(product.getName())
                .thenReturn("Business Laptop");

        BusinessRuleViolationException exception =
                assertThrows(
                        BusinessRuleViolationException.class,
                        () -> reservationService.reserveStock(
                                request,
                                "user@test.com"
                        )
                );

        assertTrue(
                exception.getMessage()
                        .contains("Insufficient stock available")
        );

        verify(productRepository, never()).save(product);
        verify(reservationRepository, never())
                .save(any(Reservation.class));
    }

    @Test
    void shouldThrowWhenProductDoesNotExist() {

        ReservationRequest request =
                new ReservationRequest(999L, 1);

        when(userRepository.findByEmail("user@test.com"))
                .thenReturn(Optional.of(user));

        when(productRepository.findByIdForUpdate(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> reservationService.reserveStock(
                        request,
                        "user@test.com"
                )
        );
    }

    // =========================================================
    // CONFIRMATION
    // =========================================================

    @Test
    void shouldConfirmPendingReservation() {

        Reservation reservation =
                mock(Reservation.class);

        when(reservationRepository.findById(1L))
                .thenReturn(Optional.of(reservation));

        when(reservation.getStatus())
                .thenReturn(ReservationStatus.PENDING);

        when(reservation.getExpiresAt())
                .thenReturn(
                        LocalDateTime.now().plusMinutes(5)
                );

        when(reservation.getUser())
                .thenReturn(user);

        when(userRepository.findByEmail("user@test.com"))
                .thenReturn(Optional.of(user));

        when(user.getRole())
                .thenReturn(Role.USER);

        when(user.getEmail())
                .thenReturn("user@test.com");

        when(reservation.getReservationCode())
                .thenReturn("RSV-TEST123");

        when(reservationRepository.save(reservation))
                .thenReturn(reservation);

        ReservationResponse response =
                reservationService.confirmReservation(
                        1L,
                        "user@test.com"
                );

        verify(reservation)
                .setStatus(ReservationStatus.CONFIRMED);

        verify(reservation)
                .setConfirmedAt(any(LocalDateTime.class));

        verify(reservationRepository)
                .save(reservation);

        assertNotNull(response);
    }

    @Test
    void shouldRejectConfirmingCancelledReservation() {

        Reservation reservation =
                mock(Reservation.class);

        when(reservationRepository.findById(1L))
                .thenReturn(Optional.of(reservation));

        when(reservation.getStatus())
                .thenReturn(ReservationStatus.CANCELLED);

        when(reservation.getUser())
                .thenReturn(user);

        when(userRepository.findByEmail("user@test.com"))
                .thenReturn(Optional.of(user));

        when(user.getRole())
                .thenReturn(Role.USER);

        when(user.getEmail())
                .thenReturn("user@test.com");

        assertThrows(
                BusinessRuleViolationException.class,
                () -> reservationService.confirmReservation(
                        1L,
                        "user@test.com"
                )
        );

        verify(reservationRepository, never())
                .save(reservation);
    }

    // =========================================================
    // CANCELLATION
    // =========================================================

   @Test
void shouldCancelPendingReservationAndRestoreStock() {

    Reservation reservation =
            mock(Reservation.class);

    ReservationItem item =
            mock(ReservationItem.class);

    Product reservedProduct =
            mock(Product.class);

    when(reservationRepository.findById(1L))
            .thenReturn(Optional.of(reservation));

    when(reservation.getStatus())
            .thenReturn(ReservationStatus.PENDING);

    when(reservation.getUser())
            .thenReturn(user);

    when(userRepository.findByEmail("user@test.com"))
            .thenReturn(Optional.of(user));

    when(user.getRole())
            .thenReturn(Role.USER);

    when(user.getEmail())
            .thenReturn("user@test.com");

    when(reservation.getItems())
            .thenReturn(List.of(item));

    when(item.getProduct())
            .thenReturn(reservedProduct);

    when(reservedProduct.getId())
            .thenReturn(1L);

    when(item.getQuantity())
            .thenReturn(2);

    when(reservedProduct.getAvailableStock())
            .thenReturn(8);

    when(reservedProduct.getName())
            .thenReturn("Business Laptop");

    // IMPORTANT:
    // cancelReservation() looks the product up again.
    when(productRepository.findByIdForUpdate(1L))
            .thenReturn(Optional.of(reservedProduct));

    when(reservationRepository.save(reservation))
            .thenReturn(reservation);

    ReservationResponse response =
            reservationService.cancelReservation(
                    1L,
                    "user@test.com"
            );

    verify(reservedProduct)
            .setAvailableStock(10);

    verify(productRepository)
            .save(reservedProduct);

    verify(reservation)
            .setStatus(ReservationStatus.CANCELLED);

    verify(reservation)
            .setCancelledAt(any(LocalDateTime.class));

    verify(reservationRepository)
            .save(reservation);

    assertNotNull(response);
}

    // =========================================================
    // OWNERSHIP / SECURITY
    // =========================================================

    @Test
    void shouldRejectAnotherUserAccessingReservation() {

        Reservation reservation =
                mock(Reservation.class);

        User owner =
                mock(User.class);

        when(reservationRepository.findById(1L))
                .thenReturn(Optional.of(reservation));

        when(reservation.getUser())
                .thenReturn(owner);

        when(userRepository.findByEmail("attacker@test.com"))
                .thenReturn(Optional.of(user));

        when(user.getRole())
                .thenReturn(Role.USER);

        when(owner.getEmail())
                .thenReturn("owner@test.com");

        assertThrows(
                AccessDeniedException.class,
                () -> reservationService.getReservationById(
                        1L,
                        "attacker@test.com"
                )
        );
    }

    @Test
    void shouldAllowOwnerToAccessReservation() {

        Reservation reservation =
                mock(Reservation.class);

        when(reservationRepository.findById(1L))
                .thenReturn(Optional.of(reservation));

        when(reservation.getUser())
                .thenReturn(user);

        when(userRepository.findByEmail("user@test.com"))
                .thenReturn(Optional.of(user));

        when(user.getRole())
                .thenReturn(Role.USER);

        when(user.getEmail())
                .thenReturn("user@test.com");

        when(reservation.getItems())
                .thenReturn(List.of());

        when(reservation.getId())
                .thenReturn(1L);

        when(reservation.getReservationCode())
                .thenReturn("RSV-TEST123");

        when(reservation.getStatus())
                .thenReturn(ReservationStatus.PENDING);

        when(reservation.getExpiresAt())
                .thenReturn(
                        LocalDateTime.now().plusMinutes(5)
                );

        ReservationResponse response =
                reservationService.getReservationById(
                        1L,
                        "user@test.com"
                );

        assertNotNull(response);

        verify(reservationRepository)
                .findById(1L);
    }

    // =========================================================
    // NONEXISTENT RESERVATION
    // =========================================================

    @Test
    void shouldThrowWhenReservationDoesNotExist() {

        when(reservationRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> reservationService.getReservationById(
                        999L,
                        "user@test.com"
                )
        );
    }

    @Test
void shouldExpirePendingReservation() {

    Reservation reservation = mock(Reservation.class);
    ReservationItem item = mock(ReservationItem.class);
    Product reservedProduct = mock(Product.class);

    when(reservation.getStatus())
        .thenReturn(ReservationStatus.PENDING);

    when(reservationRepository.findExpiredReservations(
            eq(ReservationStatus.PENDING),
            any(LocalDateTime.class)
    )).thenReturn(List.of(reservation));

    when(reservation.getItems())
            .thenReturn(List.of(item));

    when(item.getProduct())
            .thenReturn(reservedProduct);

    when(reservedProduct.getId())
            .thenReturn(1L);

    when(item.getQuantity())
            .thenReturn(2);

    when(productRepository.findByIdForUpdate(1L))
            .thenReturn(Optional.of(reservedProduct));

    when(reservedProduct.getAvailableStock())
            .thenReturn(8);

    reservationService.expireReservationsScheduler();

    verify(reservation)
            .setStatus(ReservationStatus.EXPIRED);

    verify(reservedProduct)
            .setAvailableStock(10);

    verify(productRepository)
            .save(reservedProduct);

    verify(reservationRepository)
            .save(reservation);
}

@Test
void shouldExpireMultiplePendingReservations() {

    Reservation reservation1 = mock(Reservation.class);
    Reservation reservation2 = mock(Reservation.class);

    when(reservation1.getStatus())
        .thenReturn(ReservationStatus.PENDING);

when(reservation2.getStatus())
        .thenReturn(ReservationStatus.PENDING);

    when(reservationRepository.findExpiredReservations(
            eq(ReservationStatus.PENDING),
            any(LocalDateTime.class)
    )).thenReturn(List.of(
            reservation1,
            reservation2
    ));

    when(reservation1.getItems())
            .thenReturn(Collections.emptyList());

    when(reservation2.getItems())
            .thenReturn(Collections.emptyList());

    reservationService.expireReservationsScheduler();;

    verify(reservation1)
            .setStatus(ReservationStatus.EXPIRED);

    verify(reservation2)
            .setStatus(ReservationStatus.EXPIRED);

    verify(reservationRepository, times(2))
            .save(any(Reservation.class));
}

@Test
void shouldDoNothingWhenThereAreNoExpiredReservations() {

    when(reservationRepository.findExpiredReservations(
            eq(ReservationStatus.PENDING),
            any(LocalDateTime.class)
    )).thenReturn(Collections.emptyList());

    reservationService.expireReservationsScheduler();;

    verify(reservationRepository, never())
            .save(any(Reservation.class));

    verify(productRepository, never())
            .save(any(Product.class));
}

@Test
void shouldRestoreStockWhenReservationExpires() {

    Reservation reservation = mock(Reservation.class);
    ReservationItem item = mock(ReservationItem.class);
    Product product = mock(Product.class);
    when(reservation.getStatus())
        .thenReturn(ReservationStatus.PENDING);

    when(reservationRepository.findExpiredReservations(
            eq(ReservationStatus.PENDING),
            any(LocalDateTime.class)
    )).thenReturn(List.of(reservation));

    when(reservation.getItems())
            .thenReturn(List.of(item));

    when(item.getProduct())
            .thenReturn(product);

    when(product.getId())
            .thenReturn(2L);

    when(item.getQuantity())
            .thenReturn(3);

    when(productRepository.findByIdForUpdate(2L))
            .thenReturn(Optional.of(product));

    when(product.getAvailableStock())
            .thenReturn(5);

    reservationService.expireReservationsScheduler();;

    verify(product)
            .setAvailableStock(8);

    verify(productRepository)
            .save(product);

    verify(reservation)
            .setStatus(ReservationStatus.EXPIRED);

    verify(reservationRepository)
            .save(reservation);
}

@Test
void shouldRejectConfirmationForUnsupportedReservationStatus() {

    Reservation reservation = mock(Reservation.class);
    User user = mock(User.class);

    when(reservationRepository.findById(1L))
            .thenReturn(Optional.of(reservation));

    when(userRepository.findByEmail("user@test.com"))
            .thenReturn(Optional.of(user));

    when(user.getRole())
            .thenReturn(Role.USER);

    when(reservation.getUser())
            .thenReturn(user);

    when(user.getEmail())
            .thenReturn("user@test.com");

    when(reservation.getStatus())
            .thenReturn(null);

    assertThrows(
            BusinessRuleViolationException.class,
            () -> reservationService.confirmReservation(
                    1L,
                    "user@test.com"
            )
    );

    verify(reservation, never())
            .setStatus(ReservationStatus.CONFIRMED);

    verify(reservationRepository, never())
            .save(reservation);
}
}