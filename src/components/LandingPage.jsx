import HeroScene from "./HeroScene";
import { useProgress } from "../context/ProgressContext";
import {
  Compass,
  Palette,
  Layers,
  Puzzle,
  ChevronRight,
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Eye,
} from "lucide-react";

export default function LandingPage({ onNavigate }) {
  const { visitedMissions, totalXp, level, currentRank } = useProgress();

  const missions = [
    {
      id: "museum",
      number: "01",
      title: "Virtual Museum",
      tagline: "Spatial Geometry & Materials",
      description: "Step into an architectural gallery. Inspect real-time 3D sculptures, toggle wireframes, and examine how materials interact with light.",
      icon: Compass,
      reward: 100,
      accent: "cyan",
      badge: "MISSION 01",
    },
    {
      id: "lab",
      number: "02",
      title: "Painter's Algorithm Lab",
      tagline: "Back-to-Front Depth Ordering",
      description: "Experiment with the fundamental visibility technique. Calculate camera-space depth, manipulate object positions, and inspect edge-case failures.",
      icon: Palette,
      reward: 150,
      accent: "violet",
      badge: "MISSION 02",
    },
    {
      id: "comparison",
      number: "03",
      title: "Renderer Showdown",
      tagline: "Painter's vs Hardware Z-Buffer",
      description: "Side-by-side engineering comparison. See how per-pixel depth testing solves intersecting polygons where back-to-front sorting fails.",
      icon: Layers,
      reward: 200,
      accent: "lavender",
      badge: "MISSION 03",
    },
    {
      id: "puzzle",
      number: "04",
      title: "Painter's Puzzle",
      tagline: "Interactive Spatial Challenge",
      description: "Put your spatial reasoning to the test. Order overlapping artifacts by depth and simulate your queue in real time to verify correct occlusion.",
      icon: Puzzle,
      reward: 150,
      accent: "emerald",
      badge: "BONUS QUEST",
    },
  ];

  return (
    <div className="landing-page">
      {/* CINEMATIC HERO SECTION */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} className="pulse-icon" />
              <span>THE INTERACTIVE GRAPHICS LABORATORY</span>
            </div>

            <h1 className="hero-title">
              Step Inside the World of <span className="gradient-text">3D Graphics.</span>
            </h1>

            <p className="hero-description">
              Discover the science behind digital worlds through immersive 3D exploration,
              interactive rendering experiments, and hands-on challenges.
            </p>

            <div className="hero-cta-group">
              <button
                className="btn-futuristic btn-primary btn-lg"
                onClick={() => onNavigate("museum")}
              >
                <span>ENTER THE MUSEUM</span>
                <ChevronRight size={18} />
              </button>

              <button
                className="btn-futuristic btn-secondary btn-lg"
                onClick={() => onNavigate("lab")}
              >
                <span>EXPLORE THE SCIENCE</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="hero-stats-strip">
              <div className="hero-stat-item">
                <span className="stat-label">EXPLORER LEVEL</span>
                <strong className="stat-value">Lv. {level}</strong>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="stat-label">TOTAL EXPERIENCE</span>
                <strong className="stat-value">{totalXp} XP</strong>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="stat-label">RANK</span>
                <strong className="stat-value text-accent">{currentRank.title}</strong>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <HeroScene />
          </div>
        </div>
      </section>

      {/* LEARNING JOURNEY OVERVIEW */}
      <section className="journey-section">
        <div className="section-header text-center">
          <span className="section-eyebrow">CURRICULUM ARCHITECTURE</span>
          <h2 className="section-title">
            The Computer Graphics <span className="gradient-text">Learning Journey</span>
          </h2>
          <p className="section-subtitle">
            From spatial coordinates to per-pixel depth testing, master visibility determination through interactive experimentation.
          </p>
        </div>

        <div className="journey-pillars">
          <div className="pillar-card">
            <div className="pillar-num">01</div>
            <div className="pillar-icon-box cyan">
              <Compass size={24} />
            </div>
            <h3>Explore the Museum</h3>
            <p>
              Navigate a 3D architectural interior. Inspect geometric primitives, custom vertex shaders, normal vectors, and lighting response.
            </p>
            <span className="pillar-metric">Spatial Geometry</span>
          </div>

          <div className="pillar-card">
            <div className="pillar-num">02</div>
            <div className="pillar-icon-box violet">
              <Palette size={24} />
            </div>
            <h3>Painter's Algorithm</h3>
            <p>
              Understand back-to-front rendering order. Step through the drawing sequence and see how camera-space depth calculations govern occlusion.
            </p>
            <span className="pillar-metric">Depth Sorting Logic</span>
          </div>

          <div className="pillar-card">
            <div className="pillar-num">03</div>
            <div className="pillar-icon-box lavender">
              <Layers size={24} />
            </div>
            <h3>Renderer Showdown</h3>
            <p>
              Compare software Painter's sorting against modern hardware Z-buffering. Explore how GPUs handle intersecting geometry at pixel level.
            </p>
            <span className="pillar-metric">Hardware Z-Buffer</span>
          </div>

          <div className="pillar-card">
            <div className="pillar-num">04</div>
            <div className="pillar-icon-box emerald">
              <Puzzle size={24} />
            </div>
            <h3>Test Your Knowledge</h3>
            <p>
              Tackle spatial ordering puzzles and knowledge checks. Prove your mastery of computer graphics algorithms and earn explorer achievements.
            </p>
            <span className="pillar-metric">Gamified Verification</span>
          </div>
        </div>
      </section>

      {/* CORE MISSIONS SECTION */}
      <section className="missions-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">INTERACTIVE LABS</span>
            <h2 className="section-title">Core Missions</h2>
          </div>
          <div className="missions-progress-summary">
            <span>{visitedMissions.length} OF 3 COMPLETED</span>
            <div className="mini-progress-bar">
              <div
                className="mini-progress-fill"
                style={{ width: `${(visitedMissions.length / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="missions-grid">
          {missions.map((mission) => {
            const isCompleted = visitedMissions.includes(mission.id);
            const Icon = mission.icon;

            return (
              <div key={mission.id} className={`mission-card accent-${mission.accent}`}>
                <div className="mission-card-top">
                  <span className="mission-badge">{mission.badge}</span>
                  <span className={`mission-status-pill ${isCompleted ? "status-done" : "status-ready"}`}>
                    {isCompleted ? "COMPLETED" : "READY"}
                  </span>
                </div>

                <div className="mission-icon-wrap">
                  <Icon size={32} />
                </div>

                <div className="mission-card-body">
                  <span className="mission-tagline">{mission.tagline}</span>
                  <h3 className="mission-title">{mission.title}</h3>
                  <p className="mission-desc">{mission.description}</p>
                </div>

                <div className="mission-card-footer">
                  <div className="mission-reward-badge">
                    <Zap size={14} />
                    <span>+{mission.reward} XP</span>
                  </div>

                  <button
                    className="btn-futuristic btn-primary btn-sm"
                    onClick={() => onNavigate(mission.id)}
                  >
                    <span>{isCompleted ? "Revisit Lab" : "Launch Mission"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* THE SCIENCE SPOTLIGHT */}
      <section className="science-spotlight">
        <div className="spotlight-card">
          <div className="spotlight-badge">
            <BookOpen size={16} />
            <span>THE COMPUTER GRAPHICS CONUNDRUM</span>
          </div>

          <div className="spotlight-grid">
            <div className="spotlight-copy">
              <h3>The Visibility Determination Problem</h3>
              <p>
                When projecting a three-dimensional world onto a flat 2D screen, how does the graphics engine know which surfaces are visible to the observer and which are occluded?
              </p>
              <p>
                In 1974, Edwin Catmull invented the <strong>Z-Buffer algorithm</strong>, solving visibility at the hardware rasterization stage. Before that, <strong>Painter's Algorithm</strong> sought to sort entire polygons back-to-front—an intuitive approach that struggles with intersecting geometry and cycles.
              </p>

              <div className="spotlight-points">
                <div className="point-item">
                  <ShieldCheck size={18} className="text-cyan" />
                  <span>Object-space vs Screen-space visibility algorithms</span>
                </div>
                <div className="point-item">
                  <Eye size={18} className="text-violet" />
                  <span>Camera projection and depth interpolation</span>
                </div>
                <div className="point-item">
                  <Layers size={18} className="text-lavender" />
                  <span>Tradeoffs in memory, sorting complexity, and transparency</span>
                </div>
              </div>

              <div className="spotlight-actions">
                <button
                  className="btn-futuristic btn-primary"
                  onClick={() => onNavigate("comparison")}
                >
                  Inspect Renderer Showdown
                </button>
              </div>
            </div>

            <div className="spotlight-diagram">
              <div className="diagram-frame">
                <div className="diagram-layer layer-back">
                  <span>FAR: Depth = 8.5 (Drawn First)</span>
                </div>
                <div className="diagram-layer layer-mid">
                  <span>MID: Depth = 5.2 (Overwrites Far)</span>
                </div>
                <div className="diagram-layer layer-front">
                  <span>NEAR: Depth = 2.1 (Overwrites All)</span>
                </div>
                <div className="diagram-camera">
                  <div className="camera-icon">🎥</div>
                  <span>Observer Camera</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
