import { CheckIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const tiers = [
  {
    name: "CapCut",
    price: "₹999",
    description:
      "Perfect for beginners who want to start editing videos on mobile and grow their social media presence.",
    features: [
      "Complete CapCut course",
      "Mobile video editing",
      "Social media content creation",
      "Transitions & effects",
      "Lifetime access",
    ],
    featured: false,
  },
  {
    name: "Premiere Pro",
    price: "₹1,999",
    description: "Professional desktop editing for creators who want to work with clients and earn freelancing income.",
    features: [
      "Complete Premiere Pro course",
      "Professional desktop editing",
      "Color grading & correction",
      "Dedicated support representative",
      "Audio mixing & sync",
      "Lifetime access",
    ],
    featured: true,
  },
];

const navigation = [
  { name: "Home", href: "/" },
  { name: "My Courses", href: "/mycourses" },
  { name: "About Us", href: "/about" },
];

export default function Pricing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 pt-36"
    >
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pb-25 pt-6 text-center">

        {/* TITLE */}
        <div className="mb-16">
          <p className="text-indigo-400 font-semibold">Pricing</p>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mt-2">
            Choose the right plan for you
          </h1>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto">

          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-8 ring-1 ring-white/10 ${
                tier.featured ? "bg-gray-800" : "bg-white/5"
              }`}
            >
              <h3 className="text-indigo-400 font-semibold">{tier.name}</h3>

              <div className="mt-4 flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-white">
                  {tier.price}
                </span>
                <span className="text-gray-400">/Lifetime</span>
              </div>

              <p className="text-gray-300 mt-6">{tier.description}</p>

              <ul className="mt-8 space-y-3 text-gray-300 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <CheckIcon className="h-5 w-5 text-indigo-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full py-2 rounded-md font-semibold ${
                  tier.featured
                    ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                    : "bg-black/40 hover:bg-white/20 text-white"
                }`}
              >
                Purchase
              </button>
            </div>
          ))}

        </div>
      </div>
<Footer/>
    </motion.div>
  );
}