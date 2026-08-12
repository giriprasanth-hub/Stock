import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getReservations,
  confirmReservation,
  cancelReservation,
} from "../../services/reservationService";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReservations({
        page,
        size: 10,
      });

      setReservations(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
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
  }, [page]);

  const handleConfirm = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to confirm this reservation?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);
      setError("");

      await confirmReservation(id);

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

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);
      setError("");

      await cancelReservation(id);

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

  return (
    <div className="reservations-page">

      <div className="reservations-header">
        <div>
          <span className="eyebrow">
            STOCK RESERVATIONS
          </span>

          <h1>My Reservations</h1>

          <p>
            Track and manage the stock you have reserved.
          </p>
        </div>

        <Link
          to="/products"
          className="dark-button"
        >
          Browse Products →
        </Link>
      </div>

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="reservation-loading">
          Loading reservations...
        </div>
      ) : reservations.length === 0 ? (
        <div className="reservations-empty">

          <div className="empty-icon">
            ◫
          </div>

          <h2>No reservations yet</h2>

          <p>
            Browse products and reserve stock to see
            your reservations here.
          </p>

          <Link
            to="/products"
            className="dark-button"
          >
            Browse Products
          </Link>

        </div>
      ) : (

        <div className="reservations-table-wrapper">

          <table className="reservations-table">

            <thead>
              <tr>
                <th>Reservation</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Expires</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {reservations.map((reservation) => (

                <tr key={reservation.id}>

                  <td>
                    <Link
                      to={`/reservations/${reservation.id}`}
                      className="reservation-code"
                    >
                      {reservation.reservationCode}
                    </Link>
                  </td>

                  <td>
                    Product #{reservation.productId}
                  </td>

                  <td>
                    {reservation.quantity}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${reservation.status.toLowerCase()}`}
                    >
                      {reservation.status}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      reservation.expiresAt
                    ).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td>

                    {reservation.status === "PENDING" ? (

                      <div className="reservation-actions">

                        <button
                          className="confirm-button"
                          disabled={
                            actionLoading === reservation.id
                          }
                          onClick={() =>
                            handleConfirm(reservation.id)
                          }
                        >
                          {actionLoading === reservation.id
                            ? "..."
                            : "Confirm"}
                        </button>

                        <button
                          className="cancel-button"
                          disabled={
                            actionLoading === reservation.id
                          }
                          onClick={() =>
                            handleCancel(reservation.id)
                          }
                        >
                          Cancel
                        </button>

                      </div>

                    ) : (

                      <Link
                        to={`/reservations/${reservation.id}`}
                        className="view-link"
                      >
                        View
                      </Link>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

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