import { StarIcon } from "@heroicons/react/20/solid"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const courses = [
  {
    id: "capcut",
    name: "CapCut Content Editing",
    reviews: { average: 5, totalCount: 310 },
    description:
      "Learn how to create viral Instagram reels and short-form content using CapCut editing techniques.",
    highlights: [
      "Viral reels editing workflow",
      "Subtitle animations",
      "Trending transitions",
      "Short-form storytelling",
    ],
    details:
      "Perfect for creators who want to edit viral short-form videos quickly using CapCut mobile editing workflows.",
  },
  {
    id: "premiere_pro",
    name: "Premiere Pro Editing Mastery",
    reviews: { average: 5, totalCount: 420 },
    description:
      "Learn professional video editing using Adobe Premiere Pro. Master cinematic transitions, storytelling, color grading and professional editing workflows.",
    highlights: [
      "Professional Premiere Pro workflow",
      "Cinematic transitions",
      "Color grading techniques",
      "Real client editing projects",
    ],
    details:
      "This course teaches everything from beginner editing to advanced cinematic editing techniques used by professional editors.",
  },
]

export default function MyCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("purchases")
        .select("course_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setPurchases(data.map(p => p.course_id));
      }

      setLoading(false);
    };

    fetchPurchases();
  }, [user]);

  const purchasedCourses = courses.filter(course =>
    purchases.includes(course.id)
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      Loading...
    </div>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-1 pt-40 pb-20">

        {purchasedCourses.length === 0 ? (

          // ✅ No purchases — show empty state
          <div className="flex flex-col items-center justify-center h-full py-32 text-center px-6">
            <div className="text-6xl mb-6">🎬</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              No courses yet
            </h2>
            <p className="text-gray-400 mb-8 max-w-md">
              You haven't purchased any courses yet. Browse our courses and start your video editing journey!
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-lg font-semibold transition cursor-pointer"
            >
              Browse Courses
            </button>
          </div>

        ) : (

          // ✅ Show only purchased courses
          <div className="space-y-28">
            {purchasedCourses.map((course, index) => (
              <div key={index} className="mx-auto max-w-7xl px-6">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

                  {/* LEFT CONTENT */}
                  <div>
                    <h1 className="text-4xl font-bold mb-4">
                      {course.name}
                    </h1>

                    <div className="flex items-center mb-6">
                      <div className="flex">
                        {[0,1,2,3,4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={classNames(
                              course.reviews.average > rating
                                ? "text-yellow-400"
                                : "text-gray-600",
                              "h-5 w-5"
                            )}
                          />
                        ))}
                      </div>
                      <p className="ml-3 text-sm text-gray-400">
                        {course.reviews.totalCount} students
                      </p>
                    </div>

                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {course.description}
                    </p>

                    <button className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-lg font-semibold transition cursor-pointer">
                      Continue Course
                    </button>

                    <div className="mt-10">
                      <h3 className="font-semibold mb-3">What you'll learn</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-400">
                        {course.highlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* RIGHT IMAGE */}
                  <div className="mt-10 lg:mt-0">
                    <div className="bg-gray-800 rounded-xl h-[420px] flex items-center justify-center text-gray-400">
                      Upload Course Image
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        )}

      </main>

      <Footer />

    </div>
  )
}