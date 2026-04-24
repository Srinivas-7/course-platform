import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BookOpen, Film, IndianRupee, Trash2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
      setCourses(data || []);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    await supabase.from("courses").delete().eq("id", id);
    setCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
      style={{
        background: "radial-gradient(ellipse at 50% -10%, rgba(109,40,217,0.45) 0%, transparent 55%), radial-gradient(ellipse at 85% 110%, rgba(255,128,181,0.2) 0%, transparent 50%), #0f0b1a",
      }}
    >
      <Navbar />
      <main className="relative flex-1 px-4 pt-44 pb-16 md:px-10 md:pb-20">

        <div className="relative mx-auto max-w-7xl">
          {/* Header */}
          <motion.header initial="hidden" animate="show" variants={fadeUp} custom={1} className="mb-10">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">Course library</p>
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              Manage <span className="text-violet-400">courses</span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">View and remove courses from your platform.</p>
          </motion.header>

          {/* Stat pill */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/[0.10] px-4 py-2 text-sm text-slate-400" style={{ background: "#13131c" }}
          >
            <BookOpen className="h-4 w-4 text-violet-400" />
            {loading ? "Loading…" : `${courses.length} course${courses.length !== 1 ? "s" : ""} total`}
          </motion.div>

          {/* List */}
          <section className="space-y-2">
            {loading ? (
              <div className="flex flex-col items-center rounded-2xl border border-white/[0.10] p-12 text-center" style={{ background: "#13131c" }}>
                <BookOpen className="h-6 w-6 animate-pulse text-slate-600 mb-3" />
                <p className="text-sm text-slate-500">Loading courses…</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-white/[0.10] p-12 text-center" style={{ background: "#13131c" }}>
                <BookOpen className="h-6 w-6 text-slate-600 mb-3" />
                <h3 className="text-sm font-semibold text-white">No courses yet</h3>
                <p className="mt-1 text-xs text-slate-500">Courses will appear here once added.</p>
              </div>
            ) : (
              courses.map((course, i) => (
                <motion.article key={course.id} custom={i + 3} initial="hidden" animate="show" variants={fadeUp}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/[0.10] p-4 transition-colors hover:border-white/[0.18] md:flex-row md:items-center md:p-5"
                  style={{ background: "#13131c" }}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                      <Film className="h-5 w-5 text-violet-400" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-white">{course.title}</h3>
                      {course.description && (
                        <p className="mt-0.5 truncate text-xs text-slate-500">{course.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    {course.price != null && (
                      <div className="hidden flex-col items-end md:flex">
                        <span className="text-[10px] uppercase tracking-wider text-slate-600">Price</span>
                        <span className="flex items-center gap-0.5 text-sm font-semibold text-white">
                          <IndianRupee className="h-3.5 w-3.5" strokeWidth={2.5} />
                          {Number(course.price).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(course.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/5 text-red-400 transition hover:border-red-500/20 hover:text-red-300 cursor-pointer"
                      aria-label="Delete course"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.article>
              ))
            )}
          </section>

          {!loading && courses.length > 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="mt-8 text-center text-xs text-slate-600"
            >
              {courses.length} course{courses.length !== 1 ? "s" : ""} on your platform
            </motion.p>
          )}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}