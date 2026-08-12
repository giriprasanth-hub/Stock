import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-logo">S</div>

          <div>
            <strong>SmartStock</strong>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="admin-nav">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>⌂</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>□</span>
            Products
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>♙</span>
            Users
          </NavLink>

          <NavLink
            to="/admin/reservations"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>◫</span>
            Reservations
          </NavLink>

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-user">

            <div className="admin-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user?.username}</strong>
              <small>{user?.email}</small>
            </div>

          </div>

          <button
            className="admin-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </aside>

      <main className="admin-main">

        <header className="admin-topbar">

          <div>
            <span className="admin-topbar-label">
              ADMINISTRATION
            </span>
          </div>

          <div className="admin-topbar-user">

            <span>
              {user?.username}
            </span>

            <div className="admin-top-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

          </div>

        </header>

        <section className="admin-page-content">
          <Outlet />
        </section>

      </main>

    </div>
  );
}