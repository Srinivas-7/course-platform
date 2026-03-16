import { StarIcon } from "@heroicons/react/20/solid"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const courses = [
  {
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
  {
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
]

export default function MyCourses() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 pt-38 pb-20 space-y-28">

        {courses.map((course, index) => (

          <div key={index} className="mx-auto max-w-7xl px-6">

            {/* COURSE SECTION */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

              {/* LEFT CONTENT */}

              <div>

                <h1 className="text-4xl font-bold mb-4">
                  {course.name}
                </h1>

                {/* REVIEWS */}

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

                <button className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-lg font-semibold transition">
                  Continue Course
                </button>

                {/* DETAILS */}

                <div className="mt-10">
                  <h3 className="font-semibold mb-3">
                    What you'll learn
                  </h3>

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

      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  )
}