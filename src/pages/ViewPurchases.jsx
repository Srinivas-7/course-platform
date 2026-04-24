import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowUpRight, IndianRupee, Search, ShoppingBag, TrendingUp, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ViewPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      const { data } = await supabase
        .from("purchases")
        .select(`*, profiles!inner(email), courses!inner(title)`)
        .order("created_at", { ascending: false });
      setPurchases(data || []);
      setLoading(false);
    };
    fetchPurchases();
  }, []);

  const totalRevenue = useMemo(() => purchases.reduce((sum, p) => sum + (p.amount || 0), 0), [purchases]);
  const uniqueBuyers = useMemo(() => new Set(purchases.map((p) => p.user_id)).size, [purchases]);

  const filtered = useMemo(() => {
    if (!query.trim()) return purchases;
    const q = query.toLowerCase();
    return purchases.filter(
      (p) => p.profiles?.email?.toLowerCase().includes(q) || p.courses?.title?.toLowerCase().includes(q)
    );
  }, [purchases, query]);

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
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">Transaction history</p>
              <h1 className="text-3xl font-bold text-white md:text-4xl">
                View <span className="text-violet-400">purchases</span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">Track every transaction and monitor your revenue.</p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/admin"
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                <TrendingUp className="h-4 w-4" strokeWidth={2} />
                Dashboard
              </Link>
            </motion.div>
          </motion.header>

          {/* Stats */}
          <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400", hint: "Lifetime earnings" },
              { label: "Total Purchases", value: purchases.length, icon: ShoppingBag, iconBg: "bg-blue-500/10", iconColor: "text-blue-400", hint: "All transactions" },
              { label: "Unique Buyers", value: uniqueBuyers, icon: Users, iconBg: "bg-violet-500/10", iconColor: "text-violet-400", hint: "Distinct customers" },
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

          {/* Search */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={5} className="mb-6">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by email or course…"
                className="h-10 w-full rounded-lg border border-white/[0.10] pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
                style={{ background: "#13131c" }}
              />
            </div>
          </motion.div>

          {/* List */}
          <section className="space-y-2">
            {loading ? (
              <div className="flex flex-col items-center rounded-2xl border border-white/[0.10] p-12 text-center" style={{ background: "#13131c" }}>
                <ShoppingBag className="h-6 w-6 animate-pulse text-slate-600 mb-3" />
                <p className="text-sm text-slate-500">Loading purchases…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-white/[0.10] p-12 text-center" style={{ background: "#13131c" }}>
                <ShoppingBag className="h-6 w-6 text-slate-600 mb-3" />
                <h3 className="text-sm font-semibold text-white">No purchases found</h3>
                <p className="mt-1 text-xs text-slate-500">Try adjusting your search.</p>
              </div>
            ) : (
              filtered.map((purchase, i) => (
                <motion.article key={purchase.id} custom={i + 6} initial="hidden" animate="show" variants={fadeUp}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/[0.10] p-4 transition-colors hover:border-white/[0.18] md:flex-row md:items-center md:p-5"
                  style={{ background: "#13131c" }}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white shrink-0">
                      {purchase.profiles?.email?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{purchase.profiles?.email || "Unknown"}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{purchase.courses?.title || "Unknown Course"}</p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {new Date(purchase.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <span className="flex items-center gap-0.5 text-sm font-semibold text-emerald-400">
                      <IndianRupee className="h-3.5 w-3.5" strokeWidth={2.5} />
                      {purchase.amount?.toLocaleString() ?? "—"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.10] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Paid <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.article>
              ))
            )}
          </section>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="mt-8 text-center text-xs text-slate-600"
          >
            Showing {filtered.length} of {purchases.length} purchases · Total{" "}
            <span className="text-slate-500">₹{totalRevenue.toLocaleString()}</span>
          </motion.p>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}