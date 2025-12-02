import { useEffect, useState } from "react";

export interface Team {
  id: string;
  nombre: string;
}

export interface Match {
  id: string;
  partidoEtapa: string;
  equipo1: Team;
  equipo2: Team;
  score1: number;
  score2: number;
  fecha: string;
  pasaSemi: string | null;
}

export type RoulettePhase =
  | "idle"
  | "spinningTeam1"
  | "showingTeam1"
  | "spinningTeam2"
  | "showingTeam2"
  | "showingPair";

export const useTournamentLogic = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const ADMIN_USER = "admin";
  const ADMIN_PASS = "unimar2025";

  const [showCinematic, setShowCinematic] = useState(false);
  const [cinematicMatches, setCinematicMatches] = useState<Match[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [roulettePhase, setRoulettePhase] = useState<RoulettePhase>("idle");
  const [rouletteName, setRouletteName] = useState("");

  // ----------------------------------------
  // Cargar torneo
  // ----------------------------------------
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

  useEffect(() => {
    fetchTournament();
  }, []);

  // ----------------------------------------
  // COMBO SECRETO: SHIFT + A -> SHIFT + B
  // ----------------------------------------
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

  // ----------------------------------------
  // Autenticación admin
  // ----------------------------------------
  const authenticate = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setShowLogin(false);
      setShowPanel(true);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  // ----------------------------------------
  // Generar octavos
  // ----------------------------------------
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
      alert("Error generando partidos");
    }
  };

  return {
    matches,
    loading,

    showLogin,
    setShowLogin,
    showPanel,
    setShowPanel,

    user,
    setUser,
    pass,
    setPass,

    authenticate,

    showCinematic,
    setShowCinematic,
    cinematicMatches,
    currentPairIndex,
    setCurrentPairIndex,
    roulettePhase,
    setRoulettePhase,
    rouletteName,
    setRouletteName,

    generarOctavos,
  };
};
