import { CheckIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Sparkles } from "lucide-react";

const BG = "radial-gradient(ellipse at 50% -10%, rgba(109,40,217,0.45) 0%, transparent 55%), radial-gradient(ellipse at 85% 110%, rgba(255,128,181,0.2) 0%, transparent 50%), #0f0b1a";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

const tiers = [
  {
    id: "capcut", name: "Mobile Editing", price: "₹399", amount: 600,
    description: "Perfect for beginners who want to start editing videos on mobile and grow their social media presence.",
    features: ["Complete CapCut course", "Mobile video editing", "Social media content creation", "Transitions & effects", "Reels & Shorts editing", "Lifetime access"],
    featured: false, badge: null,
  },
  {
    id: "combo", name: "Mobile + Pc Editing", price: "₹699", amount: 1000,
    description: "Get both courses at the best value. Master mobile and desktop editing to become a complete video editor.",
    features: ["Complete CapCut and Premiere Pro course", "Mobile & desktop editing", "Color grading & correction", "Client project workflow", "Certificate of completion", "Lifetime access"],
    featured: true, badge: "Most Popular",
  },
  {
    id: "premiere_pro", name: "Pc Editing", price: "₹499", amount: 800,
    description: "Professional desktop editing for creators who want to work with clients and earn freelancing income.",
    features: ["Complete Premiere Pro course", "Professional desktop editing", "Color grading & correction", "Client project workflow", "Certificate of completion", "Lifetime access"],
    featured: false, badge: null,
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [dbCourses, setDbCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from("courses").select("*");
      if (data) setDbCourses(data);
    };
    fetchCourses();
  }, []);

  const updatedTiers = tiers.map((tier) => {
    const match = dbCourses.find((c) => c.title.toLowerCase().includes(tier.name.toLowerCase().split(" ")[0]));
    if (!match) return tier;
    return { ...tier, id: match.id, price: `₹${match.price}`, amount: match.price, description: match.description };
  });

  const handlePurchase = async (tier) => {
    if (!user) { localStorage.setItem("redirectAfterLogin", "/pricing"); navigate("/login"); return; }
    setLoading(tier.id);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: tier.amount * 100, currency: "INR",
      name: "Vijayanagara Edits", description: tier.name,
      handler: async function (response) {
        try {
          if (tier.name === "Mobile + Pc Editing") {
            const mobile = dbCourses.find((c) => c.title === "Mobile Editing");
            const pc = dbCourses.find((c) => c.title === "Pc Editing");
            await supabase.from("purchases").insert([
              { user_id: user.id, course_id: mobile.id, amount: tier.amount, payment_id: response.razorpay_payment_id },
              { user_id: user.id, course_id: pc.id, amount: 0, payment_id: response.razorpay_payment_id },
            ]);
          } else {
            await supabase.from("purchases").insert({ user_id: user.id, course_id: tier.id, amount: tier.amount, payment_id: response.razorpay_payment_id });
          }
          alert("Payment successful! Your course is now unlocked 🎉");
          navigate("/mycourses");
        } catch (err) { console.error(err); alert("Payment done but course unlock failed."); }
      },
      prefill: { email: user.email, name: user.user_metadata?.full_name || "" },
      theme: { color: "#7C3AED" },
      modal: { ondismiss: () => setLoading(null) },
    };
    const razor = new window.Razorpay(options);
    razor.open();
    setLoading(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col text-white"
      style={{ background: BG }}
    >
      <Navbar />

      <main className="flex-1 px-4 pt-40 pb-24 md:px-10">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-16 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">Pricing</p>
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              Choose the right <span className="text-violet-400">plan</span> for you
            </h1>
            <p className="mt-3 text-sm text-slate-500">One-time payment · Lifetime access · No subscriptions</p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
            {updatedTiers.map((tier, i) => (
              <motion.div
                key={tier.id}
                custom={i + 1}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="relative flex flex-col rounded-2xl border p-6 transition-colors"
                style={{
                  background: "#13131c",
                  border: tier.featured
                    ? "1px solid rgba(139, 92, 246, 0.6)"
                    : "1px solid rgba(255, 255, 255, 0.07)",
                  boxShadow: tier.featured
                    ? "0 0 0 1px rgba(139,92,246,0.15), 0 24px 48px rgba(0,0,0,0.5)"
                    : "none",
                  transform: tier.featured ? "translateY(-16px)" : "none",
                  paddingTop: tier.featured ? "2rem" : "1.5rem",
                  paddingBottom: tier.featured ? "2rem" : "1.5rem",
                }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      <Sparkles className="h-3 w-3" /> {tier.badge}
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <p className={`text-xs font-semibold uppercase tracking-widest ${tier.featured ? "text-violet-400" : "text-slate-500"}`}>
                  {tier.name}
                </p>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-sm text-slate-500">/Lifetime</span>
                </div>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{tier.description}</p>

                {/* Divider */}
                <div className="my-5 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

                {/* Features */}
                <ul className="flex-1 space-y-2.5">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 ${tier.featured ? "text-violet-400" : "text-slate-600"}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handlePurchase(tier)}
                  disabled={loading === tier.id}
                  className={`mt-7 w-full rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-50 cursor-pointer ${
                    tier.featured
                      ? "bg-violet-600 text-white hover:bg-violet-500"
                      : "text-slate-400 hover:text-white"
                  }`}
                  style={!tier.featured ? {
                    border: "1px solid rgba(255,255,255,0.09)",
                    background: "rgba(255,255,255,0.04)",
                  } : undefined}
                >
                  {loading === tier.id ? "Processing..." : "Purchase"}
                </button>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-16 text-center text-xs text-slate-600"
          >
            Secure payments powered by Razorpay · All prices in INR
          </motion.p>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}