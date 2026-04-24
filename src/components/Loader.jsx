import { motion } from "framer-motion";

export default function Loader() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <motion.div
                className="w-20 h-20 bg-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.7)]"
                animate={{
                    borderRadius: [
                        "20% 80% 30% 70% / 30% 30% 70% 70%",
                        "80% 20% 70% 30% / 50% 60% 40% 50%",
                        "30% 70% 50% 50% / 60% 30% 70% 40%",
                        "20% 80% 30% 70% / 30% 30% 70% 70%",
                    ],
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}