import { useState, useEffect } from "react";
import { ProgressProvider } from "./context/ProgressContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import MuseumScene from "./components/MuseumScene";
import PainterLab from "./components/PainterLab";
import RenderingComparison from "./components/RenderingComparison";
import PainterChallenge from "./components/PainterChallenge";
import ProgressHub from "./components/ProgressHub";
import { ChevronLeft } from "lucide-react";
import "./index.css";

function AppContent() {
  const [activePage, setActivePage] = useState("home");

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activePage]);

  function handleNavigate(pageId) {
    setActivePage(pageId);
  }

  return (
    <div className="app-shell">
      {/* TOPBAR NAVIGATION */}
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      {/* BACK NAVIGATION BANNER IF IN AN EXPERIENCE */}
      {activePage !== "home" && (
        <div className="breadcrumb-strip">
          <div className="breadcrumb-inner">
            <button
              className="breadcrumb-back-btn"
              onClick={() => handleNavigate("home")}
            >
              <ChevronLeft size={16} />
              <span>Back to Command Center</span>
            </button>
            <div className="breadcrumb-crumb">
              <span>MUSEO 3D</span>
              <span className="crumb-slash">/</span>
              <span className="crumb-current">
                {activePage === "museum" && "Mission 01 · Virtual Museum"}
                {activePage === "lab" && "Mission 02 · Painter's Algorithm Lab"}
                {activePage === "comparison" && "Mission 03 · Renderer Showdown"}
                {activePage === "puzzle" && "Bonus Quest · Painter's Puzzle"}
                {activePage === "progress" && "Explorer Progress Hub"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <main className="main-viewport-content">
        {activePage === "home" && <LandingPage onNavigate={handleNavigate} />}
        {activePage === "museum" && <MuseumScene />}
        {activePage === "lab" && <PainterLab />}
        {activePage === "comparison" && <RenderingComparison />}
        {activePage === "puzzle" && <PainterChallenge />}
        {activePage === "progress" && <ProgressHub onNavigate={handleNavigate} />}
      </main>

      {/* FOOTER */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}
