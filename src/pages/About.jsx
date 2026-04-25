import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Film, Globe, Users, Play, ArrowRight, Star, Zap, Trophy, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/* ─── Animation Variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

/* ─── Animated Counter ───────────────────────────────────────── */
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const num = parseInt(target.replace(/\D/g, ""));
        let start = 0;
        const step = Math.ceil(num / 60);
        const interval = setInterval(() => {
          start += step;
          if (start >= num) { setCount(num); clearInterval(interval); }
          else setCount(start);
        }, 20);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Data ───────────────────────────────────────────────────── */
const stats = [
  { icon: Users, value: "54", suffix: "K+", label: "Instagram Followers", color: "text-violet-400", glow: "rgba(139,92,246,0.3)", bg: "rgba(139,92,246,0.08)" },
  { icon: Film, value: "300", suffix: "+", label: "Posts Published", color: "text-pink-400", glow: "rgba(236,72,153,0.3)", bg: "rgba(236,72,153,0.08)" },
  { icon: Trophy, value: "2", suffix: "+", label: "Years of Teaching", color: "text-amber-400", glow: "rgba(251,191,36,0.3)", bg: "rgba(251,191,36,0.08)" },
  { icon: Heart, value: "1", suffix: "M+", label: "Views Generated", color: "text-rose-400", glow: "rgba(244,63,94,0.3)", bg: "rgba(244,63,94,0.08)" },
];

const journey = [
  { year: "2022", title: "Started Creating", desc: "Began posting short-form video content on Instagram, experimenting with editing styles and storytelling." },
  { year: "2023", title: "10K Followers", desc: "Hit the first major milestone with a growing community of creators eager to learn video editing." },
  { year: "2024", title: "Launched First Course", desc: "Released a structured Premiere Pro course, helping hundreds of beginners land their first editing clients." },
  { year: "2025", title: "54K & Scaling", desc: "Expanded to CapCut, grew to 54K+ followers, and built a full platform for aspiring video editors." },
];

const tools = [
  { name: "Premiere Pro", color: "#9b59b6" },
  { name: "CapCut", color: "#3498db" },
  { name: "After Effects", color: "#2ecc71" },
  { name: "DaVinci Resolve", color: "#e74c3c" },
  { name: "Photoshop", color: "#f39c12" },
  { name: "Audition", color: "#1abc9c" },
];

/* ─── Video data ─────────────────────────────────────────────── */
const portraitVideos = [
  { id: 1, title: "Reel Editing Breakdown", tag: "Tutorial" },
  { id: 3, title: "CapCut Masterclass Clip", tag: "Course" },
];
const landscapeVideo = { id: 2, title: "Client Project Showcase", tag: "Portfolio" };

/* ─── Component ──────────────────────────────────────────────── */
export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col text-white"
      style={{ background: "#0a0a12" }}
    >
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-44 pb-28 text-center overflow-hidden">
        {/* Background glow blobs */}
        <div style={{
          position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "500px",
          background: "radial-gradient(ellipse, rgba(109,40,217,0.35) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "0", right: "10%",
          width: "400px", height: "400px",
          background: "radial-gradient(ellipse, rgba(236,72,153,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          style={{ position: "relative" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: "999px", padding: "5px 14px",
            fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "#a78bfa", marginBottom: "20px",
          }}>
            <Zap style={{ width: 12, height: 12 }} /> Our Story
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: 800,
            lineHeight: 1.08, letterSpacing: "-0.03em",
            maxWidth: "780px", position: "relative",
          }}>
          We turn creators into{" "}
          <span style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            professional editors
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
          style={{
            marginTop: "20px", fontSize: "1.05rem", lineHeight: 1.75,
            color: "#94a3b8", maxWidth: "560px", position: "relative",
          }}>
          Vijayanagara Edits is built by creators, for creators. We teach Premiere Pro
          and CapCut through real-world projects — so you go from beginner to booked.
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          style={{ display: "flex", gap: "12px", marginTop: "32px", flexWrap: "wrap", justifyContent: "center", position: "relative" }}>
          <Link to="/pricing" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            padding: "12px 24px", borderRadius: "12px",
            fontSize: "14px", fontWeight: 600, color: "white",
            textDecoration: "none", transition: "opacity 0.2s",
            boxShadow: "0 0 24px rgba(124,58,237,0.4)",
          }}>
            Start Learning <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            padding: "12px 24px", borderRadius: "12px",
            fontSize: "14px", fontWeight: 500, color: "#cbd5e1",
            textDecoration: "none", transition: "border-color 0.2s",
          }}>
            <Play style={{ width: 14, height: 14, color: "#a78bfa" }} /> Watch our Reels
          </a>
        </motion.div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <section style={{ padding: "0 16px 80px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} custom={i}
                style={{
                  background: "#11111c", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "20px", padding: "28px 24px", textAlign: "center",
                  position: "relative", overflow: "hidden",
                }}>
                <div style={{
                  position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                  width: "120px", height: "1px",
                  background: `linear-gradient(90deg, transparent, ${s.glow.replace("0.3", "0.6")}, transparent)`,
                }} />
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: s.bg, marginBottom: "14px",
                }}>
                  <Icon style={{ width: 20, height: 20 }} className={s.color} strokeWidth={2} />
                </div>
                <p style={{ fontSize: "2.4rem", fontWeight: 800, color: "white", lineHeight: 1 }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </p>
                <p style={{ marginTop: "6px", fontSize: "13px", color: "#64748b" }}>{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Featured Work ───────────────────────────────────────── */}
      <section style={{ padding: "0 16px 100px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b", marginBottom: "10px" }}>
              Featured Work
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              See what we create
            </h2>
            <p style={{ marginTop: "12px", color: "#64748b", fontSize: "15px", maxWidth: "420px", margin: "12px auto 0" }}>
              Real edits. Real results. From reels to client projects.
            </p>
          </motion.div>

          {/* Row 1 — Two portrait reels side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            {portraitVideos.map((v, i) => (
              <motion.div key={v.id} variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} custom={i}
                style={{
                  background: "#11111c", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "20px", overflow: "hidden",
                }}>
                <div style={{ width: "100%", aspectRatio: "9/16", maxHeight: "520px", position: "relative", overflow: "hidden" }}>
                  <video
                    src={`/videos/reel${v.id}.mp4`}
                    autoPlay muted loop playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <div style={{ padding: "14px 18px" }}>
                  <span style={{
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "#7c3aed",
                    background: "rgba(124,58,237,0.12)", borderRadius: "6px", padding: "3px 8px",
                  }}>{v.tag}</span>
                  <p style={{ marginTop: "8px", fontWeight: 600, fontSize: "15px", color: "#e2e8f0" }}>{v.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Row 2 — reel2 is portrait content, rotate 90deg to fix orientation */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}
            style={{
              background: "#11111c", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "20px", overflow: "hidden",
              maxWidth: "360px", margin: "0 auto",  /* portrait card centred */
            }}>
            {/*
              The video file has landscape metadata (16:9) but content is portrait.
              Container → 9:16 portrait.
              Video → rotated 90deg. Width set to 177.78% (=16/9×100%) so that
              after the 90deg rotation the video exactly fills the portrait container.
            */}
            <div style={{ width: "100%", aspectRatio: "9/16", position: "relative", overflow: "hidden" }}>
              <video
                src={`/videos/reel${landscapeVideo.id}.mp4`}
                autoPlay muted loop playsInline
                style={{
                  position: "absolute",
                  width: "277.78%",
                  height: "auto",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-90deg)",
                  transformOrigin: "center center",
                }}
              />
            </div>
            <div style={{ padding: "14px 20px" }}>
              <span style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "#7c3aed",
                background: "rgba(124,58,237,0.12)", borderRadius: "6px", padding: "3px 8px",
              }}>{landscapeVideo.tag}</span>
              <p style={{ marginTop: "8px", fontWeight: 600, fontSize: "15px", color: "#e2e8f0" }}>{landscapeVideo.title}</p>
            </div>
          </motion.div>

        </div>
      </section>


      {/* ── Journey / Timeline ─────────────────────────────────── */}
      <section style={{ padding: "0 16px 100px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b", marginBottom: "10px" }}>
              Timeline
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Our journey so far
            </h2>
          </motion.div>

          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px",
              background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.3), rgba(139,92,246,0.3), transparent)",
              transform: "translateX(-50%)",
            }} />

            {journey.map((item, i) => (
              <motion.div key={item.year} variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} custom={i}
                style={{
                  display: "flex",
                  flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                  gap: "32px", marginBottom: "48px", alignItems: "flex-start",
                }}>
                <div style={{ flex: 1, textAlign: i % 2 === 0 ? "right" : "left" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: 700, color: "#7c3aed",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>{item.year}</span>
                  <h3 style={{ fontWeight: 700, fontSize: "17px", color: "#e2e8f0", marginTop: "4px" }}>{item.title}</h3>
                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.65, marginTop: "6px" }}>{item.desc}</p>
                </div>

                {/* Center dot */}
                <div style={{
                  flexShrink: 0, width: "14px", height: "14px",
                  borderRadius: "50%", marginTop: "20px",
                  background: "#7c3aed",
                  boxShadow: "0 0 12px rgba(124,58,237,0.6)",
                  border: "2px solid #0a0a12",
                }} />

                <div style={{ flex: 1 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools We Teach ─────────────────────────────────────── */}
      <section style={{ padding: "0 16px 100px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ marginBottom: "40px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b", marginBottom: "10px" }}>
              Tools
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              What you'll master
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {tools.map((tool, i) => (
              <motion.div key={tool.name} variants={fadeIn} initial="hidden" whileInView="show"
                viewport={{ once: true }} custom={i}
                style={{
                  background: "#11111c", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px", padding: "12px 20px",
                  fontSize: "14px", fontWeight: 600, color: "#e2e8f0",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                <span style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: tool.color, flexShrink: 0,
                  boxShadow: `0 0 8px ${tool.color}80`,
                }} />
                {tool.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: "0 16px 120px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{
              background: "#11111c", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "28px", padding: "64px 40px", textAlign: "center",
              position: "relative", overflow: "hidden",
            }}>
            {/* Glow */}
            <div style={{
              position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
              width: "400px", height: "300px",
              background: "radial-gradient(ellipse, rgba(109,40,217,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: "999px", padding: "5px 14px",
              fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#a78bfa", marginBottom: "20px",
              position: "relative",
            }}>
              <Zap style={{ width: 12, height: 12 }} /> Limited Spots
            </span>

            <h2 style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800,
              letterSpacing: "-0.03em", lineHeight: 1.15, position: "relative",
            }}>
              Ready to become a{" "}
              <span style={{
                background: "linear-gradient(135deg, #a78bfa, #ec4899)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                pro editor?
              </span>
            </h2>
            <p style={{ marginTop: "16px", color: "#64748b", fontSize: "15px", maxWidth: "400px", margin: "16px auto 0", position: "relative" }}>
              Join hundreds of creators already leveling up their skills with our structured courses.
            </p>

            <div style={{ display: "flex", gap: "12px", marginTop: "32px", flexWrap: "wrap", justifyContent: "center", position: "relative" }}>
              <Link to="/pricing" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                padding: "14px 28px", borderRadius: "14px",
                fontSize: "14px", fontWeight: 600, color: "white",
                textDecoration: "none",
                boxShadow: "0 0 32px rgba(124,58,237,0.5)",
              }}>
                View Courses <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
              <Link to="/login" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                padding: "14px 28px", borderRadius: "14px",
                fontSize: "14px", fontWeight: 500, color: "#cbd5e1",
                textDecoration: "none",
              }}>
                Sign In Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}