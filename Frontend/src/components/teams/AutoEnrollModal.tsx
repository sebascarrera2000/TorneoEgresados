import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";

/* =========================================================
   🔹 Programas académicos Universidad Mariana
========================================================= */
const programasData = {
  pregrado: {
    "Facultad de Humanidades y Ciencias Sociales": [
      "Derecho",
      "Trabajo Social",
      "Comunicación Social",
      "Psicología",
    ],
    "Facultad de Ciencias Contables, Económicas y Administrativas": [
      "Mercadeo",
      "Contaduría Pública",
      "Administración de Negocios Internacionales",
    ],
    "Facultad de Educación": [
      "Licenciatura en Teología",
      "Licenciatura en Educación Infantil",
      "Licenciatura en Educación Básica Primaria",
    ],
    "Facultad de Ciencias de la Salud": [
      "Enfermería",
      "Terapia Ocupacional",
      "Fisioterapia",
      "Nutrición y Dietética",
    ],
    "Facultad de Ingeniería": [
      "Ingeniería Mecatrónica",
      "Ingeniería Civil",
      "Ingeniería de Sistemas",
      "Ingeniería Ambiental",
      "Ingeniería de Procesos",
    ],
  },
  posgrado: {
    "Facultad de Ciencias de la Salud": [
      "Especialización en Enfermería Oncológica",
      "Especialización en Enfermería Materno Perinatal",
      "Especialización en Enfermería para el Cuidado del Paciente en Estado Crítico",
      "Maestría en Administración en Salud",
    ],
    "Facultad de Ingeniería": [
      "Especialización en Sistemas Integrados de Gestión",
      "Maestría en Diseño, Gestión y Optimización de Procesos",
      "Maestría en Ciencias Ambientales (Convenio UTP)",
    ],
    "Facultad de Humanidades y Ciencias Sociales": [
      "Especialización en Familia",
      "Maestría en Derecho Público y Privado",
      "Maestría en Gobernanza y Políticas Públicas",
      "Maestría en Salud Mental (Convenio CES Medellín)",
    ],
    "Facultad de Ciencias Contables, Económicas y Administrativas": [
      "Especialización en Gerencia de Marketing Estratégico",
      "Especialización en Alta Gerencia",
      "Especialización en Gerencia Tributaria",
      "Especialización en Gerencia Financiera",
      "Especialización en Gerencia Financiera (Virtual)",
      "Maestría en Gerencia Financiera",
      "Maestría en Gerencia y Auditoría Tributaria",
      "Maestría en Administración",
    ],
    "Facultad de Educación": [
      "Maestría en Gestión Educativa y Liderazgo",
      "Maestría en Pedagogía (Virtual)",
      "Doctorado en Pedagogía",
    ],
  },
};

/* =========================================================
   🔹 Modal de auto-matrícula (con ID real del deporte)
========================================================= */
export const AutoEnrollModal = ({ sports, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    idNumber: "",
    nivel: "",
    facultad: "",
    program: "",
    sportId: "",
    sportName: "",
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sportId) {
      toast.warning("❌ Debes seleccionar un deporte válido");
      return;
    }

    try {
      const payload = {
        ...formData,
        sport: formData.sportId, // 👈 aseguramos que se envía el ObjectId real
      };

      const res = await fetch("https://torneoegresados.onrender.com/api/teams/auto-enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        toast.warning("⚠️ No hay cupos disponibles en este deporte.");
        return;
      }

      if (!res.ok) throw new Error("Error en la inscripción");

      const data = await res.json();
      toast.success(`✅ Te uniste al equipo ${data.teamName}`);
      onClose();
    } catch (err) {
      console.error("❌ Error inscribiendo usuario:", err);
      toast.error("Ocurrió un error durante la inscripción");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Auto-Matrícula en un Equipo
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Ingresa tus datos para unirte automáticamente a un equipo con cupo
          disponible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full border rounded-lg px-4 py-2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          {/* Identificación */}
          <input
            type="text"
            placeholder="Número de identificación"
            className="w-full border rounded-lg px-4 py-2"
            value={formData.idNumber}
            onChange={(e) =>
              setFormData({ ...formData, idNumber: e.target.value })
            }
            required
          />

          {/* Nivel Académico */}
          <select
            className="w-full border rounded-lg px-4 py-2"
            value={formData.nivel}
            onChange={(e) =>
              setFormData({
                ...formData,
                nivel: e.target.value,
                facultad: "",
                program: "",
              })
            }
            required
          >
            <option value="">Selecciona nivel académico</option>
            <option value="pregrado">Pregrado</option>
            <option value="posgrado">Posgrado</option>
          </select>

          {/* Facultad */}
          {formData.nivel && (
            <select
              className="w-full border rounded-lg px-4 py-2"
              value={formData.facultad}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  facultad: e.target.value,
                  program: "",
                })
              }
              required
            >
              <option value="">Selecciona una facultad</option>
              {Object.keys(programasData[formData.nivel]).map((fac) => (
                <option key={fac} value={fac}>
                  {fac}
                </option>
              ))}
            </select>
          )}

          {/* Programa */}
          {formData.facultad && (
            <select
              className="w-full border rounded-lg px-4 py-2"
              value={formData.program}
              onChange={(e) =>
                setFormData({ ...formData, program: e.target.value })
              }
              required
            >
              <option value="">Selecciona un programa</option>
              {programasData[formData.nivel][formData.facultad].map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          )}

          {/* Deporte (por ID real, excluye Ping Pong) */}
          <select
            className="w-full border rounded-lg px-4 py-2"
            value={formData.sportId}
            onChange={(e) => {
              const selected = sports.find((s) => s._id === e.target.value);
              if (!selected) return;

              if (selected.name?.toLowerCase() === "pingpong") {
                toast.warning("🚫 Ping Pong no admite inscripción automática.");
                setFormData({
                  ...formData,
                  sportId: "",
                  sportName: "",
                });
                return;
              }

              // ✅ Guardar el ID real y el nombre
              setFormData({
                ...formData,
                sportId: selected._id,
                sportName: selected.name,
              });
            }}
            required
          >
            <option value="">Selecciona un deporte</option>
            {sports
              .filter((s) => s.name?.toLowerCase() !== "pingpong")
              .map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
          </select>

          {/* Correo */}
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border rounded-lg px-4 py-2"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          {/* Botón */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-lg font-semibold shadow-md"
          >
            Inscribirme
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};
