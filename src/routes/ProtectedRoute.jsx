import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // ⏰ Expiry check
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("adminToken");
      return <Navigate to="/admin/login" replace />;
    }

    return children;
  } catch (err) {
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" replace />;
  }
}
