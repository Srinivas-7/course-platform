import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [enrolledCount, setEnrolledCount] = useState(0);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/login");
            } else {
                setUser(session.user);

                // ✅ Fetch real enrolled count
                const { data } = await supabase
                    .from("purchases")
                    .select("course_id")
                    .eq("user_id", session.user.id);

                // Count unique courses
                const unique = new Set(data?.map(p => p.course_id)).size;
                setEnrolledCount(unique);
            }
        };
        checkUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    const getInitials = () => {
        if (!user) return "?";
        const name = user.user_metadata?.full_name || "";
        if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        return user.email[0].toUpperCase();
    };

    const getMemberSince = () => {
        if (!user) return "";
        const date = new Date(user.created_at);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    const getLoginMethod = () => {
        if (!user) return "";
        const identities = user.identities || [];
        if (identities.some(i => i.provider === "google")) return "Google";
        return "Email & Password";
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
        >
            <div className="bg-gray-900 min-h-screen">

                <Navbar />

                {/* PROFILE CONTENT */}
                <div className="relative isolate px-6 pt-36 pb-20 lg:px-8">

                    {/* TOP GRADIENT BLOB */}
                    <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
                    </div>

                    <div className="mx-auto max-w-lg">

                        <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6 flex flex-col gap-5">

                            {/* AVATAR + NAME */}
                            <div className="flex flex-col items-center mb-8">
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-20 h-20 rounded-full border-4 border-purple-500 object-cover mb-4" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-purple-400 mb-4">
                                        {getInitials()}
                                    </div>
                                )}
                                <h1 className="text-2xl font-semibold text-white">
                                    {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                                </h1>
                                <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
                            </div>

                            {/* STAT CARDS */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
                                    <p className="text-gray-400 text-sm mb-1">Courses Enrolled</p>
                                    <p className="text-white text-2xl font-semibold">{enrolledCount}</p>
                                </div>
                                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
                                    <p className="text-gray-400 text-sm mb-1">Member Since</p>
                                    <p className="text-white text-lg font-semibold">{getMemberSince()}</p>
                                </div>
                            </div>

                            {/* ACCOUNT INFO */}
                            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6">
                                <p className="text-gray-500 text-xs font-semibold tracking-widest mb-4">ACCOUNT</p>

                                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                                    <span className="text-gray-300 text-sm">Email</span>
                                    <span className="text-gray-400 text-sm">{user?.email}</span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                                    <span className="text-gray-300 text-sm">Login method</span>
                                    <span className="text-gray-400 text-sm">{getLoginMethod()}</span>
                                </div>

                                <div className="flex justify-between items-center py-3">
                                    <span className="text-gray-300 text-sm">Role</span>
                                    <span className="bg-purple-900 text-purple-300 text-xs px-3 py-1 rounded-full">
                                        Student
                                    </span>
                                </div>
                            </div>

                            {/* LOGOUT BUTTON */}
                            <button
                                onClick={handleLogout}
                                className="w-full py-2.5 rounded-xl border border-red-800 text-red-400 hover:bg-red-900/20 hover:cursor-pointer transition text-sm font-medium"
                            >
                                Log out
                            </button>

                        </div>
                    </div>

                    {/* BOTTOM GRADIENT BLOB */}
                    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
                        <div className="relative left-1/2 aspect-[1155/678] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" />
                    </div>

                </div>

                <Footer />

            </div>
        </motion.div>
    );
}