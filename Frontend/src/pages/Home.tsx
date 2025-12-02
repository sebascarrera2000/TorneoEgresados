// Home.tsx — Intro cinematográfica “Marvel” (sin parpadeos; solo 1 vez por navegador)
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ChevronRight, Trophy, Users, Calendar } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import "./Home.css";
import EventBanner from "../components/EventBanner";
interface Sport {
  name: string;
  description: string;
  image: string;
}

const getInitialShowHero = (): boolean => {
  try {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("introPlayed") === "true";
  } catch {
    return false;
  }
};

export const Home: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [showHero, setShowHero] = useState<boolean>(getInitialShowHero);
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    try {
      const played = localStorage.getItem("introPlayed") === "true";
      if (played) setShowHero(true);
    } catch {}
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const introRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const sports: Sport[] = [
    {
      name: "Microfútbol",
      description: "Equipos de 8 jugadores",
      image:
        "https://s3.amazonaws.com/rtvc-assets-senalcolombia.gov.co/s3fs-public/field/image/medidas-cancha-futbol-salon-articulo.jpg",
    },
    {
      name: "Baloncesto",
      description: "Equipos de 8 jugadores",
      image:
        "https://reglasdeldeporte.com/wp-content/uploads/Reglas-del-baloncesto.jpg",
    },
    {
      name: "Ping Pong",
      description: "Equipos de 1 jugador",
      image:
        "https://static.wixstatic.com/media/d9a908_9788d245789c4c4b92b72651bf14f704~mv2.jpg",
    },
  ];

  // ===== INTRO =====
  useEffect(() => {
    if (showHero) return;
    if (!introRef.current) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".intro-panel");
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.to(introRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
              setShowHero(true);
              try {
                localStorage.setItem("introPlayed", "true");
              } catch {}
            },
          });
        },
      });

      gsap.set(panels[0], { xPercent: -120, scale: 1.08, filter: "blur(6px)" });
      gsap.set(panels[1], { xPercent: 120, scale: 1.08, filter: "blur(6px)" });
      gsap.set(panels[2], { xPercent: -120, scale: 1.08, filter: "blur(6px)" });

      tl.to(panels[0], { xPercent: 0, duration: 1.2 }, 0.0)
        .to(panels[1], { xPercent: 0, duration: 1.2 }, 0.25)
        .to(panels[2], { xPercent: 0, duration: 1.2 }, 0.5)
        .to(
          panels,
          { scale: 1, filter: "blur(0px)", duration: 1.6, stagger: 0.1 },
          ">-0.1"
        );

      if (sweepRef.current) {
        gsap.set(sweepRef.current, { xPercent: -120, opacity: 0 });
        tl.to(
          sweepRef.current,
          { xPercent: 120, opacity: 0.6, duration: 1.4 },
          ">-0.4"
        ).to(sweepRef.current, { opacity: 0, duration: 0.4 }, ">-0.2");
      }

      if (logoRef.current) {
        gsap.set(logoRef.current, { opacity: 0, scale: 0.92, filter: "blur(8px)" });
        tl.to(
          logoRef.current,
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2 },
          ">-0.2"
        );
        tl.fromTo(
          ".logo-reveal-mask",
          { width: "0%" },
          { width: "100%", duration: 1.2 },
          "<"
        );
        tl.fromTo(
          ".logo-shine",
          { xPercent: -150, opacity: 0 },
          { xPercent: 150, opacity: 1, duration: 0.8 },
          ">-0.7"
        ).to(".logo-shine", { opacity: 0, duration: 0.2 }, ">-0.1");
      }
    }, introRef);

    return () => ctx.revert();
  }, [showHero]);

  // ===== PING API =====
  useEffect(() => {
    const URL = "https://torneoegresados.onrender.com/";

    const fetchWithRetries = async () => {
      let attempts = 0;

      const tryFetch = async () => {
        attempts++;
        try {
          const res = await fetch(URL, { cache: "no-store" });
          if (res.ok) {
            console.log("API cargada");
            return true;
          } else {
            throw new Error("Respuesta no OK");
          }
        } catch (err) {
          if (attempts < 3) {
            setTimeout(tryFetch, 45000);
          }
        }
      };

      tryFetch();
    };

    fetchWithRetries();
    const interval = setInterval(fetchWithRetries, 40 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showHero) return;
    const onMouse = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to(heroRef.current, { x, y, duration: 1, ease: "power3.out" });
    };
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, [showHero]);

  return (
    <div className="homepage">
      {/* ===== INTRO ===== */}
      <AnimatePresence>
        {!showHero && (
          <motion.div className="intro-marvel" ref={introRef}>
            <div className="intro-sweep" ref={sweepRef} />
            <div className="intro-panels">
              {sports.map((s) => (
                <div className="intro-panel" key={s.name}>
                  <div
                    className="intro-panel-bg"
                    style={{ backgroundImage: `url('${s.image}')` }}
                  />
                  <div className="intro-panel-gradient" />
                  <div className="intro-panel-caption">
                    <h3>{s.name}</h3>
                    <p>{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="intro-logo-wrap" ref={logoRef}>
              <div className="logo-reveal-mask" />
              <h1 className="intro-logo-text">Torneo Leyendas Unimar 2025</h1>
              <div className="logo-shine" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HERO ===== */}
      {showHero && (
        <>
          <section className="hero-section" ref={heroRef}>
            <div className="bubbles">
              <div className="bubble bubble1" />
              <div className="bubble bubble2" />
              <div className="bubble bubble3" />
              <div className="bubble4" data-bits="01" />
              <div className="bubble5" data-bits="10" />
              <div className="bubble6" data-bits="11" />
              <div className="bubble7" data-bits="00" />
            </div>

            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <h1 className="hero-title shimmer">Torneo Leyendas Unimar 2025</h1>
              <p className="hero-subtitle">
                Vive la pasión, la competencia y la unión deportiva
              </p>
            </motion.div>
          </section>

          {/* ===== BANNER — SORTEO Y FECHAS ===== */}
          <section className="mt-16 px-6">
              <EventBanner />
          </section>
        </>
      )}

      {/* ===== CARDS ===== */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-1100 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Premios Increíbles</h3>
          <p className="text-gray-600">Se ganarán premios</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Comunidad Activa</h3>
          <p className="text-gray-600">
            Únete a cientos de equipos y deportistas apasionados
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Fechas</h3>
          <p className="text-gray-600">Pendientes</p>
        </div>
      </div>
    </div>
  );
};
