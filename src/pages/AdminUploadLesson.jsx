import { useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function AdminUploadLesson() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [position, setPosition] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadVideo = async () => {
    if (!file || !title || !courseId || !position) {
      alert("Please fill in all fields and select a video file");
      return;
    }

    setUploading(true);
    setProgress(0);

    const filePath = `${courseId}/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("course-videos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error(error);
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    // Save lesson in database
    const { error: dbError } = await supabase.from("lessons").insert({
      title: title,
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
    setProgress(100);
    setUploading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-gray-900 min-h-screen">
        <Navbar />

        <div className="relative isolate px-6 pt-46 pb-20 lg:px-8">

          {/* TOP GRADIENT BLOB */}
          <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
          </div>

          <div className="mx-auto max-w-xl">

            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Upload Lesson</h1>
                <p className="text-gray-400">Add a new video lesson to a course</p>
              </div>
              <Link to="/admin" className="text-sm text-gray-400 hover:text-white transition">
                ← Back to Admin
              </Link>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 flex flex-col gap-6">

              {/* COURSE ID */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full rounded-xl bg-gray-700 border border-gray-600 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a course</option>
                  <option value="capcut">CapCut Content Editing</option>
                  <option value="premiere_pro">Premiere Pro Editing Mastery</option>
                </select>
              </div>

              {/* LESSON TITLE */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Lesson Title</label>
                <input
                  type="text"
                  value={title}
                  placeholder="e.g. Introduction to CapCut"
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-gray-700 border border-gray-600 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* POSITION */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Lesson Number</label>
                <input
                  type="number"
                  value={position}
                  placeholder="e.g. 1"
                  min="1"
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full rounded-xl bg-gray-700 border border-gray-600 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* FILE UPLOAD */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Video File</label>
                <div className="w-full rounded-xl bg-gray-700 border border-dashed border-gray-500 px-4 py-8 text-center cursor-pointer hover:border-purple-500 transition"
                  onClick={() => document.getElementById("video-input").click()}
                >
                  {file ? (
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-400">Click to select video file</p>
                      <p className="text-gray-500 text-sm mt-1">MP4, MOV, AVI supported</p>
                    </div>
                  )}
                  <input
                    id="video-input"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              </div>

              {/* PROGRESS BAR */}
              {uploading && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* UPLOAD BUTTON */}
              <button
                onClick={uploadVideo}
                disabled={uploading}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
              >
                {uploading ? "Uploading..." : "Upload Lesson"}
              </button>

            </div>
          </div>

          {/* BOTTOM GRADIENT BLOB */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
            <div className="relative left-1/2 aspect-[1155/678] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" />
          </div>

        </div>

      </div>
        <Footer />
    </motion.div>
  );
}