{/* ===== BANNER PROFESIONAL ===== */}
import { useState, useEffect } from "react";
import { Clock, Calendar as CalendarIcon, MapPin, CalendarPlus } from "lucide-react";
import { toast } from "react-toastify";

const EventBanner = () => {
  const eventTime = new Date();
  eventTime.setHours(18, 0, 0, 0); // hoy 6:00 pm

  const [timeLeft, setTimeLeft] = useState("");
  const [progress, setProgress] = useState(0);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = eventTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        setProgress(100);

        if (!notified) {
          toast.info("El encuentro de Futsal ha comenzado");
          setNotified(true);
        }
        return;
      }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(
          2,
          "0"
        )}:${String(s).padStart(2, "0")}`
      );

      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);

      const total = eventTime.getTime() - dayStart.getTime();
      const elapsed = total - diff;
      setProgress((elapsed / total) * 100);
    };

    update();
    const int = setInterval(update, 1000);
    return () => clearInterval(int);
  }, []);

  // GOOGLE CALENDAR URL
  const buildGoogleCalendarURL = () => {
    const start = new Date();
    start.setHours(18, 0, 0, 0);

    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hora

    const format = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const startStr = format(start);
    const endStr = format(end);

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Sorteo y Primer Encuentro • Torneo Leyendas Unimar",
      dates: `${startStr}/${endStr}`,
      details:
        "Asiste al sorteo y primer encuentro oficial del Torneo Leyendas Unimar 2025.",
      location: "Polideportivo Universidad Mariana",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const openGoogleCalendar = () => {
    window.open(buildGoogleCalendarURL(), "_blank");
  };

  return (
    <section className="mt-20 px-6">
      <div className="
        max-w-5xl mx-auto
        flex flex-col md:flex-row
        bg-white/80 backdrop-blur-xl
        shadow-xl border border-gray-200
        rounded-2xl overflow-hidden
      ">
        
        {/* === Imagen === */}
        <div className="md:w-1/3 w-full p-6 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <img
            src="https://www.unicomfacauca.edu.co/wp-content/uploads/Universidad-Mariana.jpg"
            className="rounded-xl shadow-lg h-48 w-full object-cover"
          />
        </div>

        {/* === Contenido === */}
        <div className="md:w-2/3 w-full p-10 flex flex-col justify-center">
          <p className="text-sm text-gray-500 mb-2 flex items-center gap-2 font-medium">
            <CalendarIcon size={18} />
            Primer encuentro – Futsal
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Inaguracion ,  Sorteo Futsal y Primer Partido
          </h2>

          <div className="flex items-center gap-6 text-gray-700 mb-6">
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span className="font-semibold">Hoy — 6:00 PM</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <span className="font-semibold">
                Polideportivo Universidad Mariana
              </span>
            </div>
          </div>

          {/* COUNTDOWN */}
          <p className="text-lg font-semibold text-gray-700">Comienza en:</p>
          <div className="text-4xl font-bold text-blue-600 tracking-wide mb-4">
            {timeLeft}
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-blue-600 transition-all"
            ></div>
          </div>

          {/* BOTÓN GOOGLE CALENDAR */}
          <button
            onClick={openGoogleCalendar}
            className="
              mt-2 mb-6
              w-full md:w-auto
              px-5 py-3
              font-semibold
              rounded-lg
              flex items-center gap-2
              bg-blue-600 hover:bg-blue-700 
              text-white
              transition
              shadow-md
            "
          >
            <CalendarPlus size={20} />
            Agregar a Google Calendar
          </button>

          {/* FECHAS */}
          <div>
            <p className="text-sm text-gray-600 font-semibold">
              Fechas oficiales de partidos:
            </p>

            <div className="flex gap-3 mt-3">
              {[3, 4, 5, 6].map((d) => (
                <span
                  key={d}
                  className="
                    px-4 py-2 font-semibold
                    rounded-lg border border-gray-300
                    bg-gray-50 text-gray-700
                  "
                >
                  {d} Dic
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EventBanner