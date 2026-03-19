import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

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

    console.log("Logged in user:", data.user);
    navigate("/dashboard", { replace: true });
  };

  const handleForgotPassword = async () => {
    const resetEmail = prompt("Enter your email address to reset your password:");

    if (!resetEmail) return;

    setResetLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: "https://granita-acf12d.netlify.app/reset-password", // ✅ updated
    });

    setResetLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Password reset email sent! Check your inbox.");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://granita-acf12d.netlify.app/dashboard", 
      },
    });

    if (error) console.log(error.message);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6"
    >
      <h2 className="text-3xl font-bold text-white text-center mb-10">
        Sign in to your account
      </h2>

      <div className="w-full max-w-md bg-black border border-white/50 backdrop-blur-md rounded-2xl p-8 shadow-xl">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-gray-50 border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-gray-50 border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="cursor-pointer flex items-center gap-2 text-gray-600">
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

        <div className="mt-8 flex items-center gap-4 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-700"></div>
          Or continue with
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="cursor-pointer flex items-center justify-center gap-2 bg-gray-50 hover:bg-white/20 border border-white/10 rounded-md py-2 px-6 text-white"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
        </div>
      </div>
    </motion.div>
  );
}