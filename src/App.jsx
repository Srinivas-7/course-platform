import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminRoute from "./components/AdminRoute";

const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const HeroPage = lazy(() => import("./pages/HeroPage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyCourses = lazy(() => import("./pages/MyCourses"));
const About = lazy(() => import("./pages/About"));
const Register = lazy(() => import("./pages/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ManageCourses = lazy(() => import("./pages/ManageCourses"));
const ManageUsers = lazy(() => import("./pages/ManageUsers"));
const ViewPurchases = lazy(() => import("./pages/ViewPurchases"));
const AdminUploadLesson = lazy(() => import("./pages/AdminUploadLesson"));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<PublicRoute><HeroPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="/pricing" element={<Pricing />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/mycourses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin pages */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/courses" element={<AdminRoute><ManageCourses /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="/admin/purchases" element={<AdminRoute><ViewPurchases /></AdminRoute>} />
        <Route path="/admin/upload" element={<AdminRoute><AdminUploadLesson /></AdminRoute>} />

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>}>
      <AnimatedRoutes />
    </Suspense>
  );
}