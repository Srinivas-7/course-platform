import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from("courses").select("*");
      setCourses(data || []);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    await supabase.from("courses").delete().eq("id", id);
    setCourses(courses.filter(c => c.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-gray-900 min-h-screen flex flex-col">
        <Navbar />

        <div className="relative isolate px-6 pt-46 pb-20 lg:px-8">

          <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
          </div>

          <div className="mx-auto max-w-5xl">

            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Manage Courses</h1>
                <p className="text-gray-400">Add, edit or delete courses</p>
              </div>
              <Link to="/admin" className="text-sm text-gray-400 hover:text-white transition">
                ← Back to Admin
              </Link>
            </div>

            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : courses.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 text-center">
                <p className="text-gray-400 text-lg mb-4">No courses yet</p>
                <p className="text-gray-500 text-sm">Add courses from the Upload Lesson page</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {courses.map((course) => (
                  <div key={course.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-lg">{course.title}</p>
                      <p className="text-gray-400 text-sm mt-1">{course.description}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-400 hover:text-red-300 border border-red-800 hover:bg-red-900/20 px-4 py-2 rounded-lg text-sm transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>

          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
            <div className="relative left-1/2 aspect-[1155/678] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" />
          </div>

        </div>

      </div>
        <Footer />
    </motion.div>
  );
}