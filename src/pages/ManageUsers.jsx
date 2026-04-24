import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowUpRight,
  Crown,
  Mail,
  Search,
  Shield,
  UserPlus,
  Users as UsersIcon,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      setUsers(data || []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => users.filter((u) => {
    const matchesQuery = u.email?.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "all" || u.role === filter;
    return matchesQuery && matchesFilter;
  }), [users, query, filter]);

  const totals = {
    all: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    learner: users.filter((u) => u.role === "learner" || u.role === "student" || !u.role).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
      style={{
        background: "radial-gradient(ellipse at 50% -10%, rgba(109,40,217,0.45) 0%, transparent 55%), radial-gradient(ellipse at 85% 110%, rgba(255,128,181,0.2) 0%, transparent 50%), #0f0b1a",
      }}
    >
      <Navbar />
      <main className="relative flex-1 px-4 pt-44 pb-16 md:px-10 md:pb-20">

        <div className="relative mx-auto max-w-7xl">
          {/* Header */}
          <motion.header initial="hidden" animate="show" variants={fadeUp} custom={1}
            className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
          >
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">Members directory</p>
              <h1 className="text-3xl font-bold text-white md:text-4xl">
                Manage <span className="text-violet-400">users</span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">Review profiles, assign roles and keep your learner community thriving.</p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 cursor-pointer">
                <UserPlus className="h-4 w-4" strokeWidth={2.5} />
                Invite user
              </button>
            </motion.div>
          </motion.header>

          {/* Stats */}
          <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: "Total Users", value: totals.all, icon: UsersIcon, iconBg: "bg-violet-500/10", iconColor: "text-violet-400", hint: "All registered accounts" },
              { label: "Admins", value: totals.admin, icon: Crown, iconBg: "bg-amber-500/10", iconColor: "text-amber-400", hint: "With elevated access" },
              { label: "Learners", value: totals.learner, icon: Shield, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400", hint: "Active course members" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.article key={stat.label} custom={i + 2} initial="hidden" animate="show" variants={fadeUp}
                  className="rounded-2xl border border-white/[0.10] p-5 transition-colors hover:border-white/[0.18]"
                  style={{ background: "#13131c" }}
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}>
                      <Icon className={`h-5 w-5 ${stat.iconColor}`} strokeWidth={2} />
                    </div>
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Live</span>
                  </div>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-white">{loading ? "—" : stat.value}</p>
                  <p className="mt-1 text-xs text-slate-600">{stat.hint}</p>
                </motion.article>
              );
            })}
          </section>

          {/* Toolbar */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={5}
            className="mb-6 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div className="relative flex-1 md:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by email…"
                className="h-10 w-full rounded-lg border border-white/[0.10] pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
                style={{ background: "#13131c" }}
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-white/[0.10] p-1" style={{ background: "#13131c" }}>
              {[
                { key: "all", label: `All (${totals.all})` },
                { key: "admin", label: `Admins (${totals.admin})` },
                { key: "learner", label: `Learners (${totals.learner})` },
              ].map((opt) => (
                <button key={opt.key} onClick={() => setFilter(opt.key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${filter === opt.key ? "bg-violet-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* List */}
          <section className="space-y-2">
            {loading ? (
              <div className="flex flex-col items-center rounded-2xl border border-white/[0.10] p-12 text-center" style={{ background: "#13131c" }}>
                <UsersIcon className="h-6 w-6 animate-pulse text-slate-600 mb-3" />
                <p className="text-sm text-slate-500">Loading users…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-white/[0.10] p-12 text-center" style={{ background: "#13131c" }}>
                <UsersIcon className="h-6 w-6 text-slate-600 mb-3" />
                <h3 className="text-sm font-semibold text-white">No users found</h3>
                <p className="mt-1 text-xs text-slate-500">Try adjusting your search.</p>
              </div>
            ) : (
              filtered.map((user, i) => (
                <motion.article key={user.id} custom={i + 6} initial="hidden" animate="show" variants={fadeUp}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/[0.10] p-4 transition-colors hover:border-white/[0.18] md:flex-row md:items-center md:p-5"
                  style={{ background: "#13131c" }}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                        {user.email?.[0]?.toUpperCase()}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#09090f] bg-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">{user.email}</p>
                        {user.role === "admin" && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                            <Crown className="h-2.5 w-2.5" /> Admin
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Joined {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button type="button" aria-label="Email user"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.10] text-slate-400 transition hover:border-white/[0.18] hover:text-slate-200"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </button>
                    <button type="button"
                      className="inline-flex items-center gap-1 rounded-lg border border-white/[0.10] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-white/[0.18] hover:text-white"
                    >
                      View <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </motion.article>
              ))
            )}
          </section>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="mt-8 text-center text-xs text-slate-600"
          >
            Showing {filtered.length} of {totals.all} users
          </motion.p>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}