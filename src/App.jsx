import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";

const HeroPage = lazy(() => import("./pages/HeroPage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyCourses = lazy(() => import("./pages/MyCourses"));
const About = lazy(() => import("./pages/About"));
const Register = lazy(() => import("./pages/Register"));
const ResetPassword = lazy(() => import ("./pages/ResetPassword"));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HeroPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mycourses" element={<MyCourses />} />
        <Route path="/about" element={<About />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <AnimatedRoutes />
    </Suspense>
  );
}