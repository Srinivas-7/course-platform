import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      setUsers(data || []);
      setLoading(false);
    };
    fetchUsers();
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

        <div className="relative isolate px-6 pt-46 pb-20 lg:px-8">

          <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
          </div>

          <div className="mx-auto max-w-5xl">

            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Manage Users</h1>
                <p className="text-gray-400">All registered users on your platform</p>
              </div>
              <Link to="/admin" className="text-sm text-gray-400 hover:text-white transition">
                ← Back to Admin
              </Link>
            </div>

            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : users.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 text-center">
                <p className="text-gray-400">No users yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {users.map((user) => (
                  <div key={user.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm border-2 border-purple-400">
                        {user.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.email}</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          Joined {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${user.role === "admin"
                        ? "bg-red-900 text-red-300"
                        : "bg-purple-900 text-purple-300"
                      }`}>
                      {user.role || "student"}
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

      </div>
      <Footer />
    </motion.div>
  );
}