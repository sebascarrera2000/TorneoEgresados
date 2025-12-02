import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const CinematicBall = () => (
  <motion.div
    animate={{ y: [-20, 20, -20] }}
    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    className="w-40 h-40 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full shadow-[0_0_40px_#3ba7ff] border-4 border-white flex items-center justify-center"
  >
    <Sparkles size={60} className="text-white" />
  </motion.div>
);
