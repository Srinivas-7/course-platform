import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function LessonPlayer() {
    const { courseId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState([]);

    useEffect(() => {
        const fetchLessons = async () => {
            // Check if user purchased this course
            const { data: purchase } = await supabase
                .from("purchases")
                .select("id")
                .eq("user_id", user.id)
                .eq("course_id", courseId)
                .single();

            if (!purchase) {
                navigate("/mycourses");
                return;
            }

            // Fetch lessons
            const { data: lessonsData } = await supabase
                .from("lessons")
                .select("*")
                .eq("course_id", courseId)
                .order("position", { ascending: true });
            console.log("lessons data:", lessonsData);  // ← add this
            console.log("lessons error:", lessonsError); // ← add this
            setLessons(lessonsData || []);

            // Fetch completed lessons
            const { data: progress } = await supabase
                .from("progress")
                .select("lesson_id")
                .eq("user_id", user.id)
                .eq("course_id", courseId);

            setCompletedLessons(progress?.map(p => p.lesson_id) || []);

            // Auto play first lesson
            if (lessonsData?.length > 0) {
                await playLesson(lessonsData[0]);
            }

            setLoading(false);
        };

        fetchLessons();
    }, [courseId, user]);

    const playLesson = async (lesson) => {
        setCurrentLesson(lesson);
        setVideoUrl(null);

        // Generate signed URL (10 minutes)
        const { data } = await supabase.storage
            .from("course-videos")
            .createSignedUrl(lesson.video_url, 600);
        console.log("signed URL data:", data);
        console.log("signed URL error:", error);
        if (data?.signedUrl) {
            setVideoUrl(data.signedUrl);
        }
    };

    const markComplete = async (lessonId) => {
        if (completedLessons.includes(lessonId)) return;

        await supabase.from("progress").insert({
            user_id: user.id,
            course_id: courseId,
            lesson_id: lessonId,
        });

        setCompletedLessons([...completedLessons, lessonId]);
    };

    const playNext = () => {
        const currentIndex = lessons.findIndex(l => l.id === currentLesson?.id);
        if (currentIndex < lessons.length - 1) {
            playLesson(lessons[currentIndex + 1]);
        }
    };

    const playPrev = () => {
        const currentIndex = lessons.findIndex(l => l.id === currentLesson?.id);
        if (currentIndex > 0) {
            playLesson(lessons[currentIndex - 1]);
        }
    };

    const progressPercent = lessons.length > 0
        ? Math.round((completedLessons.length / lessons.length) * 100)
        : 0;

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            Loading...
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-gray-900 min-h-screen flex flex-col">
                <Navbar />

                <div className="flex flex-1 pt-24">

                    {/* LEFT - Lesson List */}
                    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col overflow-y-auto">

                        {/* Course header */}
                        <div className="p-5 border-b border-gray-700">
                            <button
                                onClick={() => navigate("/mycourses")}
                                className="text-gray-400 hover:text-white text-sm transition mb-3 flex items-center gap-1"
                            >
                                ← Back to My Courses
                            </button>
                            <h2 className="text-white font-bold text-lg leading-tight">
                                {courseId === "capcut" ? "CapCut Content Editing" : "Premiere Pro Editing Mastery"}
                            </h2>

                            {/* Progress bar */}
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>{completedLessons.length}/{lessons.length} lessons</span>
                                    <span>{progressPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-1.5">
                                    <div
                                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Lessons list */}
                        <div className="flex-1 overflow-y-auto">
                            {lessons.length === 0 ? (
                                <div className="p-6 text-center text-gray-400 text-sm">
                                    No lessons available yet
                                </div>
                            ) : (
                                lessons.map((lesson, index) => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => playLesson(lesson)}
                                        className={`w-full text-left px-5 py-4 border-b border-gray-700 transition flex items-start gap-3 ${currentLesson?.id === lesson.id
                                            ? "bg-purple-900/30 border-l-2 border-l-purple-500"
                                            : "hover:bg-gray-700"
                                            }`}
                                    >
                                        {/* Lesson number / check */}
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${completedLessons.includes(lesson.id)
                                            ? "bg-green-500 text-white"
                                            : currentLesson?.id === lesson.id
                                                ? "bg-purple-600 text-white"
                                                : "bg-gray-700 text-gray-400"
                                            }`}>
                                            {completedLessons.includes(lesson.id) ? "✓" : index + 1}
                                        </div>

                                        <div>
                                            <p className={`text-sm font-medium ${currentLesson?.id === lesson.id ? "text-purple-400" : "text-gray-200"
                                                }`}>
                                                {lesson.title}
                                            </p>
                                            {completedLessons.includes(lesson.id) && (
                                                <p className="text-xs text-green-400 mt-0.5">Completed</p>
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>

                    </div>

                    {/* RIGHT - Video Player */}
                    <div className="flex-1 flex flex-col">

                        {/* Video area */}
                        <div className="bg-black aspect-video w-full">
                            {videoUrl ? (
                                <video
                                    key={videoUrl}
                                    src={videoUrl}
                                    controls
                                    autoPlay
                                    className="w-full h-full"
                                    onEnded={() => {
                                        if (currentLesson) markComplete(currentLesson.id);
                                        playNext();
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    {currentLesson ? "Loading video..." : "Select a lesson to start"}
                                </div>
                            )}
                        </div>

                        {/* Lesson info + controls */}
                        <div className="p-6 bg-gray-900 border-t border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-white text-xl font-bold">
                                    {currentLesson?.title || "Select a lesson"}
                                </h1>

                                {/* Mark complete button */}
                                {currentLesson && !completedLessons.includes(currentLesson.id) && (
                                    <button
                                        onClick={() => markComplete(currentLesson.id)}
                                        className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-lg transition cursor-pointer"
                                    >
                                        Mark as Complete
                                    </button>
                                )}
                                {currentLesson && completedLessons.includes(currentLesson.id) && (
                                    <span className="text-green-400 text-sm font-medium">
                                        ✓ Completed
                                    </span>
                                )}
                            </div>

                            {/* Prev / Next buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={playPrev}
                                    disabled={lessons.findIndex(l => l.id === currentLesson?.id) === 0}
                                    className="bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white text-sm px-5 py-2 rounded-lg transition cursor-pointer border border-gray-700"
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={playNext}
                                    disabled={lessons.findIndex(l => l.id === currentLesson?.id) === lessons.length - 1}
                                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-sm px-5 py-2 rounded-lg transition cursor-pointer"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
}