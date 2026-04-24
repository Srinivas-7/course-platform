import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clapperboard,
  CloudUpload,
  Film,
  Hash,
  Layers,
  Sparkles,
  Type,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const tips = [
  { icon: Zap, label: "Keep lessons under 12 min for highest completion" },
  { icon: CheckCircle2, label: "Use clear, action-led titles ('How to…')" },
  { icon: Clapperboard, label: "Upload 1080p MP4 for best quality" },
];

export default function AdminUploadLesson() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [position, setPosition] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [courses, setCourses] = useState([]);

  const completedFields =
    Number(Boolean(courseId)) +
    Number(Boolean(title.trim())) +
    Number(Boolean(position)) +
    Number(Boolean(file));
  const formProgress = (completedFields / 4) * 100;
  const isReady = completedFields === 4;

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from("courses").select("id, title");
      if (data) setCourses(data);
    };
    fetchCourses();
  }, []);

  const handleFile = (f) => {
    if (!f) return;
    if (f.size > 500 * 1024 * 1024) {
      alert("File too large. Max 500MB per video.");
      return;
    }
    setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const uploadVideo = async () => {
    if (!isReady) {
      alert("Please fill in all fields and select a video file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const filePath = `${courseId}/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("course-videos")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error(error);
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("lessons").insert({
      title,
      video_url: filePath,
      course_id: courseId,
      position: parseInt(position),
    });

    if (dbError) {
      console.error(dbError);
      alert("Failed to save lesson: " + dbError.message);
      setUploading(false);
      return;
    }

    alert("Lesson uploaded successfully!");
    setTitle("");
    setCourseId("");
    setPosition("");
    setFile(null);
    setUploadProgress(100);
    setUploading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #0d0a1a 0%, #120d2e 40%, #1a0a2e 70%, #0d0a1a 100%)",
      }}
    >
      <Navbar />

      <main className="relative flex-1 overflow-hidden px-4 py-10 md:px-10 md:py-14 pt-28 md:pt-32">
        {/* Decorative orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full opacity-50 blur-3xl animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(109, 40, 217, 0.55), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full opacity-35 blur-3xl animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent 70%)",
            animationDelay: "1.5s",
          }}
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Header */}
          <motion.header
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mb-8 flex flex-col items-start p-4 justify-between gap-5 md:flex-row md:items-end"
          >
            <div>
              {/* <Link
                to="/admin"
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-purple-400/70 transition-colors hover:text-purple-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link> */}
              {/* <div
                className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur"
                style={{
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  background: "rgba(139, 92, 246, 0.1)",
                }}
              >
                <Sparkles className="h-3 w-3 text-purple-400" />
                New lesson · Step 1 of 1
              </div> */}
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
                Upload a{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #c084fc, #a855f7, #7c3aed)",
                  }}
                >
                  new lesson
                </span>
              </h1>
              <p className="mt-2 max-w-xl text-base text-purple-200/60 md:text-lg">
                Add a video to one of your courses. Your students will see it
                instantly.
              </p>
            </div>

            {/* Progress card */}
            <div
              className="w-full max-w-xs rounded-2xl p-5 md:w-auto backdrop-blur"
              style={{
                background: "rgba(139, 92, 246, 0.08)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-purple-300/70">
                    Form progress
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {completedFields}/4
                  </p>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                  }}
                >
                  <Layers className="h-6 w-6 text-white" strokeWidth={2.2} />
                </div>
              </div>
              <div
                className="mt-4 h-1.5 w-full overflow-hidden rounded-full"
                style={{ background: "rgba(139, 92, 246, 0.15)" }}
              >
                <motion.div
                  animate={{ width: `${formProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #7c3aed, #a855f7)",
                  }}
                />
              </div>
            </div>
          </motion.header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            {/* Form card */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={1}
              className="relative overflow-hidden rounded-3xl p-6 md:p-8 backdrop-blur"
              style={{
                background: "rgba(139, 92, 246, 0.07)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              }}
            >
              <div
                aria-hidden
                className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-25 blur-3xl"
                style={{ background: "rgba(124, 58, 237, 0.8)" }}
              />

              <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Course */}
                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                    <Layers className="h-4 w-4 text-purple-400" /> Course
                  </label>
                  <div className="relative">
                    <select
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      className="h-12 w-full appearance-none rounded-xl px-4 pr-10 text-sm text-white outline-none transition-all"
                      style={{
                        background: "rgba(139, 92, 246, 0.1)",
                        border: "1px solid rgba(139, 92, 246, 0.25)",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "rgba(139, 92, 246, 0.6)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(139, 92, 246, 0.25)")
                      }
                    >
                      <option value="" style={{ background: "#1a0a2e" }}>
                        Select a course
                      </option>
                      {courses.map((course) => (
                        <option
                          key={course.id}
                          value={course.id}
                          style={{ background: "#1a0a2e" }}
                        >
                          {course.title}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                      ▾
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                    <Type className="h-4 w-4 text-purple-400" /> Lesson title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Introduction to CapCut"
                    maxLength={120}
                    className="h-12 w-full rounded-xl px-4 text-sm text-white placeholder:text-purple-300/30 outline-none transition-all"
                    style={{
                      background: "rgba(139, 92, 246, 0.1)",
                      border: "1px solid rgba(139, 92, 246, 0.25)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(139, 92, 246, 0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(139, 92, 246, 0.25)")
                    }
                  />
                  <p className="mt-1.5 text-xs text-purple-300/50">
                    {title.length}/120 · clear titles get 2× more clicks
                  </p>
                </div>

                {/* Lesson number */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                    <Hash className="h-4 w-4 text-purple-400" /> Lesson number
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. 1"
                    className="h-12 w-full rounded-xl px-4 text-sm text-white placeholder:text-purple-300/30 outline-none transition-all"
                    style={{
                      background: "rgba(139, 92, 246, 0.1)",
                      border: "1px solid rgba(139, 92, 246, 0.25)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(139, 92, 246, 0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(139, 92, 246, 0.25)")
                    }
                  />
                  <p className="mt-1.5 text-xs text-purple-300/50">
                    Defines order inside the course
                  </p>
                </div>

                {/* Video drop zone */}
                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                    <Film className="h-4 w-4 text-purple-400" /> Video file
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all"
                    style={{
                      borderColor: isDragging
                        ? "rgba(139, 92, 246, 0.8)"
                        : file
                        ? "rgba(34, 197, 94, 0.5)"
                        : "rgba(139, 92, 246, 0.3)",
                      background: isDragging
                        ? "rgba(139, 92, 246, 0.15)"
                        : file
                        ? "rgba(34, 197, 94, 0.05)"
                        : "rgba(139, 92, 246, 0.05)",
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      id="video-input"
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-msvideo,video/*"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                    />

                    {file ? (
                      <>
                        <div
                          className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                          style={{
                            background:
                              "linear-gradient(135deg, #16a34a, #22c55e)",
                          }}
                        >
                          <CheckCircle2
                            className="h-7 w-7 text-white"
                            strokeWidth={2.2}
                          />
                        </div>
                        <p className="text-lg font-bold text-white">
                          {file.name}
                        </p>
                        <p className="mt-1 text-xs text-purple-300/60">
                          {(file.size / (1024 * 1024)).toFixed(1)} MB · ready
                          to upload
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                          className="mt-3 text-xs font-semibold text-purple-400 hover:underline"
                        >
                          Choose a different file
                        </button>
                      </>
                    ) : (
                      <>
                        <div
                          className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-transform group-hover:scale-110"
                          style={{
                            background:
                              "linear-gradient(135deg, #7c3aed, #9333ea)",
                          }}
                        >
                          <CloudUpload
                            className="h-7 w-7 text-white"
                            strokeWidth={2.2}
                          />
                        </div>
                        <p className="text-lg font-bold text-white">
                          Drop your video here, or click to browse
                        </p>
                        <p className="mt-1 text-xs text-purple-300/50">
                          MP4, MOV or AVI · up to 500MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload progress bar */}
              {uploading && (
                <div className="relative mt-6">
                  <div
                    className="h-2 w-full overflow-hidden rounded-full"
                    style={{ background: "rgba(139, 92, 246, 0.15)" }}
                  >
                    <motion.div
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #7c3aed, #a855f7)",
                      }}
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-purple-300/60">
                    Uploading…
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="relative mt-8 flex flex-col-reverse items-stretch justify-between gap-3 md:flex-row md:items-center">
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-purple-300/70 transition-colors hover:text-white"
                  style={{
                    border: "1px solid rgba(139, 92, 246, 0.25)",
                    background: "rgba(139, 92, 246, 0.08)",
                  }}
                >
                  Cancel
                </Link>

                <motion.button
                  type="button"
                  onClick={uploadVideo}
                  whileHover={isReady && !uploading ? { scale: 1.02 } : undefined}
                  whileTap={isReady && !uploading ? { scale: 0.98 } : undefined}
                  disabled={!isReady || uploading}
                  className="group relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-4 font-semibold text-white transition-all md:flex-none md:px-8 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                    boxShadow: isReady
                      ? "0 0 24px rgba(124, 58, 237, 0.5)"
                      : "none",
                  }}
                >
                  <CloudUpload className="h-5 w-5" strokeWidth={2.5} />
                  <span>
                    {uploading
                      ? "Uploading..."
                      : isReady
                      ? "Publish lesson now"
                      : "Complete the form"}
                  </span>
                  <Sparkles className="h-4 w-4 opacity-80" />
                </motion.button>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={2}
              className="space-y-5"
            >
              {/* Tips card */}
              <div
                className="relative overflow-hidden rounded-3xl p-6 backdrop-blur"
                style={{
                  background: "rgba(139, 92, 246, 0.08)",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                }}
              >
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl"
                  style={{ background: "rgba(168, 85, 247, 0.6)" }}
                />
                <div
                  className="relative flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #9333ea)",
                  }}
                >
                  <Sparkles className="h-6 w-6 text-white" strokeWidth={2.2} />
                </div>
                <h3 className="relative mt-4 text-xl font-bold text-white">
                  Tips for high-converting lessons
                </h3>
                <ul className="relative mt-4 space-y-3">
                  {tips.map((tip) => {
                    const Icon = tip.icon;
                    return (
                      <li
                        key={tip.label}
                        className="flex items-start gap-3 text-sm text-purple-200/60"
                      >
                        <span
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-purple-400"
                          style={{ background: "rgba(139, 92, 246, 0.15)" }}
                        >
                          <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                        <span>{tip.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Did you know card */}
              <div
                className="relative overflow-hidden rounded-3xl p-6 text-white"
                style={{
                  background: "linear-gradient(135deg, #6d28d9, #7c3aed, #9333ea)",
                  boxShadow: "0 8px 32px rgba(109, 40, 217, 0.4)",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 20%, white, transparent 40%), radial-gradient(circle at 80% 60%, white, transparent 40%)",
                  }}
                />
                <p className="relative text-xs font-semibold uppercase tracking-wider opacity-80">
                  Did you know?
                </p>
                <p className="relative mt-2 text-2xl font-bold leading-snug">
                  Courses with weekly uploads earn{" "}
                  <span className="underline decoration-white/40 underline-offset-4">
                    3.4× more
                  </span>{" "}
                  revenue.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}