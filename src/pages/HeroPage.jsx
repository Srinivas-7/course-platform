import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const navigation = [
    { name: "Home", href: "/" },
    { name: "My Courses", href: "/mycourses" },
    { name: "About Us", href: "/about" },
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
        <div className="bg-gray-900">
            {/* NAVBAR */}
            <Navbar />

            {/* HERO SECTION */}
            <div className="relative isolate px-6 pt-24 lg:px-8">

                {/* TOP GRADIENT BLOB */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
                    />
                </div>

                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
                    <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                        A Professional Video Editing Course
                    </h1>

                    <p className="mt-8 text-lg font-medium text-gray-400 sm:text-xl">
                        Learn professional video editing from scratch using Premiere Pro & CapCut.
                        Start freelancing and earn from real client projects.
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            to="/pricing"
                            className="rounded-md bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-purple-500"
                        >
                            Enroll Now
                        </Link>

                        <Link to="/about" className="text-sm font-semibold text-white">
                            Learn more →
                        </Link>
                    </div>
                </div>

                {/* BOTTOM GRADIENT BLOB */}
                {/* BOTTOM GRADIENT AREA WITH FOOTER */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
                >
                    <div
                        className="relative left-1/2 aspect-[1155/678] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                    />
                </div>

                {/* FOOTER INSIDE GRADIENT */}
                <div className="relative z-10">
                    <Footer />
                </div>

            </div>


        </div>

      {/* page content */}
    </motion.div>
  );
}