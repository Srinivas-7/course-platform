import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";

export default function Login() {
  const navigate = useNavigate();
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaRef.current) return;

    let effect = NET({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      color: 0xa855f7,
      backgroundColor: 0x05051a,
      points: 14,
      spacing: 14,
      maxDistance: 12,
    });

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("fetch") || error.message.includes("network") || error.message === "Failed to fetch") {
        alert("Network error. Please check your internet connection.");
      } else if (error.message.includes("Invalid login credentials")) {
        alert("Wrong email or password. If you signed up with Google, use 'Forgot password?' to set a password first.");
      } else if (error.message.includes("Email not confirmed")) {
        alert("Please verify your email before logging in.");
      } else {
        alert(error.message);
      }
      return;
    }

    const role = data.user?.user_metadata?.role;

    if (role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }
    const redirect = localStorage.getItem("redirectAfterLogin") || "/dashboard";
    localStorage.removeItem("redirectAfterLogin");
    navigate(redirect, { replace: true });
  };

  const handleForgotPassword = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${(import.meta.env.VITE_REDIRECT_URL || '').replace(/\/$/, '')}/reset-password`,
    });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Reset email sent");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${(import.meta.env.VITE_REDIRECT_URL || '').replace(/\/$/, '')}/auth/callback`,
      },
    });

    if (error) alert(error.message);
  };

  return (
    <motion.div ref={vantaRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen w-full flex flex-col items-center justify-center px-6"
    >
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition"
      >
        <ArrowLeft size={20} />
      </button>
      <h2 className="text-4xl font-semibold p-4 text-white text-center tracking-tight">
        Welcome back <span className="ml-2">👋</span>
      </h2>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/200 rounded-2xl p-8 shadow-xl">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-gray-700 border border-gray-600 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-gray-700 border border-gray-600 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="cursor-pointer flex items-center gap-2 text-gray-400">
              <input type="checkbox" className="accent-purple-500" />
              Remember me
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="text-purple-400 hover:text-purple-300 text-sm disabled:opacity-50"
            >
              {resetLoading ? "Sending..." : "Forgot password?"}
            </button>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-md transition"
          >
            Sign in
          </button>

          <p className="text-sm text-gray-400 text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>

        <div className="mt-8 flex items-center gap-4 text-gray-500 text-sm">
          <div className="flex-1 h-px bg-gray-700"></div>
          Or continue with
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="cursor-pointer flex items-center justify-center gap-3 w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-md py-2 px-6 text-white font-medium transition"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
        </div>
      </div>
    </motion.div>
  );
}