import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const BG = "radial-gradient(ellipse at 50% -10%, rgba(109,40,217,0.45) 0%, transparent 55%), radial-gradient(ellipse at 85% 110%, rgba(255,128,181,0.2) 0%, transparent 50%), #0f0b1a";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

export default function HeroPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col text-white"
      style={{ background: BG }}
    >
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-20 text-center">


        <motion.h1
          initial="hidden" animate="show" variants={fadeUp} custom={1}
          className="mt-4 text-5xl font-bold leading-tight tracking-tight md:text-7xl"
        >
          A Professional
          <br />
          <span className="text-violet-400">Video Editing</span> Course
        </motion.h1>

        <motion.p
          initial="hidden" animate="show" variants={fadeUp} custom={2}
          className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg"
        >
          Learn professional video editing from scratch using Premiere Pro & CapCut.
          Start freelancing and earn from real client projects.
        </motion.p>

        <motion.div
          initial="hidden" animate="show" variants={fadeUp} custom={3}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            Enroll Now <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/about"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.10] px-6 py-3 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
            style={{ background: "#13131c" }}
          >
            <Play className="h-4 w-4 text-violet-400" /> Learn more
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial="hidden" animate="show" variants={fadeUp} custom={4}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600"
        >
          {["54K+ Followers", "300+ Posts", "Premiere Pro & CapCut", "Lifetime Access"].map((badge) => (
            <span key={badge} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-violet-500" />
              {badge}
            </span>
          ))}
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
}