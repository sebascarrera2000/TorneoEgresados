import { useEffect, useState } from "react";
import { Trophy, Calendar, Sparkles, KeyRound, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Team {
  id: string;
  nombre: string;
}

interface Match {
  id: string;
  partidoEtapa: string;
  equipo1: Team;
  equipo2: Team;
  score1: number;
  score2: number;
  fecha: string;
  pasaSemi: string | null;
}

type RoulettePhase =
  | "idle"
  | "spinningTeam1"
  | "showingTeam1"
  | "spinningTeam2"
  | "showingTeam2"
  | "showingPair";

const TournamentBracket = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const ADMIN_USER = "admin";
  const ADMIN_PASS = "unimar2025";

  // Cinematic
  const [showCinematic, setShowCinematic] = useState(false);
  const [cinematicMatches, setCinematicMatches] = useState<Match[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [roulettePhase, setRoulettePhase] = useState<RoulettePhase>("idle");
  const [rouletteName, setRouletteName] = useState("");

  useEffect(() => {
    fetchTournament();
  }, []);

  const fetchTournament = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/tournament/partidosfutsal");
      const data = await response.json();

      if (data.ok && Array.isArray(data.partidos)) {
        setMatches(data.partidos);
      } else {
        setMatches([]);
      }
    } catch (err) {
      console.error("Error cargando torneo:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const getMatches = (stage: string) =>
    matches.filter((m) => m.partidoEtapa?.toUpperCase() === stage.toUpperCase());

  const octavos = getMatches("OCTAVOS");
  const octavosLeft = octavos.slice(0, 4);
  const octavosRight = octavos.slice(4, 8);

  const cuartos = getMatches("CUARTOS");
  const semi = getMatches("SEMIFINAL");
  const final = getMatches("FINAL");

  const Placeholder = () => (
    <div className="bg-white/40 backdrop-blur-md p-4 rounded-xl border border-gray-200 text-center text-gray-400 text-sm shadow-md w-[230px] animate-pulse">
      Pendiente
    </div>
  );

  const MatchCard = ({ match }: { match: Match }) => {
    const winner1 = match.score1 > match.score2;
    const winner2 = match.score2 > match.score1;

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

  const Column = ({ title, matches }: { title: string; matches: Match[] }) => (
    <div className="flex flex-col items-center space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 
                   rounded-full text-xs font-bold shadow-md tracking-wide uppercase"
      >
        {title}
      </motion.h2>
      {matches.length > 0
        ? matches.map((m) => <MatchCard key={m.id} match={m} />)
        : [...Array(title === "FINAL" ? 1 : 2)].map((_, i) => <Placeholder key={i} />)}
    </div>
  );

  // -------- ADMIN SECRET COMBO (SHIFT + A luego SHIFT + B) ----------
  useEffect(() => {
    const listenerA = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "a") {
        const listenerB = (ev: KeyboardEvent) => {
          if (ev.shiftKey && ev.key.toLowerCase() === "b") {
            setShowLogin(true);
          }
        };
        window.addEventListener("keydown", listenerB, { once: true });
      }
    };
    window.addEventListener("keydown", listenerA);
    return () => window.removeEventListener("keydown", listenerA);
  }, []);

  const authenticate = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setShowLogin(false);
      setShowPanel(true);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const generarOctavos = async () => {
    try {
      setShowPanel(false);

      const res = await fetch("http://localhost:4000/api/tournament/generarpartidosfutsal", {
        method: "POST",
      });
      const data = await res.json();

      if (data.ok && Array.isArray(data.partidos)) {
        setCinematicMatches(data.partidos);
        setCurrentPairIndex(0);
        setRoulettePhase("spinningTeam1");
        setShowCinematic(true);
      } else {
        alert("No se pudieron generar los partidos");
      }
    } catch (err) {
      console.error(err);
      alert("Error generando los partidos");
    }
  };

  // -------- CINEMÁTICA: RULETA + REVELACIÓN LLAVES ----------
  useEffect(() => {
    if (!showCinematic || !cinematicMatches.length) return;

    const allTeams = cinematicMatches
      .flatMap((m) => [m.equipo1?.nombre, m.equipo2?.nombre])
      .filter(Boolean) as string[];

    const currentMatch = cinematicMatches[currentPairIndex];
    if (!currentMatch) return;

    let intervalId: number | null = null;
    let timeoutId: number | null = null;

    const startSpin = (target: string, nextPhase: RoulettePhase, duration = 2500) => {
      let idx = 0;
      intervalId = window.setInterval(() => {
        setRouletteName(allTeams[idx % allTeams.length]);
        idx++;
      }, 80);

      timeoutId = window.setTimeout(() => {
        if (intervalId !== null) window.clearInterval(intervalId);
        setRouletteName(target);
        setRoulettePhase(nextPhase);
      }, duration);
    };

    if (roulettePhase === "spinningTeam1") {
      startSpin(currentMatch.equipo1.nombre, "showingTeam1");
    }

    if (roulettePhase === "showingTeam1") {
      timeoutId = window.setTimeout(() => {
        setRoulettePhase("spinningTeam2");
      }, 1500);
    }

    if (roulettePhase === "spinningTeam2") {
      startSpin(currentMatch.equipo2.nombre, "showingTeam2");
    }

    if (roulettePhase === "showingTeam2") {
      timeoutId = window.setTimeout(() => {
        setRoulettePhase("showingPair");
      }, 1500);
    }

    if (roulettePhase === "showingPair") {
      timeoutId = window.setTimeout(() => {
        if (currentPairIndex < cinematicMatches.length - 1) {
          setCurrentPairIndex((prev) => prev + 1);
          setRoulettePhase("spinningTeam1");
        } else {
          setShowCinematic(false);
          setRoulettePhase("idle");
          setMatches(cinematicMatches);
          fetchTournament();
        }
      }, 2200);
    }

    return () => {
      if (intervalId !== null) window.clearInterval(intervalId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [showCinematic, roulettePhase, currentPairIndex, cinematicMatches]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg animate-pulse">
        Cargando brackets…
      </div>
    );
  }

  const cinematicBall = (
    <motion.div
      animate={{ y: [-20, 20, -20] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      className="w-40 h-40 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full shadow-[0_0_40px_#3ba7ff] border-4 border-white flex items-center justify-center"
    >
      <Sparkles size={60} className="text-white" />
    </motion.div>
  );

  const currentCinematicMatch = cinematicMatches[currentPairIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbe8ff] via-[#f3f6ff] to-[#ffffff] py-10 px-4">
      {/* HEADER */}
      <div className="text-center mb-12">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 8 }}
          className="inline-flex items-center justify-center w-20 h-20 
                     bg-gradient-to-br from-blue-500 to-blue-800 rounded-full mb-3 shadow-xl"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-sm">
          Torneo de Microfútbol
        </h1>
        <p className="text-gray-600 mt-1 tracking-wide">Brackets del Torneo</p>
      </div>

      {/* BRACKETS LAYOUT ORIGINAL */}
      <div className="flex justify-center gap-12 px-6 overflow-x-auto pb-10">
        <Column title="OCTAVOS" matches={octavosLeft} />
        <Column title="CUARTOS" matches={cuartos.slice(0, 2)} />
        <Column title="SEMIFINAL" matches={semi.slice(0, 1)} />
        <Column title="FINAL" matches={final} />
        <Column title="SEMIFINAL" matches={semi.slice(1, 2)} />
        <Column title="CUARTOS" matches={cuartos.slice(2, 4)} />
        <Column title="OCTAVOS" matches={octavosRight} />
      </div>

      {/* LOGIN ADMIN */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white shadow-xl rounded-xl p-6 w-80 border border-gray-200"
            >
              <div className="flex justify-center mb-3">
                <ShieldCheck className="text-blue-600" size={46} />
              </div>
              <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
                Admin Access
              </h2>

              <label className="text-sm font-semibold">Usuario</label>
              <input
                className="w-full mt-1 mb-2 p-2 border rounded-md"
                onChange={(e) => setUser(e.target.value)}
              />

              <label className="text-sm font-semibold">Contraseña</label>
              <input
                type="password"
                className="w-full mt-1 mb-4 p-2 border rounded-md"
                onChange={(e) => setPass(e.target.value)}
              />

              <button
                onClick={authenticate}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <KeyRound size={18} /> Ingresar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANEL ADMIN */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ x: 200 }}
            animate={{ x: 0 }}
            exit={{ x: 200 }}
            className="fixed top-5 right-5 bg-white border shadow-xl rounded-lg p-4 w-72 z-[999]"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Panel de Administración
            </h3>

            <button
              onClick={generarOctavos}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-bold shadow-lg hover:scale-[1.02] transition-all"
            >
              Generar Octavos Automáticamente
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CINEMÁTICA: RULETA + PRESENTACIÓN DE LLAVES */}
      <AnimatePresence>
        {showCinematic && currentCinematicMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] flex flex-col items-center justify-center text-white z-[9999]"
          >
            {/* Fondo de estrellas suaves */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#1d4ed8_0,_transparent_55%),radial-gradient(circle_at_bottom,_#0ea5e9_0,_transparent_55%)] opacity-60" />

            <div className="relative flex flex-col items-center">
              {cinematicBall}

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

              {/* Nombre en ruleta */}
              <motion.div
                key={rouletteName}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-8 px-10 py-4 rounded-full border border-blue-400/60 bg-slate-900/60 shadow-[0_0_30px_rgba(59,130,246,0.7)] text-2xl font-extrabold tracking-wide"
              >
                {rouletteName}
              </motion.div>

              {/* Presentación cinematográfica de la llave */}
              {roulettePhase === "showingPair" && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 flex flex-col items-center gap-4"
                >
                  <motion.div
                    className="flex items-center gap-6"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                  >
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
                  </motion.div>

                  <p className="text-xs text-slate-300 mt-2">
                    Llave {currentPairIndex + 1} de {cinematicMatches.length}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TournamentBracket;
