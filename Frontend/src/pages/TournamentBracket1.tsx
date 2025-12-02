import { Trophy } from "lucide-react";
import { Column } from "../components/tournament/ui/Column";
import { AdminLogin } from "../components/tournament/ui/AdminLogin";
import { AdminPanel } from "../components/tournament/ui/AdminPanel";
import { Cinematic } from "../components/tournament/ui/Cinematic";
import { useTournamentLogic } from "../components/tournament/hooks/useTournamentLogic";

const TournamentBracket = () => {
  const {
    matches,
    loading,

    showLogin,
    setUser,
    setPass,
    authenticate,

    showPanel,
    generarOctavos,

    showCinematic,
    cinematicMatches,
    currentPairIndex,
    roulettePhase,
    rouletteName,
  } = useTournamentLogic();

  const getMatches = (stage: string) =>
    matches.filter((m) => m.partidoEtapa?.toUpperCase() === stage.toUpperCase());

  const octavos = getMatches("OCTAVOS");
  const cuartos = getMatches("CUARTOS");
  const semi = getMatches("SEMIFINAL");
  const final = getMatches("FINAL");

  const octavosLeft = octavos.slice(0, 4);
  const octavosRight = octavos.slice(4, 8);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg animate-pulse">
        Cargando brackets…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbe8ff] via-[#f3f6ff] to-[#ffffff] py-10 px-4">

      {/* HEADER */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-800 rounded-full mb-3 shadow-xl">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-sm">
          Torneo de Microfútbol
        </h1>

        <p className="text-gray-600 mt-1 tracking-wide">Brackets del Torneo</p>
      </div>

      {/* BRACKETS */}
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
      <AdminLogin
        showLogin={showLogin}
        setUser={setUser}
        setPass={setPass}
        authenticate={authenticate}
      />

      {/* PANEL ADMIN */}
      <AdminPanel showPanel={showPanel} generarOctavos={generarOctavos} />

      {/* CINEMÁTICA */}
      <Cinematic
        showCinematic={showCinematic}
        currentCinematicMatch={cinematicMatches[currentPairIndex]}
        roulettePhase={roulettePhase}
        rouletteName={rouletteName}
        currentPairIndex={currentPairIndex}
        cinematicMatches={cinematicMatches}
      />
    </div>
  );
};

export default TournamentBracket; 