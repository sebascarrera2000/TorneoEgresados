import { motion, AnimatePresence } from "framer-motion";
import { CinematicBall } from "./CinematicBall";

export const Cinematic = ({
  showCinematic,
  currentCinematicMatch,
  roulettePhase,
  rouletteName,
  currentPairIndex,
  cinematicMatches,
}: any) => (
  <AnimatePresence>
    {showCinematic && currentCinematicMatch && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center text-white z-[9999]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#1d4ed8_0,_transparent_55%),radial-gradient(circle_at_bottom,_#0ea5e9_0,_transparent_55%)] opacity-60" />

        <div className="relative flex flex-col items-center">
          <CinematicBall />

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-3xl font-bold tracking-wide text-center"
          >
            Sorteo de Octavos • Llave {currentPairIndex + 1}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.9 }}
            className="text-sm mt-2 text-slate-200 text-center"
          >
            {roulettePhase === "spinningTeam1" && "Seleccionando equipo 1..."}
            {roulettePhase === "showingTeam1" && "Equipo 1 seleccionado"}
            {roulettePhase === "spinningTeam2" && "Seleccionando equipo 2..."}
            {roulettePhase === "showingTeam2" && "Equipo 2 seleccionado"}
            {roulettePhase === "showingPair" && "Emparejamiento confirmado"}
          </motion.p>

          <motion.div
            key={rouletteName}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-8 px-10 py-4 rounded-full border border-blue-400/60 bg-slate-900/60 shadow-[0_0_30px_rgba(59,130,246,0.7)] text-2xl font-extrabold tracking-wide"
          >
            {rouletteName}
          </motion.div>

          {roulettePhase === "showingPair" && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-6">
                <div className="px-6 py-3 rounded-xl bg-slate-900/80 border border-blue-500/70 shadow-[0_0_35px_rgba(37,99,235,0.9)]">
                  <p className="text-xs uppercase tracking-widest text-blue-300 mb-1 text-center">
                    Equipo 1
                  </p>
                  <p className="text-xl font-bold text-center">
                    {currentCinematicMatch.equipo1.nombre}
                  </p>
                </div>

                <span className="text-2xl font-extrabold text-blue-300">VS</span>

                <div className="px-6 py-3 rounded-xl bg-slate-900/80 border border-cyan-400/70 shadow-[0_0_35px_rgba(34,211,238,0.9)]">
                  <p className="text-xs uppercase tracking-widest text-cyan-300 mb-1 text-center">
                    Equipo 2
                  </p>
                  <p className="text-xl font-bold text-center">
                    {currentCinematicMatch.equipo2.nombre}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-2">
                Llave {currentPairIndex + 1} de {cinematicMatches.length}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
