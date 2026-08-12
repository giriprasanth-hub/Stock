import { BrowserRouter, Routes, Route,Navigate} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserDashboard from "./pages/user/UserDashboard";

import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleRoute from "./components/common/RoleRoute";
import UserLayout from "./components/layout/UserLayout";

import Products from "./pages/user/Products";
import ProductDetails from "./pages/user/ProductDetails";
import ReservationDetails from "./pages/user/ReservationDetails";
import MyReservations from "./pages/user/MyReservations";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/layout/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import HomeRedirect from "./components/common/HomeRedirect";
import AdminReservations from "./pages/admin/AdminReservations";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>

            {/* USER */}
            <Route element={<RoleRoute allowedRole="USER" />}>

              <Route element={<UserLayout />}>

                <Route
                  path="/dashboard"
                  element={<UserDashboard />}
                />

                <Route
                  path="/products"
                  element={<Products />}
                />

                <Route
                  path="/products/:id"
                  element={<ProductDetails />}
                />

                <Route
                  path="/reservations"
                  element={<MyReservations />}
                />

                <Route
                  path="/reservations/:id"
                  element={<ReservationDetails />}
                />

              </Route>

            </Route>

            {/* ADMIN */}
            <Route element={<RoleRoute allowedRole="ADMIN" />}>

              <Route element={<AdminLayout />}>

                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboard />}
                />

                <Route
                  path="/admin/products"
                  element={<AdminProducts />}
                />

                <Route
                  path="/admin/users"
                  element={<AdminUsers />}
                />

                <Route
                  path="/admin/reservations"
                  element={<AdminReservations />}
                />

              </Route>

            </Route>

          </Route>

        <Route
          path="/"
          element={<HomeRedirect />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;