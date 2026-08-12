import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RoleRoute({ allowedRole }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== allowedRole) {
    return user?.role === "ADMIN"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}