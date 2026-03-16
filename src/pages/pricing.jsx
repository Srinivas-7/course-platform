import { CheckIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Hobby",
    price: "$29",
    description:
      "The perfect plan if you're just getting started with our product.",
    features: [
      "25 products",
      "Up to 10,000 subscribers",
      "Advanced analytics",
      "24-hour support response time",
    ],
    featured: false,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "Dedicated support and infrastructure for your company.",
    features: [
      "Unlimited products",
      "Unlimited subscribers",
      "Advanced analytics",
      "Dedicated support representative",
      "Marketing automations",
      "Custom integrations",
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

      <div className="max-w-6xl mx-auto px-6 text-center">

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
                <span className="text-gray-400">/month</span>
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
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                Get started today
              </button>
            </div>
          ))}

        </div>

      </div>
    </motion.div>
  );
}