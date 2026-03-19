import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;

  // If already logged in, redirect to dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}