import { useEffect, useState } from "react";

import MuseumScene from "./components/MuseumScene";
import PainterLab from "./components/PainterLab";
import RenderingComparison from "./components/RenderingComparison";
import PainterChallenge from "./components/PainterChallenge";

import "./index.css";

const experiences = [
  {
    id: "museum",
    number: "01",
    title: "Museum Explorer",
    subtitle: "Discover the 3D world",
    description:
      "Explore colorful digital artifacts and discover how 3D shapes come to life.",
    emoji: "🏛️",
    color: "mint",
    reward: 100,
  },
  {
    id: "lab",
    number: "02",
    title: "Painter Challenge",
    subtitle: "Master the algorithm",
    description:
      "Watch the back-to-front drawing order and experiment with Painter's Algorithm.",
    emoji: "🎨",
    color: "peach",
    reward: 150,
  },
  {
    id: "comparison",
    number: "03",
    title: "Renderer Showdown",
    subtitle: "Compare the techniques",
    description:
      "Explore the difference between Painter-style rendering and depth buffering.",
    emoji: "⚡",
    color: "lavender",
    reward: 200,
  },
];

const artifacts = [
  {
    number: "EXHIBIT 01",
    symbol: "◈",
    color: "cyan",
    title: "The Azure Form",
    description: "A geometric sculpture exploring light and shape.",
  },
  {
    number: "EXHIBIT 02",
    symbol: "◎",
    color: "gold",
    title: "The Golden Loop",
    description: "A study of symmetry, curves and metallic surfaces.",
  },
  {
    number: "EXHIBIT 03",
    symbol: "◇",
    color: "rose",
    title: "The Ruby Crystal",
    description: "A faceted form revealed through dynamic lighting.",
  },
];

export default function App() {
  const [page, setPage] = useState("home");

  // Scroll to the top whenever the page changes.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  // Progress is stored only in React state.
  // Refreshing the page resets missions, XP, and bonus completion.
  const [visited, setVisited] = useState([]);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // Calculate XP.
  const xp =
    experiences.reduce(
      (total, item) =>
        total + (visited.includes(item.id) ? item.reward : 0),
      0
    ) + (challengeCompleted ? 100 : 0);

  const level = Math.floor(xp / 200) + 1;
  const progress = xp % 200;
  const stars = visited.length;

  // Open a mission and count it as visited only once per session.
  function openExperience(id) {
    setPage(id);

    if (experiences.some((item) => item.id === id)) {
      setVisited((current) =>
        current.includes(id) ? current : [...current, id]
      );
    }
  }

  function startAdventure() {
    openExperience("museum");
  }

  function goHome() {
    setPage("home");
  }

  function completePainterChallenge() {
    setChallengeCompleted(true);
  }

  return (
    <main className="app game-app">
      {/* TOP NAVIGATION */}
      <header className="game-topbar">
        <button
          className="game-brand"
          onClick={goHome}
          aria-label="Museo home"
        >
          <span className="game-logo">M</span>

          <span className="game-brand-copy">
            <strong>
              MUSEO <span>3D</span>
            </strong>
            <small>YOUR GRAPHICS ADVENTURE</small>
          </span>
        </button>

        <nav className="game-nav" aria-label="Main navigation">
          <button
            className={
              page === "home"
                ? "game-nav-link selected"
                : "game-nav-link"
            }
            onClick={goHome}
          >
            🏠 Home
          </button>

          {experiences.map((item) => (
            <button
              key={item.id}
              className={
                page === item.id
                  ? "game-nav-link selected"
                  : "game-nav-link"
              }
              onClick={() => openExperience(item.id)}
            >
              {item.emoji} {item.title}
            </button>
          ))}
        </nav>

        <div className="player-pill">
          <span className="player-avatar">🧑‍🚀</span>
          <span>
            <strong>Explorer · Lv. {level}</strong>
            <small>⭐ {stars} / 3 missions visited</small>
          </span>
        </div>
      </header>

      {/* HOME PAGE */}
      {page === "home" && (
        <div className="game-home">
          <section className="adventure-hero">
            <div className="hero-copy">
              <div className="welcome-chip">
                <span className="pulse-dot" />
                YOUR NEXT ADVENTURE STARTS HERE
              </div>

              <h1>
                Play with shapes.
                <br />
                <span>Master the magic</span>
                <br />
                of 3D graphics!
              </h1>

              <p>
                Explore a colorful digital museum, solve rendering
                challenges, and discover the computer graphics
                concepts behind the magic.
              </p>

              <div className="hero-actions">
                <button
                  className="adventure-button"
                  onClick={startAdventure}
                >
                  🚀 Start Adventure <span>→</span>
                </button>

                <div className="hero-mini-stat">
                  <span>🎯</span>
                  <span>
                    <strong>4 quests</strong>
                    <small>Ready to explore</small>
                  </span>
                </div>
              </div>

              <div className="hero-features">
                <span>🎮 Learn by playing</span>
                <span>✨ Earn XP</span>
                <span>🧠 Build CG skills</span>
              </div>
            </div>

            <div
              className="hero-art"
              aria-label="Colorful 3D geometric shapes"
            >
              <div className="art-sun" />
              <div className="art-cloud cloud-one" />
              <div className="art-cloud cloud-two" />
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />

              <div className="floating-shape shape-cube">◆</div>
              <div className="floating-shape shape-ball">●</div>
              <div className="floating-shape shape-crystal">♦</div>
              <div className="floating-shape shape-star">✦</div>

              <div className="hero-platform platform-back" />
              <div className="hero-platform platform-front" />

              <div className="art-caption">
                WELCOME TO THE SHAPEVERSE
              </div>
            </div>
          </section>

          {/* PLAYER PROGRESS */}
          <section className="player-progress-panel">
            <div className="progress-welcome">
              <div className="progress-avatar">🧑‍🚀</div>

              <div>
                <span className="section-kicker">
                  YOUR ADVENTURE
                </span>
                <h2>Hey, Explorer! 👋</h2>
                <p>
                  Every experiment brings you one step closer to
                  graphics mastery.
                </p>
              </div>
            </div>

            <div className="progress-stats">
              <div className="progress-stat">
                <span>⭐</span>
                <strong>{stars}/3</strong>
                <small>Experiences visited</small>
              </div>

              <div className="progress-stat">
                <span>💎</span>
                <strong>{xp} XP</strong>
                <small>Total experience</small>
              </div>

              <div className="progress-stat">
                <span>🏆</span>
                <strong>Level {level}</strong>
                <small>{200 - progress} XP to next level</small>
              </div>
            </div>

            <div className="xp-progress">
              <div className="xp-progress-label">
                <span>LEVEL {level} PROGRESS</span>
                <strong>{progress}/200 XP</strong>
              </div>

              <div className="xp-track">
                <div
                  className="xp-fill"
                  style={{
                    width: `${(progress / 200) * 100}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* MISSION CARDS */}
          <section className="mission-section">
            <div className="mission-heading">
              <div>
                <span className="section-kicker">
                  CHOOSE YOUR PATH
                </span>
                <h2>
                  Adventure missions <span>🗺️</span>
                </h2>
                <p>
                  Pick an experience. Explore at your own pace.
                </p>
              </div>

              <span className="mission-count">
                {stars} OF 3 VISITED
              </span>
            </div>

            <div className="mission-grid">
              {experiences.map((item) => {
                const completed = visited.includes(item.id);

                return (
                  <article
                    className={`mission-card ${item.color}`}
                    key={item.id}
                  >
                    <div className="mission-card-top">
                      <span className="mission-number">
                        MISSION {item.number}
                      </span>

                      <span
                        className={
                          completed
                            ? "mission-status completed"
                            : "mission-status"
                        }
                      >
                        {completed ? "✓ VISITED" : "✦ READY"}
                      </span>
                    </div>

                    <div className="mission-illustration">
                      <span className="mission-orb orb-a" />
                      <span className="mission-orb orb-b" />

                      <span className="mission-emoji">
                        {item.emoji}
                      </span>

                      <span className="mission-spark spark-a">
                        ✦
                      </span>
                      <span className="mission-spark spark-b">
                        ✧
                      </span>
                    </div>

                    <div className="mission-card-copy">
                      <span className="mission-subtitle">
                        {item.subtitle}
                      </span>

                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>

                    <div className="mission-card-bottom">
                      <span className="reward-pill">
                        💎 +{item.reward} XP
                      </span>

                      <button
                        onClick={() => openExperience(item.id)}
                      >
                        {completed ? "Play again" : "Let's go"}{" "}
                        <span>→</span>
                      </button>
                    </div>
                  </article>
                );
              })}

              {/* BONUS PUZZLE */}
              <article className="mission-card lavender">
                <div className="mission-card-top">
                  <span className="mission-number">
                    BONUS QUEST
                  </span>

                  <span
                    className={
                      challengeCompleted
                        ? "mission-status completed"
                        : "mission-status"
                    }
                  >
                    {challengeCompleted
                      ? "✓ COMPLETED"
                      : "✦ NEW QUEST"}
                  </span>
                </div>

                <div className="mission-illustration">
                  <span className="mission-orb orb-a" />
                  <span className="mission-orb orb-b" />
                  <span className="mission-emoji">🧩</span>
                  <span className="mission-spark spark-a">✦</span>
                  <span className="mission-spark spark-b">✧</span>
                </div>

                <div className="mission-card-copy">
                  <span className="mission-subtitle">
                    Put your knowledge to the test
                  </span>

                  <h3>Painter's Puzzle</h3>
                  <p>
                    Arrange objects from farthest to nearest and earn
                    bonus XP.
                  </p>
                </div>

                <div className="mission-card-bottom">
                  <span className="reward-pill">💎 +100 XP</span>

                  <button onClick={() => setPage("challenge")}>
                    {challengeCompleted
                      ? "Play again"
                      : "Start quest"}{" "}
                    <span>→</span>
                  </button>
                </div>
              </article>
            </div>
          </section>

          {/* EXPLORER TIP */}
          <section className="game-tip">
            <div className="tip-icon">💡</div>

            <div>
              <span className="section-kicker">
                EXPLORER TIP
              </span>
              <h3>Think like a graphics engineer!</h3>
              <p>
                In Painter's Algorithm, farther objects are painted
                first. Then nearer objects are drawn over them.
                Can you predict the order?
              </p>
            </div>

            <button onClick={() => openExperience("lab")}>
              Try the challenge →
            </button>
          </section>
        </div>
      )}

      {/* MISSION 1: MUSEUM */}
      {page === "museum" && (
        <div className="experience-page">
          <button className="back-home-button" onClick={goHome}>
            ← Back to Adventure Hub
          </button>

          <section className="experience-intro">
            <span className="section-kicker">
              MISSION 01 · EXPLORE
            </span>

            <h1>
              Welcome to the <span>Shapeverse!</span> 🏛️
            </h1>

            <p>
              Explore the gallery and discover the beauty of 3D
              geometry.
            </p>
          </section>

          <section className="gallery game-gallery">
            <div className="gallery-heading">
              <div>
                <p className="eyebrow">YOUR FIRST STOP</p>
                <h3>The digital collection</h3>
              </div>

              <span className="live-label">
                🟢 INTERACTIVE 3D
              </span>
            </div>

            <div className="scene-frame">
              <MuseumScene />

              <div className="scene-hint">
                DRAG TO ORBIT · SCROLL TO ZOOM
              </div>

              <div className="exhibit-count">
                03 · DIGITAL ARTIFACTS
              </div>
            </div>
          </section>

          <section className="exhibit-cards">
            {artifacts.map((item) => (
              <article className="exhibit-card" key={item.number}>
                <span className="exhibit-index">{item.number}</span>

                <div className={`artifact-icon ${item.color}`}>
                  {item.symbol}
                </div>

                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </section>

          <section className="mission-next-panel">
            <div>
              <span className="section-kicker">
                READY FOR A CHALLENGE?
              </span>

              <h3>Let's paint the 3D world! 🎨</h3>

              <p>
                Discover how the Painter's Algorithm decides what gets
                drawn first.
              </p>
            </div>

            <button
              className="adventure-button"
              onClick={() => openExperience("lab")}
            >
              Start Mission 02 →
            </button>
          </section>
        </div>
      )}

      {/* MISSION 2: PAINTER LAB */}
      {page === "lab" && (
        <div className="experience-page">
          <button className="back-home-button" onClick={goHome}>
            ← Back to Adventure Hub
          </button>

          <div className="experience-intro">
            <span className="section-kicker">
              MISSION 02 · EXPERIMENT
            </span>

            <h1>
              The Painter <span>Challenge!</span> 🎨
            </h1>

            <p>
              Watch the drawing sequence and learn how back-to-front
              painting works.
            </p>
          </div>

          <PainterLab />

          <section className="mission-next-panel">
            <div>
              <span className="section-kicker">NEXT UP</span>
              <h3>Two renderers enter... ⚡</h3>
              <p>
                Compare Painter-style rendering with the depth buffer.
              </p>
            </div>

            <button
              className="adventure-button"
              onClick={() => openExperience("comparison")}
            >
              Start Mission 03 →
            </button>
          </section>
        </div>
      )}

      {/* MISSION 3: RENDERING COMPARISON */}
      {page === "comparison" && (
        <div className="experience-page">
          <button className="back-home-button" onClick={goHome}>
            ← Back to Adventure Hub
          </button>

          <div className="experience-intro">
            <span className="section-kicker">
              MISSION 03 · COMPARE
            </span>

            <h1>
              Renderer <span>Showdown!</span> ⚡
            </h1>

            <p>
              Explore two approaches to deciding which surfaces are
              visible.
            </p>
          </div>

          <RenderingComparison />

          <section className="mission-next-panel celebration-panel">
            <div>
              <span className="section-kicker">
                YOU'RE A GRAPHICS EXPLORER!
              </span>

              <h3>You've explored all three experiences! 🏆</h3>

              <p>
                Head back to your adventure hub to see your progress
                and revisit any mission.
              </p>
            </div>

            <button
              className="adventure-button"
              onClick={goHome}
            >
              View My Progress →
            </button>
          </section>
        </div>
      )}

      {/* BONUS MISSION: PAINTER'S PUZZLE */}
      {page === "challenge" && (
        <div className="experience-page">
          <button className="back-home-button" onClick={goHome}>
            ← Back to Adventure Hub
          </button>

          <div className="experience-intro">
            <span className="section-kicker">
              BONUS QUEST · LEVEL 1
            </span>

            <h1>
              The Painter's <span>Puzzle!</span> 🧩
            </h1>

            <p>
              Arrange the artifacts from farthest away to nearest to
              complete the challenge.
            </p>
          </div>

          <PainterChallenge
            onComplete={completePainterChallenge}
          />
        </div>
      )}

      {/* FOOTER */}
      <footer className="game-footer">
        <span>
          MUSEO 3D <span className="footer-separator">/</span> 2026
        </span>

        <span>
          Made for curious minds · Virtual Museum Object Rendering
          System
        </span>
      </footer>
    </main>
  );
}