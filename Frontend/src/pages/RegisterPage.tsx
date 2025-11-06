// src/modules/register/Register.tsx
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Trophy,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import confetti from "canvas-confetti";
import "react-toastify/dist/ReactToastify.css";
import { StepContainer } from "../components/register/StepContainer";
import { StepDeporte } from "../components/register/StepDeporte";
import { StepEquipo } from "../components/register/StepEquipo";
import { StepJugadores } from "../components/register/StepJugadores";
import { StepResumen } from "../components/register/StepResumen";
import { ParticlesBackground } from "../components/register/ParticlesBackground";

export const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sports, setSports] = useState<any[]>([]);

  // Estructura final
  const [formData, setFormData] = useState({
    sport: "",
    sportName: "",
    teamName: "",
    captainName: "",
    captainId: "",
    phone: "",
    email: "",
    players: [] as {
      name: string;
      idNumber: string;
      program: string;
      email: string;
    }[],
  });

  /* =========================================================
     🔹 Obtener lista de deportes desde la API
  ========================================================= */
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("https://torneoegresados.onrender.com/api/sports");
        const data = await res.json();
        setSports(data);
      } catch (err) {
        console.error("Error al obtener deportes:", err);
        toast.error("No se pudieron cargar los deportes");
      }
    };
    fetchSports();
  }, []);

  /* =========================================================
     🔹 Reglas locales de jugadores por deporte
  ========================================================= */
  const getLimits = (sportName: string) => {
    const name = sportName.toLowerCase();
    if (name.includes("ping")) return { min: 1, max: 1 };
    if (name.includes("micro")) return { min: 6, max: 8 };
    if (name.includes("balon") || name.includes("basket")) return { min: 6, max: 8 };
    return { min: 1, max: 10 };
  };

  const currentSport = sports.find((s) => s._id === formData.sport);
  const currentLimits = currentSport ? getLimits(currentSport.name) : { min: 1, max: 10 };

  /* =========================================================
     🔹 Manejo de selección de deporte
  ========================================================= */
  const handleSportChange = (sportId: string) => {
    const selected = sports.find((s) => s._id === sportId);
    const { min } = getLimits(selected?.name || "");
    setFormData((prev) => ({
      ...prev,
      sport: sportId,
      sportName: selected?.name || "",
      players: Array(min)
        .fill(null)
        .map(() => ({ name: "", idNumber: "", program: "", email: "" })),
    }));
  };

  /* =========================================================
     🔹 Capitán cuenta como jugador
  ========================================================= */
  useEffect(() => {
    if (formData.captainName && formData.captainId) {
      const captainPlayer = {
        name: formData.captainName,
        idNumber: formData.captainId,
        program: "Capitán",
        email: formData.email,
      };
      const filtered = formData.players.filter((p) => p.program !== "Capitán");
      setFormData((prev) => ({
        ...prev,
        players: [captainPlayer, ...filtered],
      }));
    }
  }, [formData.captainName, formData.captainId, formData.email]);

  /* =========================================================
     🔹 Manejo de jugadores
  ========================================================= */
  const handlePlayerChange = (
    index: number,
    field: "name" | "idNumber" | "program" | "email",
    value: string
  ) => {
    const updated = [...formData.players];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, players: updated });
  };

  const addPlayer = () => {
    if (formData.players.length < currentLimits.max) {
      setFormData({
        ...formData,
        players: [
          ...formData.players,
          { name: "", idNumber: "", program: "", email: "" },
        ],
      });
    } else {
      toast.info(`Máximo ${currentLimits.max} jugadores permitidos`);
    }
  };

  const removePlayer = (index: number) => {
    if (formData.players.length <= currentLimits.min) {
      toast.warning(`Debes tener al menos ${currentLimits.min} jugadores registrados`);
      return;
    }
    setFormData({
      ...formData,
      players: formData.players.filter((_, i) => i !== index),
    });
  };

  /* =========================================================
     🔹 Enviar a la API
  ========================================================= */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://torneoegresados.onrender.com/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error al registrar el equipo");

      toast.success("¡Registro exitoso!");
      confetti({ particleCount: 220, spread: 90, origin: { y: 0.6 } });
      setStep(5);
    } catch (error: any) {
      toast.error(error.message || "Error al registrar equipo");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     🔹 Navegación
  ========================================================= */
  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const steps = ["Deporte", "Equipo", "Jugadores", "Resumen", "Confirmar"];

  /* =========================================================
     🔹 Render principal
  ========================================================= */
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <ParticlesBackground />

      <img
        src="./logo.png"
        alt="Escudo Universidad Mariana"
        className="absolute bottom-6 right-6 w-20 sm:w-40 select-none"
      />

      <div className="relative z-10 w-full max-w-5xl bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-6 sm:p-10 border border-white/20">
        {/* ===== Barra de pasos ===== */}
        <div className="flex justify-between items-center mb-8 sm:mb-10 relative">
          {steps.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center relative">
              {i < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-[2px] ${
                    step > i + 1 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
              <div
                className={`z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  step > i + 1
                    ? "bg-blue-600 border-blue-600 text-white"
                    : step === i + 1
                    ? "bg-white border-blue-600 text-blue-600"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <p
                className={`mt-2 text-[10px] sm:text-xs ${
                  step >= i + 1 ? "text-blue-700 font-semibold" : "text-gray-500"
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ===== Contenido dinámico ===== */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepContainer key="step1">
              <StepDeporte
                formData={formData}
                sportInfo={Object.fromEntries(
                  sports.map((s) => [
                    s._id,
                    {
                      label: s.name,
                      icon: <Users />,
                      color: s.color || "#2563eb",
                      ...getLimits(s.name),
                    },
                  ])
                )}
                handleSportChange={handleSportChange}
                nextStep={nextStep}
                TrophyIcon={<Trophy className="w-8 h-8 text-white" />}
              />
            </StepContainer>
          )}

          {step === 2 && (
            <StepContainer key="step2">
              <StepEquipo
                formData={{
                  name: formData.teamName,
                  captain: formData.captainName,
                  captainCedula: formData.captainId,
                  phone: formData.phone,
                  email: formData.email,
                }}
                setFormData={(updater: any) => {
                  if (typeof updater === "function") {
                    setFormData((prev) => {
                      const updated = updater({
                        name: prev.teamName,
                        captain: prev.captainName,
                        captainCedula: prev.captainId,
                        phone: prev.phone,
                        email: prev.email,
                      });
                      return {
                        ...prev,
                        teamName: updated.name,
                        captainName: updated.captain,
                        captainId: updated.captainCedula,
                        phone: updated.phone,
                        email: updated.email,
                      };
                    });
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      teamName: updater.name ?? prev.teamName,
                      captainName: updater.captain ?? prev.captainName,
                      captainId: updater.captainCedula ?? prev.captainId,
                      phone: updater.phone ?? prev.phone,
                      email: updater.email ?? prev.email,
                    }));
                  }
                }}
                prevStep={prevStep}
                nextStep={nextStep}
                icons={{
                  team: <Users className="w-5 h-5 text-gray-400" />,
                  captain: <UserPlus className="w-5 h-5 text-gray-400" />,
                  id: <CreditCard className="w-5 h-5 text-gray-400" />,
                  phone: <Phone className="w-5 h-5 text-gray-400" />,
                  mail: <Mail className="w-5 h-5 text-gray-400" />,
                }}
              />
            </StepContainer>
          )}

          {step === 3 && (
            <StepContainer key="step3">
              <StepJugadores
                formData={{
                  players: formData.players.map((p) => ({
                    name: p.name,
                    cedula: p.idNumber,
                    egresado: p.program,
                  })),
                }}
                handlePlayerChange={(i, field, v) =>
                  handlePlayerChange(
                    i,
                    field === "cedula" ? "idNumber" : field === "egresado" ? "program" : field,
                    v
                  )
                }
                addPlayer={addPlayer}
                removePlayer={removePlayer}
                prevStep={prevStep}
                nextStep={nextStep}
                currentSport={currentLimits}
              />
            </StepContainer>
          )}

          {step === 4 && (
            <StepContainer key="step4">
              <StepResumen
                formData={{
                  name: formData.teamName,
                  sport: formData.sportName,
                  captain: formData.captainName,
                  captainCedula: formData.captainId,
                  phone: formData.phone,
                  email: formData.email,
                  players: formData.players.map((p) => ({
                    name: p.name,
                    cedula: p.idNumber,
                    egresado: p.program,
                  })),
                }}
                prevStep={prevStep}
                handleSubmit={handleSubmit}
                setStep={setStep}
              />
            </StepContainer>
          )}

          {step === 5 && (
            <StepContainer key="step5">
              <div className="flex flex-col items-center justify-center text-center py-8">
                <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  ¡Registro Completo!
                </h2>
                <p className="text-gray-600 mb-6">
                  Tu equipo ha sido inscrito exitosamente.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                >
                  Registrar otro equipo
                </button>
              </div>
            </StepContainer>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
