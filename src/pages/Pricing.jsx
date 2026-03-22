import { CheckIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const tiers = [
  {
    id: "capcut",
    name: "Mobile Editing",
    price: "₹600",
    amount: 600,
    description:
      "Perfect for beginners who want to start editing videos on mobile and grow their social media presence.",
    features: [
      "Complete CapCut course",
      "Mobile video editing",
      "Social media content creation",
      "Transitions & effects",
      "Reels & Shorts editing",
      "Lifetime access",
    ],
    featured: false,
    badge: null,
  },
  {
    id: "combo",
    name: "Mobile + Pc Editing",
    price: "₹1,000",
    amount: 1000,
    description:
      "Get both courses at the best value. Master mobile and desktop editing to become a complete video editor.",
    features: [
      "Complete CapCut course",
      "Complete Premiere Pro course",
      "Mobile & desktop editing",
      "Color grading & correction",
      "Audio mixing & sync",
      "Client project workflow",
      "Certificate of completion",
      "Lifetime access",
    ],
    featured: true,
    badge: "Most Popular",
  },
  {
    id: "premiere_pro",
    name: "Pc Editing",
    price: "₹800",
    amount: 800,
    description:
      "Professional desktop editing for creators who want to work with clients and earn freelancing income.",
    features: [
      "Complete Premiere Pro course",
      "Professional desktop editing",
      "Color grading & correction",
      "Audio mixing & sync",
      "Client project workflow",
      "Certificate of completion",
      "Lifetime access",
    ],
    featured: false,
    badge: null,
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handlePurchase = async (tier) => {
  if (!user) {
    localStorage.setItem("redirectAfterLogin", "/pricing");
    navigate("/login");
    return;
  }

  setLoading(tier.id);

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: tier.amount * 100,
    currency: "INR",
    name: "Vijayanagara Edits",
    description: tier.name,
    handler: async function (response) {
      try {
        if (tier.id === "combo") {
          await supabase.from("purchases").insert([
            {
              user_id: user.id,
              course_id: "capcut",
              amount: tier.amount,
              payment_id: response.razorpay_payment_id,
            },
            {
              user_id: user.id,
              course_id: "premiere_pro",
              amount: 0,
              payment_id: response.razorpay_payment_id,
            },
          ]);
        } else {
          await supabase.from("purchases").insert({
            user_id: user.id,
            course_id: tier.id,
            amount: tier.amount,
            payment_id: response.razorpay_payment_id,
          });
        }

        alert("Payment successful! Your course is now unlocked 🎉");
        navigate("/mycourses");
      } catch (err) {
        console.error(err);
        alert("Payment done but course unlock failed. Contact support.");
      }
    },
    prefill: {
      email: user.email,
      name: user.user_metadata?.full_name || "",
    },
    theme: {
      color: "#7C3AED",
    },
    modal: {
      ondismiss: function () {
        setLoading(null);
      },
    },
  };

  const razor = new window.Razorpay(options);
  razor.open();
  setLoading(null);
};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 pt-36"
    >
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pb-20 pt-6 text-center">

        {/* TITLE */}
        <div className="mb-16">
          <p className="text-indigo-400 font-semibold">Pricing</p>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mt-2">
            Choose the right plan for you
          </h1>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-3xl p-8 ring-1 ${
                tier.featured
                  ? "bg-gray-800 ring-indigo-500 ring-2 scale-105"
                  : "bg-white/5 ring-white/10"
              }`}
            >
              {/* BADGE */}
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                    {tier.badge}
                  </span>
                </div>
              )}

              <h3 className="text-indigo-400 font-semibold text-lg">{tier.name}</h3>

              <div className="mt-4 flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-white">
                  {tier.price}
                </span>
                <span className="text-gray-400">/Lifetime</span>
              </div>

              <p className="text-gray-300 mt-6 text-sm leading-relaxed">
                {tier.description}
              </p>

              <ul className="mt-8 space-y-3 text-gray-300 text-sm text-left">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <CheckIcon className="h-5 w-5 text-indigo-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(tier)}
                disabled={loading === tier.id}
                className={`cursor-pointer mt-8 w-full py-3 rounded-xl font-semibold transition disabled:opacity-50 ${
                  tier.featured
                    ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {loading === tier.id ? "Processing..." : "Purchase"}
              </button>

            </div>
          ))}
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}