import { useState } from "react";
import { useProgress } from "../context/ProgressContext";
import {
  Compass,
  Palette,
  Layers,
  Puzzle,
  Home,
  Award,
  Zap,
  Menu,
  X,
} from "lucide-react";

export default function Navbar({ activePage, onNavigate }) {
  const { totalXp, level, currentRank } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "museum", label: "Virtual Museum", icon: Compass },
    { id: "lab", label: "Painter's Lab", icon: Palette },
    { id: "comparison", label: "Showdown", icon: Layers },
    { id: "puzzle", label: "Puzzle", icon: Puzzle },
    { id: "progress", label: "Progress", icon: Award },
  ];

  function handleSelect(id) {
    onNavigate(id);
    setMobileMenuOpen(false);
  }

  return (
    <header className="futuristic-navbar">
      <div className="navbar-inner">
        {/* BRAND LOGO */}
        <button
          className="brand-logo-btn"
          onClick={() => handleSelect("home")}
          aria-label="Museo 3D Home"
        >
          <div className="brand-symbol">
            <span className="symbol-letter">M</span>
            <span className="symbol-glow" />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              MUSEO <span className="brand-highlight">3D</span>
            </div>
            <div className="brand-sub">COMPUTER GRAPHICS LAB</div>
          </div>
        </button>

        {/* DESKTOP NAV LINKS */}
        <nav className="desktop-nav-menu" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activePage === item.id;

            return (
              <button
                key={item.id}
                className={`nav-tab-btn ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {isSelected && <span className="tab-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: EXPLORER LEVEL & XP PILL */}
        <div className="nav-profile-section">
          <button
            className="player-status-pill"
            onClick={() => handleSelect("progress")}
            title="View Learning Progress Hub"
          >
            <div className="status-avatar">{currentRank.badge}</div>
            <div className="status-meta">
              <span className="status-level">Lv. {level} · {currentRank.title.split(" ")[0]}</span>
              <span className="status-xp">
                <Zap size={11} className="text-cyan" /> {totalXp} XP
              </span>
            </div>
          </button>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-dropdown">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activePage === item.id;

            return (
              <button
                key={item.id}
                className={`mobile-nav-item ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {isSelected && <span className="mobile-active-dot" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
