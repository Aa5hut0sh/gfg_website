
import { motion } from "motion/react";
import TeamMemberList from "./Team";

export default function TeamContent() {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-4 mt-25">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Nothing great is{" "}
          <span className="bg-yellow-300 px-2 py-1 text-black rounded-md">
            made
          </span>{" "}
          alone.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-4"
      >
        <div className="relative overflow-hidden bg-transparent border-1 border-green-300 text-white font-semibold py-3 px-6 rounded-lg cursor-default select-none group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-green-400/10 animate-pulse"></div>
          <span className="relative z-10">Meet Our Core Team</span>
        </div>
      </motion.div>

      <TeamMemberList/>
    </div>
  );
}
