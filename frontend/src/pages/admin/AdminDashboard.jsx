import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboard } from "../../services/adminService";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminDashboard();

        setDashboard(data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        {error}
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* HEADER */}

      <div className="admin-dashboard-header">

        <div>

          <span className="eyebrow">
            ADMIN OVERVIEW
          </span>

          <h1>
            Good evening, {user?.username}.
          </h1>

          <p>
            Here's what's happening across SmartStock.
          </p>

        </div>

        <div className="admin-date">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>

      </div>


      {/* INVENTORY */}

      <div className="admin-section-label">
        INVENTORY
      </div>

      <div className="admin-stats-grid">

        <div className="admin-stat-card large">

          <span>Total Products</span>

          <strong>
            {dashboard.totalProducts}
          </strong>

          <small>
            Products in inventory
          </small>

        </div>

        <div className="admin-stat-card">

          <span>Active</span>

          <strong>
            {dashboard.activeProducts}
          </strong>

          <small>
            Currently available
          </small>

        </div>

        <div className="admin-stat-card">

          <span>Inactive</span>

          <strong>
            {dashboard.inactiveProducts}
          </strong>

          <small>
            Currently disabled
          </small>

        </div>

        <div className="admin-stat-card">

          <span>Total Users</span>

          <strong>
            {dashboard.totalUsers}
          </strong>

          <small>
            Registered accounts
          </small>

        </div>

      </div>


      {/* RESERVATIONS */}

      <div className="admin-section-label reservation-label">
        RESERVATIONS
      </div>

      <div className="admin-reservation-grid">

        <div className="admin-reservation-card pending-card">

          <span>Pending</span>

          <strong>
            {dashboard.pendingReservations}
          </strong>

          <small>
            Awaiting action
          </small>

        </div>

        <div className="admin-reservation-card confirmed-card">

          <span>Confirmed</span>

          <strong>
            {dashboard.confirmedReservations}
          </strong>

          <small>
            Successfully confirmed
          </small>

        </div>

        <div className="admin-reservation-card cancelled-card">

          <span>Cancelled</span>

          <strong>
            {dashboard.cancelledReservations}
          </strong>

          <small>
            Cancelled reservations
          </small>

        </div>

        <div className="admin-reservation-card expired-card">

          <span>Expired</span>

          <strong>
            {dashboard.expiredReservations}
          </strong>

          <small>
            Reservations expired
          </small>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="admin-summary">

        <div>

          <span className="eyebrow">
            SYSTEM STATUS
          </span>

          <h2>
            SmartStock is running normally.
          </h2>

          <p>
            Inventory, users and reservation
            services are connected to the backend.
          </p>

        </div>

        <div className="system-status">
          <span></span>
          Operational
        </div>

      </div>

    </div>
  );
}