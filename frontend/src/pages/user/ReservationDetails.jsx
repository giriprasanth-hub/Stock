import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getReservationById,
  confirmReservation,
  cancelReservation,
} from "../../services/reservationService";

export default function ReservationDetails() {
  const { id } = useParams();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadReservation = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReservationById(id);
      setReservation(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load reservation."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservation();
  }, [id]);

  const handleConfirm = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to confirm this reservation?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const data = await confirmReservation(id);

      setReservation(data);
      setSuccess("Reservation confirmed successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to confirm reservation."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const data = await cancelReservation(id);

      setReservation(data);
      setSuccess("Reservation cancelled successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to cancel reservation."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="details-loading">
        Loading reservation...
      </div>
    );
  }

  if (error && !reservation) {
    return (
      <div className="details-error">
        <h2>Reservation not found</h2>
        <p>{error}</p>

        <Link
          to="/reservations"
          className="dark-button"
        >
          ← My Reservations
        </Link>
      </div>
    );
  }

  if (!reservation) {
    return null;
  }

  return (
    <div className="reservation-details-page">

      <Link
        to="/reservations"
        className="back-link"
      >
        ← My Reservations
      </Link>

      <div className="reservation-details-grid">

        <div className="reservation-details-main">

          <div className="reservation-details-header">

            <div>
              <span className="eyebrow">
                RESERVATION
              </span>

              <h1>
                {reservation.reservationCode}
              </h1>
            </div>

            <span
              className={`status-badge ${reservation.status.toLowerCase()}`}
            >
              {reservation.status}
            </span>

          </div>

          <div className="reservation-info-grid">

            <div className="info-item">
              <span>Product ID</span>
              <strong>
                #{reservation.productId}
              </strong>
            </div>

            <div className="info-item">
              <span>Quantity</span>
              <strong>
                {reservation.quantity}
              </strong>
            </div>

            <div className="info-item">
              <span>Stock After Reservation</span>
              <strong>
                {reservation.availableStockAfterReservation}
              </strong>
            </div>

            <div className="info-item">
              <span>Status</span>
              <strong>
                {reservation.status}
              </strong>
            </div>

          </div>

          <div className="reservation-expiry">

            <div>
              <span className="eyebrow">
                EXPIRATION
              </span>

              <h3>
                {new Date(
                  reservation.expiresAt
                ).toLocaleString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h3>
            </div>

            <div className="expiry-icon">
              ◷
            </div>

          </div>

        </div>


        <div className="reservation-action-card">

          <span className="eyebrow">
            RESERVATION STATUS
          </span>

          <h2>
            {reservation.status === "PENDING"
              ? "Action required"
              : reservation.status === "CONFIRMED"
              ? "Reservation confirmed"
              : reservation.status === "CANCELLED"
              ? "Reservation cancelled"
              : "Reservation expired"}
          </h2>

          <p>
            {reservation.status === "PENDING"
              ? "You can confirm or cancel this reservation."
              : reservation.status === "CONFIRMED"
              ? "This reservation has been successfully confirmed."
              : reservation.status === "CANCELLED"
              ? "This reservation has been cancelled and can no longer be changed."
              : "This reservation has expired and can no longer be changed."}
          </p>

          {error && (
            <div className="page-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          {reservation.status === "PENDING" && (

            <div className="reservation-action-buttons">

              <button
                className="primary-button"
                disabled={actionLoading}
                onClick={handleConfirm}
              >
                {actionLoading
                  ? "Processing..."
                  : "Confirm reservation"}
              </button>

              <button
                className="cancel-large-button"
                disabled={actionLoading}
                onClick={handleCancel}
              >
                Cancel reservation
              </button>

            </div>

          )}

          {reservation.status === "CONFIRMED" && (
            <div className="status-message confirmed-message">
              ✓ Your reservation is confirmed.
            </div>
          )}

          {reservation.status === "CANCELLED" && (
            <div className="status-message cancelled-message">
              This reservation was cancelled.
            </div>
          )}

          {reservation.status === "EXPIRED" && (
            <div className="status-message expired-message">
              This reservation has expired.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}