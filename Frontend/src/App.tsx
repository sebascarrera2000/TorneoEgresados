import { BrowserRouter, Routes, Route } from "react-router-dom";

import { NavigationProvider, useNavigation } from "./context/NavigationContext";

import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Teams } from "./pages/Teams";
import { Soporte } from "./pages/Soporte";
import { Register } from "./pages/RegisterPage";
import TournamentBracket from "./pages/TournamentBracket"; // componente nuevo del torneo

function AppContent() {
  const { currentPage } = useNavigation();

  return (
    <>
      <Navbar />

      <div className="pt-16">
        {currentPage === "home" && <Home />}
        {currentPage === "teams" && <Teams />}
        {currentPage === "soporte" && <Soporte />}
        {currentPage === "torneo" && <TournamentBracket />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavigationProvider>
        <Routes>
          {/* NAVEGACIÓN INTERNA */}
          <Route path="/" element={<AppContent />} />

          {/* PÁGINAS ACCESIBLES SOLO POR URL */}
          <Route path="/register" element={<Register />} />

          {/* TORNEO POR URL DIRECTA */}
          <Route path="/torneo" element={<TournamentBracket />} />
        </Routes>
      </NavigationProvider>
    </BrowserRouter>
  );
}
