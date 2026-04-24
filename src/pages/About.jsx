import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Film, Globe, Users } from "lucide-react";

const BG = "radial-gradient(ellipse at 50% -10%, rgba(109,40,217,0.45) 0%, transparent 55%), radial-gradient(ellipse at 85% 110%, rgba(255,128,181,0.2) 0%, transparent 50%), #0f0b1a";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

const stats = [
  { icon: Users, value: "54K+", label: "Followers", color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Film, value: "300+", label: "Posts Published", color: "text-pink-400", bg: "bg-pink-500/10" },
  { icon: Globe, value: "2+", label: "Years Teaching", color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col text-white"
      style={{ background: BG }}
    >
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-40 pb-20 md:px-10">
        <div className="mx-auto max-w-3xl w-full text-center">

          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">Our story</p>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Helping creators master{" "}
              <span className="text-violet-400">video editing</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">
              Vijayanagara Edits teaches creators how to become professional video editors using tools like
              Premiere Pro and CapCut. From social media content to client projects, our goal is to help
              creators turn editing skills into real careers.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              With over 54K followers and 300+ posts, we've worked on brand collaborations, paid promotions,
              and editing projects that help creators grow their presence online.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label} custom={i + 1} initial="hidden" animate="show" variants={fadeUp}
                  className="rounded-2xl border border-white/[0.10] p-6 text-center"
                  style={{ background: "#13131c" }}
                >
                  <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
                    <Icon className={`h-5 w-5 ${s.color}`} strokeWidth={2} />
                  </div>
                  <p className="text-3xl font-bold text-white">{s.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{s.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Mission card */}
          <motion.div
            custom={4} initial="hidden" animate="show" variants={fadeUp}
            className="mt-6 rounded-2xl border border-white/[0.10] p-8 text-left"
            style={{ background: "#13131c" }}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Our mission</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              We believe every creator deserves access to professional-grade education without the price tag.
              Our structured courses break down complex editing techniques into digestible, actionable lessons
              that get you results fast — whether you're editing reels, client videos, or building a freelance career.
            </p>
          </motion.div>

        </div>
      </main>

      <Footer />
    </motion.div>
  );
}