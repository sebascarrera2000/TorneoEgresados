import { motion } from "framer-motion";
import { Match } from "../hooks/useTournamentLogic";
import { MatchCard } from "./MatchCard";
import { Placeholder } from "./Placeholder";

export const Column = ({ title, matches }: { title: string; matches: Match[] }) => (
  <div className="flex flex-col items-center space-y-6">
    <motion.h2
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-full text-xs font-bold shadow-md tracking-wide uppercase"
    >
      {title}
    </motion.h2>

    {matches.length > 0
      ? matches.map((m) => <MatchCard key={m.id} match={m} />)
      : [...Array(title === "FINAL" ? 1 : 2)].map((_, i) => <Placeholder key={i} />)}
  </div>
);
