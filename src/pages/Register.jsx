import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      console.log("Signup data:", data);
      console.log("Signup error:", error);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const user = data.user;

      // Insert into profiles table
      if (user) {
        // ✅ Fixed code
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          role: "user"
        }, { onConflict: "id" });

        if (profileError) {
          console.error("Profile insert error:", profileError);
        }
      }

      alert("Account created successfully!");
      navigate("/dashboard");

    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/dashboard",
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
        Create your account
      </h2>

      <div className="w-full max-w-md bg-white border border-white/50 backdrop-blur-md rounded-2xl p-8 shadow-xl">

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
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
              className="w-full rounded-md bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full rounded-md bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <p className="text-sm text-gray-400 text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign in
            </Link>
          </p>

        </form>

        <div className="mt-8 flex items-center gap-4 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-700"></div>
          Or sign up with
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        <div className="mt-6 flex justify-center">

          <button
            onClick={handleGoogleLogin}
            className="cursor-pointer flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md py-2 px-6 text-white"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

        </div>

      </div>
    </motion.div>
  );
}