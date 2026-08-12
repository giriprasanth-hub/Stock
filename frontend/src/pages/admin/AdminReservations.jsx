import { useEffect, useState } from "react";
import {
  getAllReservations,
  confirmReservation,
  cancelReservation,
} from "../../services/reservationService";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [status, setStatus] = useState("ALL");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllReservations({
        page,
        size: 10,
        });

        let results = data.content || [];

        if (status !== "ALL") {
        results = results.filter(
            (reservation) => reservation.status === status
        );
        }

        setReservations(results);
        setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load reservations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [page, status]);

  const handleConfirm = async (reservation) => {
    const confirmed = window.confirm(
      `Confirm reservation ${reservation.reservationCode}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(reservation.id);
      setError("");
      setSuccess("");

      await confirmReservation(reservation.id);

      setSuccess(
        `${reservation.reservationCode} confirmed successfully.`
      );

      await loadReservations();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to confirm reservation."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (reservation) => {
    const confirmed = window.confirm(
      `Cancel reservation ${reservation.reservationCode}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(reservation.id);
      setError("");
      setSuccess("");

      await cancelReservation(reservation.id);

      setSuccess(
        `${reservation.reservationCode} cancelled successfully.`
      );

      await loadReservations();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to cancel reservation."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusClass = (reservationStatus) => {
    switch (reservationStatus) {
      case "CONFIRMED":
        return "confirmed";

      case "CANCELLED":
        return "cancelled";

      case "EXPIRED":
        return "expired";

      case "PENDING":
      default:
        return "pending";
    }
  };

  return (
    <div className="admin-reservations">

      {/* HEADER */}

      <div className="admin-reservations-header">

        <div>
          <span className="eyebrow">
            RESERVATION MANAGEMENT
          </span>

          <h1>Reservations</h1>

          <p>
            Monitor and manage all stock reservations.
          </p>
        </div>

        <div className="admin-reservation-count">
          {reservations.length} reservations
        </div>

      </div>


      {/* MESSAGES */}

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


      {/* FILTER */}

      <div className="admin-reservation-toolbar">

        <div className="reservation-filter-label">
          STATUS
        </div>

        <select
          className="filter-select"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
        >
          <option value="ALL">
            All reservations
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="CONFIRMED">
            Confirmed
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>

          <option value="EXPIRED">
            Expired
          </option>
        </select>

      </div>


      {/* TABLE */}

      {loading ? (

        <div className="admin-loading">
          Loading reservations...
        </div>

      ) : (

        <div className="admin-reservations-table-wrapper">

          <table className="admin-reservations-table">

            <thead>

              <tr>
                <th>Reservation</th>
                <th>User</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Expires</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {reservations.map((reservation) => (

                <tr key={reservation.id}>

                  <td>

                    <div className="admin-reservation-code">

                      <strong>
                        {reservation.reservationCode}
                      </strong>

                      <small>
                        ID #{reservation.id}
                      </small>

                    </div>

                  </td>

                  <td>
                    {reservation.userEmail ||
                      reservation.email ||
                      `User #${reservation.userId || "-"}`}
                  </td>

                  <td>
                    Product #{reservation.productId}
                  </td>

                  <td>
                    {reservation.quantity}
                  </td>

                  <td>

                    <span
                      className={`status-badge ${getStatusClass(
                        reservation.status
                      )}`}
                    >
                      {reservation.status}
                    </span>

                  </td>

                  <td>

                    {reservation.expiresAt
                      ? new Date(
                          reservation.expiresAt
                        ).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}

                  </td>

                  <td>

                    {reservation.status === "PENDING" ? (

                      <div className="admin-reservation-actions">

                        <button
                          className="confirm-button"
                          disabled={
                            actionLoading ===
                            reservation.id
                          }
                          onClick={() =>
                            handleConfirm(reservation)
                          }
                        >
                          {actionLoading ===
                          reservation.id
                            ? "..."
                            : "Confirm"}
                        </button>

                        <button
                          className="cancel-button"
                          disabled={
                            actionLoading ===
                            reservation.id
                          }
                          onClick={() =>
                            handleCancel(reservation)
                          }
                        >
                          Cancel
                        </button>

                      </div>

                    ) : (

                      <span className="no-action">
                        —
                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {reservations.length === 0 && (
            <div className="admin-empty">
              No reservations found.
            </div>
          )}

        </div>

      )}


      {/* PAGINATION */}

      {!loading && totalPages > 1 && (

        <div className="pagination">

          <button
            disabled={page === 0}
            onClick={() =>
              setPage((current) => current - 1)
            }
          >
            ← Previous
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() =>
              setPage((current) => current + 1)
            }
          >
            Next →
          </button>

        </div>

      )}

    </div>
  );
}