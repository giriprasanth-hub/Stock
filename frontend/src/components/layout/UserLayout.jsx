import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">S</div>
          <span>SmartStock</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>⌂</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>□</span>
            Products
          </NavLink>

          <NavLink
            to="/reservations"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>◫</span>
            My Reservations
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user?.username}</strong>
              <small>{user?.role}</small>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="topbar-label">SMARTSTOCK</span>
          </div>

          <div className="topbar-right">
            <span>{user?.email}</span>

            <div className="topbar-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}