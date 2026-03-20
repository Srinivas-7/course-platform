import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ViewPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchPurchases = async () => {
      const { data } = await supabase
        .from("purchases")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false });

      setPurchases(data || []);
      setTotalRevenue(data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0);
      setLoading(false);
    };
    fetchPurchases();
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

            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">View Purchases</h1>
                <p className="text-gray-400">All course purchases and transactions</p>
              </div>
              <Link to="/admin" className="text-sm text-gray-400 hover:text-white transition">
                ← Back to Admin
              </Link>
            </div>

            {/* TOTAL REVENUE */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-8 text-center">
              <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
              <p className="text-white text-4xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            </div>

            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : purchases.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 text-center">
                <p className="text-gray-400">No purchases yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{purchase.profiles?.email || "Unknown"}</p>
                      <p className="text-gray-400 text-sm mt-0.5">{purchase.course_id}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {new Date(purchase.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className="text-green-400 font-semibold text-lg">
                      ₹{purchase.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

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