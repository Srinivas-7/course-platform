import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPurchases: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { data: purchases } = await supabase
        .from("purchases")
        .select("amount");

      const totalRevenue = purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      setStats({
        totalUsers: userCount || 0,
        totalPurchases: purchases?.length || 0,
        totalRevenue,
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
      <div className="bg-gray-900 min-h-screen">
        <Navbar />

        <div className="relative isolate px-6 pt-36 pb-20 lg:px-8">

          <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
          </div>

          <div className="mx-auto max-w-5xl">

            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400 mb-10">Overview of your platform</p>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
                <p className="text-gray-400 text-sm mb-2">Total Users</p>
                <p className="text-white text-4xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
                <p className="text-gray-400 text-sm mb-2">Total Purchases</p>
                <p className="text-white text-4xl font-bold">{stats.totalPurchases}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
                <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                <p className="text-white text-4xl font-bold">₹{stats.totalRevenue}</p>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/admin/courses" className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-2xl p-6 transition group">
                <p className="text-white font-semibold text-lg group-hover:text-purple-400 transition">📚 Manage Courses</p>
                <p className="text-gray-400 text-sm mt-1">Add, edit or delete courses</p>
              </Link>
              <Link to="/admin/users" className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-2xl p-6 transition group">
                <p className="text-white font-semibold text-lg group-hover:text-purple-400 transition">👥 Manage Users</p>
                <p className="text-gray-400 text-sm mt-1">View all registered users</p>
              </Link>
              <Link to="/admin/purchases" className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-2xl p-6 transition group">
                <p className="text-white font-semibold text-lg group-hover:text-purple-400 transition">💳 View Purchases</p>
                <p className="text-gray-400 text-sm mt-1">See all transactions</p>
              </Link>
              <Link to="/admin/upload" className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-2xl p-6 transition group">
                <p className="text-white font-semibold text-lg group-hover:text-purple-400 transition">🎬 Upload Lesson</p>
                <p className="text-gray-400 text-sm mt-1">Add new lesson videos</p>
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