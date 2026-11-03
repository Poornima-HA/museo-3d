import { useState } from "react";
import { useProgress } from "../context/ProgressContext";
import {
  Zap,
  CheckCircle2,
  Clock,
  RotateCcw,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function ProgressHub({ onNavigate }) {
  const {
    visitedMissions,
    completedPuzzleLevels,
    completedQuizzes,
    inspectedArtifacts,
    totalXp,
    level,
    levelProgress,
    currentRank,
    nextRank,
    resetProgress,
  } = useProgress();

  const [confirmReset, setConfirmReset] = useState(false);

  const missions = [
    {
      id: "museum",
      title: "Virtual Museum Gallery",
      category: "Spatial Geometry & Shading",
      xp: 100,
      isCompleted: visitedMissions.includes("museum"),
    },
    {
      id: "lab",
      title: "Painter's Algorithm Lab",
      category: "Back-to-Front Depth Sorting",
      xp: 150,
      isCompleted: visitedMissions.includes("lab"),
    },
    {
      id: "comparison",
      title: "Renderer Showdown",
      category: "Painter's vs Hardware Z-Buffer",
      xp: 200,
      isCompleted: visitedMissions.includes("comparison"),
    },
    {
      id: "puzzle",
      title: "The Painter's Puzzle Quest",
      category: "Multi-Stage Spatial Challenge",
      xp: 150,
      isCompleted: completedPuzzleLevels.length === 3,
      details: `${completedPuzzleLevels.length} of 3 Stages Cleared`,
    },
  ];

  const badges = [
    {
      title: "Spatial Pioneer",
      description: "Inspected artifacts in the 3D Virtual Museum",
      icon: "🏛️",
      unlocked: inspectedArtifacts.length >= 1,
    },
    {
      title: "Depth Sorter",
      description: "Operated the Painter's Algorithm step-by-step queue",
      icon: "🎨",
      unlocked: visitedMissions.includes("lab"),
    },
    {
      title: "Buffer Analyst",
      description: "Explored per-pixel depth testing vs software sort",
      icon: "⚡",
      unlocked: visitedMissions.includes("comparison"),
    },
    {
      title: "Puzzle Master",
      description: "Solved all 3 Painter's Puzzle stages",
      icon: "🧩",
      unlocked: completedPuzzleLevels.length >= 3,
    },
    {
      title: "CG Scholar",
      description: "Answered multiple computer graphics knowledge checks",
      icon: "🎓",
      unlocked: completedQuizzes.length >= 2,
    },
    {
      title: "Graphics Virtuoso",
      description: "Earned over 600 total experience points",
      icon: "🏆",
      unlocked: totalXp >= 600,
    },
  ];

  return (
    <div className="progress-hub-page">
      {/* HEADER */}
      <div className="experience-header">
        <div className="experience-kicker">
          <span className="kicker-badge">ACADEMY PROFILE</span>
          <span>LEARNING JOURNEY & CREDENTIALS</span>
        </div>
        <h1 className="experience-title">
          Explorer <span className="gradient-text">Progress Hub</span>
        </h1>
        <p className="experience-subtitle">
          Track your computer graphics achievements, review mission completions, and inspect your mastery of visibility determination algorithms.
        </p>
      </div>

      {/* OVERVIEW HERO CARD */}
      <div className="profile-hero-card">
        <div className="profile-hero-main">
          <div className="profile-avatar-box">
            <span className="avatar-icon">{currentRank.badge}</span>
            <div className="avatar-level-tag">Lv. {level}</div>
          </div>

          <div className="profile-hero-copy">
            <div className="rank-eyebrow">ACTIVE RANK</div>
            <h2 className="rank-title">{currentRank.title}</h2>
            <p className="rank-desc">{currentRank.description}</p>
          </div>

          <div className="profile-xp-pill">
            <Zap size={22} className="text-cyan" />
            <div className="xp-pill-text">
              <span className="xp-num">{totalXp}</span>
              <span className="xp-label">TOTAL XP</span>
            </div>
          </div>
        </div>

        {/* PROGRESS TO NEXT RANK */}
        <div className="profile-level-progress">
          <div className="progress-label-row">
            <span>
              {nextRank ? (
                <>Next Rank: <strong>{nextRank.title}</strong> (Requires {nextRank.minXp} XP)</>
              ) : (
                <strong>Highest Rank Achieved!</strong>
              )}
            </span>
            <span className="percentage-text">
              {Math.round(levelProgress * 100)}% of current level
            </span>
          </div>

          <div className="progress-track-outer">
            <div
              className="progress-track-fill"
              style={{ width: `${levelProgress * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* MISSIONS STATUS CHECKLIST */}
      <section className="hub-missions-section">
        <div className="section-header-compact">
          <h3>Mission Status Checklist</h3>
          <p>Verified laboratory completions and XP rewards:</p>
        </div>

        <div className="hub-missions-grid">
          {missions.map((m) => (
            <div key={m.id} className={`hub-mission-item ${m.isCompleted ? "done" : "pending"}`}>
              <div className="mission-status-col">
                {m.isCompleted ? (
                  <CheckCircle2 size={24} className="text-success" />
                ) : (
                  <Clock size={24} className="text-muted" />
                )}
              </div>

              <div className="mission-info-col">
                <span className="mission-cat">{m.category}</span>
                <h4 className="mission-name">{m.title}</h4>
                {m.details && <span className="mission-details-tag">{m.details}</span>}
              </div>

              <div className="mission-reward-col">
                <div className="xp-chip">
                  <Zap size={14} />
                  <span>+{m.xp} XP</span>
                </div>

                <button
                  className="btn-futuristic btn-secondary btn-sm"
                  onClick={() => onNavigate(m.id)}
                >
                  {m.isCompleted ? "Revisit" : "Launch"} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UNLOCKED BADGES SECTION */}
      <section className="hub-badges-section">
        <div className="section-header-compact">
          <h3>Computer Graphics Badges</h3>
          <p>Earn badges by exploring scenes, inspecting meshes, and completing challenges:</p>
        </div>

        <div className="badges-grid">
          {badges.map((b, i) => (
            <div key={i} className={`badge-card ${b.unlocked ? "unlocked" : "locked"}`}>
              <div className="badge-icon-wrap">
                <span className="badge-symbol">{b.icon}</span>
              </div>
              <h4 className="badge-title">{b.title}</h4>
              <p className="badge-desc">{b.description}</p>
              <span className="badge-state-label">
                {b.unlocked ? "✓ UNLOCKED" : "LOCKED"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* COMPUTER GRAPHICS STUDY SUMMARY SHEET */}
      <section className="hub-study-guide">
        <div className="study-guide-card">
          <div className="study-header">
            <BookOpen size={20} className="text-cyan" />
            <h3>Computer Graphics Visibility Determination — Key Formulas</h3>
          </div>

          <div className="study-grid">
            <div className="study-box">
              <h4>1. Camera-Space Depth Formula</h4>
              <p>
                To sort objects back-to-front, project the vector from camera eye P_cam to object center P_obj onto the camera forward vector v_fwd:
              </p>
              <code>d = (P_obj - P_cam) · v_fwd</code>
            </div>

            <div className="study-box">
              <h4>2. Hardware Z-Buffer Condition</h4>
              <p>
                During rasterization, each incoming fragment z_frag is compared against the stored buffer depth z_buf[x, y]:
              </p>
              <code>if (z_frag &lt; z_buf[x, y]) &#123; z_buf[x,y] = z_frag; frame[x,y] = color; &#125;</code>
            </div>

            <div className="study-box">
              <h4>3. Alpha Blending Formulation</h4>
              <p>
                Transparent surfaces cannot use standard depth buffers alone because blending is order-dependent:
              </p>
              <code>C_final = C_src · α + C_dst · (1 - α)</code>
            </div>

            <div className="study-box">
              <h4>4. Newell's Five-Step Test</h4>
              <p>
                Software Painter's sorting tests bounding boxes in X, Y, and Z planes before executing polygon splitting if cycles occur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RESET PROGRESS UTILITY */}
      <div className="reset-section">
        {confirmReset ? (
          <div className="reset-confirm-box">
            <span>Are you sure you want to reset all earned XP, visited missions, and badges?</span>
            <div className="btn-group">
              <button
                className="btn-futuristic btn-primary btn-sm"
                onClick={() => {
                  resetProgress();
                  setConfirmReset(false);
                }}
              >
                Yes, Reset Everything
              </button>
              <button
                className="btn-futuristic btn-secondary btn-sm"
                onClick={() => setConfirmReset(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="btn-futuristic btn-ghost btn-sm"
            onClick={() => setConfirmReset(true)}
          >
            <RotateCcw size={14} />
            <span>Reset Learning Progress (Testing Only)</span>
          </button>
        )}
      </div>
    </div>
  );
}
