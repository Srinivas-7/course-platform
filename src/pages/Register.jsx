import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

const BG = "radial-gradient(ellipse at 50% -10%, rgba(109,40,217,0.45) 0%, transparent 55%), radial-gradient(ellipse at 85% 110%, rgba(255,128,181,0.2) 0%, transparent 50%), #0f0b1a";

const inputCls = "h-11 w-full rounded-xl border border-white/[0.10] bg-[#13131c] pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) { alert("Please enter email and password"); return; }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { alert(error.message); setLoading(false); return; }
      if (data.user) {
        await supabase.from("profiles").upsert({ id: data.user.id, email: data.user.email, role: "user" }, { onConflict: "id" });
      }
      alert("Account created successfully!");
      navigate("/dashboard");
    } catch { alert("Something went wrong."); }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${import.meta.env.VITE_REDIRECT_URL}/auth/callback` },
    });
    if (error) alert(error.message);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen w-full flex flex-col items-center justify-center px-4"
      style={{ background: BG }}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">Start your video editing journey today.</p>
        </div>

        <div className="rounded-2xl border border-white/[0.10] p-7" style={{ background: "#13131c" }}>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="mt-2 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50 cursor-pointer">
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">Sign in</Link>
            </p>
          </form>

          <div className="my-6 flex items-center gap-4 text-xs text-slate-600">
            <div className="flex-1 h-px bg-white/[0.06]" /> Or sign up with <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <button onClick={handleGoogleLogin}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/[0.10] py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
            style={{ background: "#1a1a26" }}
          >
            <FcGoogle size={18} /> Continue with Google
          </button>
        </div>
      </div>
    </motion.div>
  );
}