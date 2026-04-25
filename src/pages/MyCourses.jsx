import { StarIcon } from "@heroicons/react/20/solid";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Play, ShoppingBag } from "lucide-react";

const BG = "radial-gradient(ellipse at 50% -10%, rgba(109,40,217,0.45) 0%, transparent 55%), radial-gradient(ellipse at 85% 110%, rgba(255,128,181,0.2) 0%, transparent 50%), #0f0b1a";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

const COURSES = [
  {
    id: "capcut",
    name: "Mobile Editing",
    reviews: { average: 5, totalCount: 310 },
    description: "Learn how to create viral Instagram reels and short-form content using CapCut editing techniques.",
    highlights: ["Viral reels editing workflow", "Subtitle animations", "Trending transitions", "Short-form storytelling"],
  },
  {
    id: "premiere_pro",
    name: "Pc Editing",
    reviews: { average: 5, totalCount: 420 },
    description: "Learn professional video editing using Adobe Premiere Pro. Master cinematic transitions, color grading and professional editing workflows.",
    highlights: ["Professional Premiere Pro workflow", "Cinematic transitions", "Color grading techniques", "Real client editing projects"],
  },
];

export default function MyCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // 1. get purchases
      const { data: purchaseData, error } = await supabase
        .from("purchases")
        .select("course_id")
        .eq("user_id", user.id);

      const courseIds = purchaseData?.map(p => p.course_id) || [];

      // 2. get courses from DB
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .in("id", courseIds);

      setCourses(courseData || []);

      // 🔁 KEEP YOUR EXISTING PROGRESS LOGIC
      const { data: progressData } = await supabase
        .from("progress")
        .select("course_id, lesson_id")
        .eq("user_id", user.id);

      const progressMap = {};
      progressData?.forEach(p => {
        if (!progressMap[p.course_id]) progressMap[p.course_id] = 0;
        progressMap[p.course_id]++;
      });

      setProgress(progressMap);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const purchasedCourses = courses;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col text-white"
      style={{ background: BG }}
    >
      <Navbar />

      <main className="flex-1 px-4 pt-40 pb-20 md:px-10">

        {purchasedCourses.length === 0 ? (
          <motion.div
            initial="hidden" animate="show" variants={fadeUp}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.10]" style={{ background: "#13131c" }}>
              <ShoppingBag className="h-7 w-7 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">No courses yet</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-400">
              You haven't purchased any courses yet. Browse our courses and start your video editing journey!
            </p>
            <button onClick={() => navigate("/pricing")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 cursor-pointer"
            >
              Browse Courses
            </button>
          </motion.div>
        ) : (
          <div className="mx-auto max-w-5xl space-y-6">
            <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-8">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Your learning</p>
              <h1 className="mt-1 text-3xl font-bold text-white md:text-4xl">My <span className="text-violet-400">Courses</span></h1>
            </motion.div>

            {purchasedCourses.map((course, index) => {
              const completed = progress[course.id] || 0;
              const pct = Math.min((completed / 10) * 100, 100);
              return (
                <motion.div
                  key={index} custom={index + 1} initial="hidden" animate="show" variants={fadeUp}
                  className="rounded-2xl border border-white/[0.10] p-6 md:p-8"
                  style={{ background: "#13131c" }}
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    {/* Left */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                          <BookOpen className="h-5 w-5 text-violet-400" strokeWidth={2} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">{course.title}</h2>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {[0, 1, 2, 3, 4].map(r => (
                              <StarIcon
                                key={r}
                                className={`h-3.5 w-3.5 ${(course.reviews?.average || 5) > r
                                  ? "text-yellow-400"
                                  : "text-slate-700"
                                  }`}
                              />
                            ))}

                            <span className="text-xs text-slate-500 ml-1">
                              {course.reviews?.totalCount || 100} students
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-slate-400 mb-4">{course.description}</p>

                      {completed > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                            <span>Progress</span>
                            <span>{completed} lessons completed</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                            <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )}

                      <button onClick={() => navigate(`/learn/${course.id}`)}
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 cursor-pointer"
                      >
                        <Play className="h-4 w-4" />
                        {completed > 0 ? "Continue Course" : "Start Course"}
                      </button>
                    </div>

                    {/* Highlights */}
                    <div className="md:w-56 lg:w-64">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">What you'll learn</p>
                      <ul className="space-y-2">
                        {course.highlights.map(item => (
                          <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" strokeWidth={2} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </motion.div>
  );
}