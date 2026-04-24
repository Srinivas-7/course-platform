import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();



  if (!user) return <Navigate to="/login" replace />;

  const role = user?.user_metadata?.role;

  // 🔴 If admin route but user is not admin
  if (requireAdmin && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // 🟢 If user tries to access user dashboard but is admin
  if (!requireAdmin && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}