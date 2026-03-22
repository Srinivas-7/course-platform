import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBuyers: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    totalCourses: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Purchased users
      const { data: purchaseData } = await supabase
        .from("purchases")
        .select("user_id, amount");

      const uniqueBuyers = new Set(purchaseData?.map(p => p.user_id)).size;
      const totalRevenue = purchaseData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      // Total courses
      const { count: courseCount } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });

      // Total registered users
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-gray-900 min-h-screen flex flex-col">
        <Navbar />

        <div className="relative isolate px-6 pt-36 pb-20 lg:px-8 flex-1">

          <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
          </div>

          <div className="mx-auto max-w-5xl">

            {/* WELCOME */}
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400 mb-10">
              Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "Admin"} 👋
            </p>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
                <p className="text-gray-400 text-sm mb-2">Purchased Users</p>
                <p className="text-white text-4xl font-bold">{stats.totalBuyers}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
                <p className="text-gray-400 text-sm mb-2">Total Purchases</p>
                <p className="text-white text-4xl font-bold">{stats.totalPurchases}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
                <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                <p className="text-white text-4xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* QUICK LINKS WITH LIVE STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <Link to="/admin/courses" className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-2xl p-6 transition group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-lg group-hover:text-purple-400 transition">📚 Manage Courses</p>
                  <span className="text-gray-400 text-sm group-hover:text-purple-400 transition">→</span>
                </div>
                <p className="text-gray-400 text-sm">{stats.totalCourses} courses total</p>
              </Link>

              <Link to="/admin/users" className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-2xl p-6 transition group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-lg group-hover:text-purple-400 transition">👥 Manage Users</p>
                  <span className="text-gray-400 text-sm group-hover:text-purple-400 transition">→</span>
                </div>
                <p className="text-gray-400 text-sm">{stats.totalUsers} registered users</p>
              </Link>

              <Link to="/admin/purchases" className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-2xl p-6 transition group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-lg group-hover:text-purple-400 transition">💳 View Purchases</p>
                  <span className="text-gray-400 text-sm group-hover:text-purple-400 transition">→</span>
                </div>
                <p className="text-gray-400 text-sm">₹{stats.totalRevenue.toLocaleString()} total revenue</p>
              </Link>

              <Link to="/admin/upload" className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-2xl p-6 transition group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-lg group-hover:text-purple-400 transition">🎬 Upload Lesson</p>
                  <span className="text-gray-400 text-sm group-hover:text-purple-400 transition">→</span>
                </div>
                <p className="text-gray-400 text-sm">Add new lesson videos</p>
              </Link>

            </div>
          </div>

          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
            <div className="relative left-1/2 aspect-[1155/678] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" />
          </div>

        </div>

        <Footer />
      </div>
    </motion.div>
  );
}