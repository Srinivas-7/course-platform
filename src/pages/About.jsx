import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-900 text-white min-h-screen flex flex-col"
    >
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN ABOUT SECTION */}
      <div className="flex-grow flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-8">
            Helping creators master video editing
          </h1>

          <p className="text-gray-400 text-lg mb-10">
            Vijayanagara Edits teaches creators how to become professional
            video editors using tools like Premiere Pro and CapCut. From
            social media content to client projects, our goal is to help
            creators turn editing skills into real careers.
          </p>

          <p className="text-gray-500 mb-10">
            With over 54K followers and 300+ posts, we've worked on brand
            collaborations, paid promotions, and editing projects that
            help creators grow their presence online.
          </p>

        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </motion.div>
  );
}