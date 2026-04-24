import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, Lock } from "lucide-react";

const BG = "radial-gradient(ellipse at 50% -10%, rgba(109,40,217,0.45) 0%, transparent 55%), radial-gradient(ellipse at 85% 110%, rgba(255,128,181,0.2) 0%, transparent 50%), #0f0b1a";

const inputCls = "h-11 w-full rounded-xl border border-white/[0.10] bg-[#13131c] pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setReady(true);
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (!password || !confirmPassword) { alert("Please fill in both fields"); return; }
    if (password !== confirmPassword) { alert("Passwords do not match"); return; }
    if (password.length < 6) { alert("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) alert(error.message);
    else { alert("Password updated successfully! Please log in."); navigate("/login"); }
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
            <KeyRound className="h-6 w-6 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Set new password</h1>
          <p className="mt-2 text-sm text-slate-400">Enter a new password for your account.</p>
        </div>

        <div className="rounded-2xl border border-white/[0.10] p-7" style={{ background: "#13131c" }}>
          {!ready ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              <p className="text-sm text-slate-500">Verifying reset link…</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">New password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input type="password" placeholder="Enter new password" value={password}
                    onChange={(e) => setPassword(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">Confirm password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input type="password" placeholder="Confirm new password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} />
                </div>
              </div>
              <button onClick={handleReset} disabled={loading}
                className="mt-2 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50 cursor-pointer">
                {loading ? "Updating…" : "Update Password"}
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Remembered your password?{" "}
            <span onClick={() => navigate("/login")}
              className="cursor-pointer text-violet-400 hover:text-violet-300 font-medium">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}