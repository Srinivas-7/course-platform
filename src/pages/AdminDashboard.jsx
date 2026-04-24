import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import {
  ArrowUpRight,
  BookOpen,
  Film,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const MotionLink = motion(Link);

  const [stats, setStats] = useState({
    totalBuyers: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    totalCourses: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: purchaseData } = await supabase
        .from("purchases")
        .select("user_id, amount");

      const uniqueBuyers = new Set(purchaseData?.map((p) => p.user_id)).size;
      const totalRevenue =
        purchaseData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      const { count: courseCount } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });

      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      setStats({
        totalBuyers: uniqueBuyers,
        totalPurchases: purchaseData?.length || 0,
        totalRevenue,
        totalCourses: courseCount || 0,
        totalUsers: userCount || 0,
      });
    };

    fetchStats();
  }, []);

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Admin";

  const statCards = [
    {
      label: "Purchased Users",
      value: stats.totalBuyers.toString(),
      delta: `+${stats.totalBuyers}`,
      icon: Users,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
    },
    {
      label: "Total Purchases",
      value: stats.totalPurchases.toString(),
      delta: `+${stats.totalPurchases}`,
      icon: Wallet,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      delta: `+₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
  ];

  const actions = [
    {
      title: "Upload Lesson",
      meta: "Most clicked",
      description: "Add new lesson videos and grow your library",
      icon: Film,
      cta: "Upload now",
      to: "/admin/upload",
      primary: true,
    },
    {
      title: "Manage Courses",
      meta: `${stats.totalCourses} courses`,
      description: "Edit, publish or unpublish your existing courses",
      icon: BookOpen,
      cta: "Open courses",
      to: "/admin/courses",
    },
    {
      title: "Manage Users",
      meta: `${stats.totalUsers} user${stats.totalUsers !== 1 ? "s" : ""}`,
      description: "Review profiles, roles and learner progress",
      icon: Users,
      cta: "View users",
      to: "/admin/users",
    },
    {
      title: "View Purchases",
      meta: `₹${stats.totalRevenue.toLocaleString()} revenue`,
      description: "Track every transaction and refund instantly",
      icon: Wallet,
      cta: "See history",
      to: "/admin/purchases",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
      style={{
        background: "radial-gradient(ellipse at 50% -10%, rgba(109,40,217,0.45) 0%, transparent 55%), radial-gradient(ellipse at 85% 110%, rgba(255,128,181,0.2) 0%, transparent 50%), #0f0b1a",
      }}
    >
      <Navbar />

      <main className="relative flex-1 px-4 pt-44 pb-16 md:px-10 md:pb-20">

        <div className="relative mx-auto max-w-7xl">
          {/* Header */}
          <motion.header
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
          >
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">
                Admin Dashboard
              </p>
              <h1 className="text-3xl font-bold text-white md:text-4xl">
                Welcome back, <span className="text-violet-400">{firstName}</span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Here's what's happening with your courses today.
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/admin/upload"
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Upload New Lesson
              </Link>
            </motion.div>
          </motion.header>

          {/* Stats grid */}
          <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.article
                  key={stat.label}
                  custom={i + 1}
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  className="rounded-2xl border border-white/[0.10] p-5 transition-colors hover:border-white/[0.18]"
                  style={{ background: "#13131c" }}
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}>
                      <Icon className={`h-5 w-5 ${stat.iconColor}`} strokeWidth={2} />
                    </div>
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Live
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-white">{stat.value}</p>
                </motion.article>
              );
            })}
          </section>

          {/* Actions grid */}
          <section>
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={4}
              className="mb-5"
            >
              <h2 className="text-lg font-semibold text-white">Quick actions</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Jump straight into the things you do most often.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {actions.map((action, i) => {
                const Icon = action.icon;
                const isPrimary = action.primary;
                return (
                  <motion.div
                    key={action.title}
                    custom={i + 5}
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className={isPrimary ? "lg:col-span-2" : ""}
                  >
                    <Link
                      to={action.to}
                      className={`group flex h-full flex-col items-start rounded-2xl p-5 transition-all ${
                        isPrimary
                          ? "bg-violet-600 hover:bg-violet-500"
                          : "border border-white/[0.10] hover:border-white/[0.18]"
                      }`}
                      style={isPrimary ? undefined : { background: "#13131c" }}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          isPrimary ? "bg-white/15" : "bg-white/5"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${isPrimary ? "text-white" : "text-slate-300"}`}
                          strokeWidth={2}
                        />
                      </div>

                      <p className={`mt-3 text-xs font-medium ${isPrimary ? "text-violet-200" : "text-slate-500"}`}>
                        {action.meta}
                      </p>

                      <h3 className="mt-1 text-base font-semibold text-white">
                        {action.title}
                      </h3>
                      <p className={`mt-1 text-sm ${isPrimary ? "text-violet-100/70" : "text-slate-500"}`}>
                        {action.description}
                      </p>

                      <span className={`mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-medium ${isPrimary ? "text-white" : "text-violet-400"}`}>
                        {action.cta}
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}