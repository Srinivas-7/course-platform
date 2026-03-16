import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      alert("Please fill in both fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully! Please log in.");
      navigate("/login");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 flex items-center justify-center px-6"
    >
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Set new password
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter a new password for your account
        </p>

        {/* Waiting for reset link to be verified */}
        {!ready ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Verifying reset link...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  New password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Confirm password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}

        {/* Back to login */}
        <p className="text-sm text-gray-400 text-center mt-6">
          Remembered your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
          >
            Sign in
          </span>
        </p>

      </div>
    </motion.div>
  );
}