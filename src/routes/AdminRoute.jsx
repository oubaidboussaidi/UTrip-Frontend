// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "ADMIN") {
    alert("❌ Access denied: You need to login as admin");
    return <Navigate to="/" replace />; // Redirect non-admins to home
  }

  return children;
};

export default AdminRoute;
