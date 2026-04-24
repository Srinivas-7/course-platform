import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { BookOpen, Calendar, LogOut, Mail, Shield } from "lucide-react";

const BG = "radial-gradient(ellipse at 50% -10%, rgba(109,40,217,0.45) 0%, transparent 55%), radial-gradient(ellipse at 85% 110%, rgba(255,128,181,0.2) 0%, transparent 50%), #0f0b1a";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      setUser(session.user);
      const { data } = await supabase.from("purchases").select("course_id").eq("user_id", session.user.id);
      setEnrolledCount(new Set(data?.map(p => p.course_id)).size);
    };
    checkUser();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/"); };

  const getInitials = () => {
    if (!user) return "?";
    const name = user.user_metadata?.full_name || "";
    if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    return user.email[0].toUpperCase();
  };

  const getMemberSince = () => {
    if (!user) return "";
    return new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const getLoginMethod = () => {
    if (!user) return "";
    return user.identities?.some(i => i.provider === "google") ? "Google" : "Email & Password";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col text-white"
      style={{ background: BG }}
    >
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-40 pb-20">
        <div className="w-full max-w-md">

          {/* Avatar card */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}
            className="mb-4 rounded-2xl border border-white/[0.10] p-6 text-center"
            style={{ background: "#13131c" }}
          >
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile"
                className="mx-auto mb-4 h-20 w-20 rounded-full border-2 border-violet-500 object-cover" />
            ) : (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-violet-600 text-3xl font-bold text-white border-2 border-violet-400">
                {getInitials()}
              </div>
            )}
            <h1 className="text-xl font-bold text-white">
              {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
            </h1>
            <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
          </motion.div>

          {/* Stat cards */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}
            className="mb-4 grid grid-cols-2 gap-3"
          >
            <div className="rounded-2xl border border-white/[0.10] p-4 text-center" style={{ background: "#13131c" }}>
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                <BookOpen className="h-4 w-4 text-violet-400" strokeWidth={2} />
              </div>
              <p className="text-2xl font-bold text-white">{enrolledCount}</p>
              <p className="mt-0.5 text-xs text-slate-500">Courses Enrolled</p>
            </div>
            <div className="rounded-2xl border border-white/[0.10] p-4 text-center" style={{ background: "#13131c" }}>
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Calendar className="h-4 w-4 text-emerald-400" strokeWidth={2} />
              </div>
              <p className="text-lg font-bold text-white">{getMemberSince()}</p>
              <p className="mt-0.5 text-xs text-slate-500">Member Since</p>
            </div>
          </motion.div>

          {/* Account info */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}
            className="mb-4 rounded-2xl border border-white/[0.10] p-5"
            style={{ background: "#13131c" }}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Account</p>
            <div className="space-y-0 divide-y divide-white/[0.06]">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Mail className="h-4 w-4 text-slate-500" /> Email
                </div>
                <span className="text-sm text-slate-400 truncate max-w-[160px]">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Shield className="h-4 w-4 text-slate-500" /> Login method
                </div>
                <span className="text-sm text-slate-400">{getLoginMethod()}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Shield className="h-4 w-4 text-slate-500" /> Role
                </div>
                <span className="inline-flex items-center rounded-md bg-violet-500/10 px-2.5 py-1 text-xs font-semibold text-violet-400">
                  Student
                </span>
              </div>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.button
            initial="hidden" animate="show" variants={fadeUp} custom={3}
            onClick={handleLogout}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 py-3 text-sm font-medium text-red-400 transition hover:border-red-500/30 hover:text-red-300 cursor-pointer"
            style={{ background: "rgba(239,68,68,0.05)" }}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </motion.button>

        </div>
      </main>

      <Footer />
    </motion.div>
  );
}