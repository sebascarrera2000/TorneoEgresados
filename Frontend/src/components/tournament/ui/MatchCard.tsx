import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Match } from "../hooks/useTournamentLogic";

export const MatchCard = ({ match }: { match: Match }) => {
  const winner1 = match.score1 > match.score2;
  const winner2 = match.score2 > match.score1;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("es-CO", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "Fecha pendiente";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: 3 }}
      transition={{ duration: 0.4 }}
      className="bg-white/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200 p-4 min-w-[230px] relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-80" />

      <div className="text-xs mb-2 font-bold text-blue-700 uppercase tracking-wide">
        {match.partidoEtapa}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
        <Calendar size={14} className="text-blue-500" />
        {formatDate(match.fecha)}
      </div>

      <div
        className={`flex justify-between items-center p-2 rounded-lg mb-2 ${
          winner1 ? "bg-blue-50 border border-blue-300" : "bg-gray-50"
        }`}
      >
        <span className="font-semibold text-gray-800 text-sm">{match.equipo1?.nombre}</span>
        <span className={`font-bold text-sm ${winner1 ? "text-blue-600" : "text-gray-600"}`}>
          {match.score1}
        </span>
      </div>

      <div
        className={`flex justify-between items-center p-2 rounded-lg ${
          winner2 ? "bg-blue-50 border border-blue-300" : "bg-gray-50"
        }`}
      >
        <span className="font-semibold text-gray-800 text-sm">{match.equipo2?.nombre}</span>
        <span className={`font-bold text-sm ${winner2 ? "text-blue-600" : "text-gray-600"}`}>
          {match.score2}
        </span>
      </div>
    </motion.div>
  );
};
