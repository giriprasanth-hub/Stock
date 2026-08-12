import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function UserDashboard() {
  const { user } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const response = await api.get("/reservations", {
          params: {
            page: 0,
            size: 10,
          },
        });

        setReservations(response.data.content || []);
      } catch (error) {
        console.error("Failed to load reservations", error);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const pending = reservations.filter(
    (r) => r.status === "PENDING"
  ).length;

  const confirmed = reservations.filter(
    (r) => r.status === "CONFIRMED"
  ).length;

  const cancelled = reservations.filter(
    (r) => r.status === "CANCELLED"
  ).length;

  const expired = reservations.filter(
    (r) => r.status === "EXPIRED"
  ).length;

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>

          <h1>
            Welcome back, {user?.username}.
          </h1>

          <p>
            Manage your stock reservations from one place.
          </p>
        </div>

        <div className="dashboard-date">
          {new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Reservations</span>
          <strong>
            {loading ? "—" : reservations.length}
          </strong>
          <small>All your reservations</small>
        </div>

        <div className="stat-card">
          <span>Pending</span>
          <strong>{loading ? "—" : pending}</strong>
          <small>Awaiting confirmation</small>
        </div>

        <div className="stat-card">
          <span>Confirmed</span>
          <strong>{loading ? "—" : confirmed}</strong>
          <small>Successfully confirmed</small>
        </div>

        <div className="stat-card">
          <span>Cancelled</span>
          <strong>{loading ? "—" : cancelled}</strong>
          <small>Cancelled reservations</small>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">RECENT ACTIVITY</span>
            <h2>My Reservations</h2>
          </div>

          <span className="reservation-count">
            {loading ? "Loading..." : `${reservations.length} records`}
          </span>
        </div>

        {loading ? (
          <div className="empty-card">
            Loading reservations...
          </div>
        ) : reservations.length === 0 ? (
          <div className="empty-card">
            <h3>No reservations yet</h3>
            <p>
              Your stock reservations will appear here.
            </p>
          </div>
        ) : (
          <div className="reservation-list">
            {reservations.map((reservation) => (
              <div
                className="reservation-row"
                key={reservation.id}
              >
                <div>
                  <strong>
                    {reservation.reservationCode}
                  </strong>

                  <span>
                    Product #{reservation.productId}
                  </span>
                </div>

                <div>
                  <span>
                    Qty: {reservation.quantity}
                  </span>
                </div>

                <div>
                  <span
                    className={`status-badge ${reservation.status.toLowerCase()}`}
                  >
                    {reservation.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-note">
        <div>
          <span className="eyebrow">STOCK STATUS</span>
          <h2>Need something from inventory?</h2>
          <p>
            Browse available products and reserve the stock you need.
          </p>
        </div>

        <a href="/products" className="dark-button">
          Browse Products →
        </a>
      </div>
    </div>
  );
}