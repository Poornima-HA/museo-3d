import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useProgress } from "../context/ProgressContext";
import KnowledgeQuiz from "./KnowledgeQuiz";
import {
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

// Multi-Level Puzzle Datasets
const PUZZLE_LEVELS = [
  {
    id: "puzzle-1",
    levelNumber: 1,
    title: "Basic Depth Triad",
    description: "Arrange 3 artifacts from farthest to nearest along the camera ray.",
    cameraPos: [0, 0, 7.5],
    objects: [
      { id: "amber-sphere", name: "Amber Sphere", trueDepth: 2.5, color: "#F59E0B", shape: "sphere", size: [0.9, 32, 32], pos: [0.6, 0.2, -2.5] },
      { id: "cyan-cube", name: "Cyan Cube", trueDepth: 5.5, color: "#06B6D4", shape: "box", size: [1.3, 1.3, 1.3], pos: [-0.6, -0.2, -5.5] },
      { id: "ruby-octa", name: "Ruby Octahedron", trueDepth: 1.0, color: "#F43F5E", shape: "octa", size: [0.95, 0], pos: [0.1, 0.5, -1.0] },
    ],
  },
  {
    id: "puzzle-2",
    levelNumber: 2,
    title: "The Overlapping Quad",
    description: "Four overlapping geometric solids. Predict the exact back-to-front queue.",
    cameraPos: [0, 0, 8.5],
    objects: [
      { id: "purple-torus", name: "Violet Torus", trueDepth: 4.8, color: "#8B5CF6", shape: "torus", size: [0.75, 0.25, 16, 32], pos: [0.8, -0.3, -4.8] },
      { id: "emerald-prism", name: "Emerald Polyhedron", trueDepth: 1.6, color: "#10B981", shape: "octa", size: [1.1, 0], pos: [-0.4, 0.4, -1.6] },
      { id: "azure-block", name: "Azure Monolith", trueDepth: 6.2, color: "#0284C7", shape: "box", size: [1.6, 1.6, 1.6], pos: [-0.9, 0.1, -6.2] },
      { id: "amber-ball", name: "Golden Orb", trueDepth: 3.1, color: "#F59E0B", shape: "sphere", size: [0.85, 32, 32], pos: [0.2, -0.4, -3.1] },
    ],
  },
  {
    id: "puzzle-3",
    levelNumber: 3,
    title: "Master Depth Horizon",
    description: "Subtle depth gradients. Arrange the artifacts into a flawless visibility queue.",
    cameraPos: [0, 1.0, 9.0],
    objects: [
      { id: "ruby-gem", name: "Crimson Crystal", trueDepth: 3.4, color: "#E11D48", shape: "octa", size: [1.0, 0], pos: [-0.7, 0.6, -3.4] },
      { id: "gold-ring", name: "Solar Ring", trueDepth: 5.9, color: "#FBBF24", shape: "torus", size: [0.8, 0.22, 16, 32], pos: [0.5, 0.2, -5.9] },
      { id: "cyan-core", name: "Glacier Core", trueDepth: 7.8, color: "#22D3EE", shape: "box", size: [1.8, 1.8, 1.8], pos: [0.0, -0.5, -7.8] },
      { id: "violet-star", name: "Plasma Sphere", trueDepth: 1.2, color: "#C084FC", shape: "sphere", size: [0.75, 32, 32], pos: [0.6, -0.2, -1.2] },
    ],
  },
];

// 3D Scene that executes the user's arranged sequence without depth testing
function PuzzleSimulationScene({ userQueue, simulatedStep }) {
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 6, 8]} intensity={2.2} />

      {userQueue.map((item, index) => {
        const isDrawn = index <= simulatedStep;
        if (!isDrawn) return null;

        return (
          <mesh
            key={item.id}
            position={item.pos}
            renderOrder={index + 1}
          >
            {item.shape === "box" && <boxGeometry args={item.size} />}
            {item.shape === "sphere" && <sphereGeometry args={item.size} />}
            {item.shape === "octa" && <octahedronGeometry args={item.size} />}
            {item.shape === "torus" && <torusGeometry args={item.size} />}

            <meshStandardMaterial
              color={item.color}
              roughness={0.25}
              metalness={0.3}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      <OrbitControls makeDefault minDistance={4} maxDistance={14} enablePan={false} />
    </>
  );
}

export default function PainterChallenge() {
  const { completedPuzzleLevels, markPuzzleLevelComplete } = useProgress();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const activeLevel = PUZZLE_LEVELS[currentLevelIdx];

  // User's current arranged queue
  const [userQueue, setUserQueue] = useState(activeLevel.objects);
  const [feedback, setFeedback] = useState(null); // { isCorrect: bool, message: string }
  const [simulatedStep, setSimulatedStep] = useState(activeLevel.objects.length - 1);
  const [isSimulating, setIsSimulating] = useState(false);

  function handleSelectLevel(idx) {
    setCurrentLevelIdx(idx);
    const newLvl = PUZZLE_LEVELS[idx];
    setUserQueue([...newLvl.objects]);
    setFeedback(null);
    setSimulatedStep(newLvl.objects.length - 1);
    setIsSimulating(false);
  }

  // True back-to-front order (largest trueDepth first)
  const trueOrder = useMemo(() => {
    return [...activeLevel.objects].sort((a, b) => b.trueDepth - a.trueDepth);
  }, [activeLevel]);

  function moveItem(index, direction) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= userQueue.length) return;

    const updated = [...userQueue];
    [updated[index], updated[targetIdx]] = [updated[targetIdx], updated[index]];
    setUserQueue(updated);
    setFeedback(null);
    setSimulatedStep(updated.length - 1);
  }

  function handleSimulate() {
    setIsSimulating(true);
    setSimulatedStep(-1);

    let step = 0;
    const interval = setInterval(() => {
      setSimulatedStep(step);
      step++;
      if (step >= userQueue.length) {
        clearInterval(interval);
        setIsSimulating(false);
        verifyAnswer();
      }
    }, 700);
  }

  function verifyAnswer() {
    const isCorrect = userQueue.every((item, idx) => item.id === trueOrder[idx].id);

    if (isCorrect) {
      setFeedback({
        isCorrect: true,
        message: "Perfection! You successfully rasterized all surfaces in true back-to-front order! +50 XP Awarded.",
      });
      markPuzzleLevelComplete(activeLevel.id);
    } else {
      setFeedback({
        isCorrect: false,
        message: "Notice the occlusion flaw! A nearer object was covered by a surface drawn later. Reorder so the farthest object is first at index 1.",
      });
    }
  }

  function handleReset() {
    setUserQueue([...activeLevel.objects]);
    setFeedback(null);
    setSimulatedStep(activeLevel.objects.length - 1);
    setIsSimulating(false);
  }

  return (
    <div className="puzzle-page">
      {/* HEADER */}
      <div className="experience-header">
        <div className="experience-kicker">
          <span className="kicker-badge">BONUS QUEST</span>
          <span>SPATIAL REASONING CHALLENGE</span>
        </div>
        <h1 className="experience-title">
          The Painter's <span className="gradient-text">Puzzle Quest</span>
        </h1>
        <p className="experience-subtitle">
          Arrange overlapping 3D artifacts from farthest to nearest. Simulate your queue in real time to verify that your back-to-front drawing sequence avoids visual tearing.
        </p>
      </div>

      {/* LEVEL SELECTOR TABS */}
      <div className="puzzle-levels-bar">
        {PUZZLE_LEVELS.map((lvl, idx) => {
          const isDone = completedPuzzleLevels.includes(lvl.id);
          const isCurrent = idx === currentLevelIdx;

          return (
            <button
              key={lvl.id}
              className={`puzzle-lvl-btn ${isCurrent ? "active" : ""} ${isDone ? "completed" : ""}`}
              onClick={() => handleSelectLevel(idx)}
            >
              <span className="lvl-num">STAGE {lvl.levelNumber}</span>
              <span className="lvl-title">{lvl.title}</span>
              {isDone && <CheckCircle2 size={14} className="lvl-check" />}
            </button>
          );
        })}
      </div>

      {/* MAIN PUZZLE INTERACTION GRID */}
      <div className="puzzle-interaction-grid">
        {/* LEFT: 3D REAL-TIME SIMULATION VIEWPORT */}
        <div className="puzzle-viewport-card">
          <div className="puzzle-viewport-top">
            <span className="live-pill">
              <span className="live-dot" /> 3D RASTERIZER PREVIEW (DEPTH TEST OFF)
            </span>
            <span className="queue-status">
              {isSimulating ? `PAINTING STEP ${simulatedStep + 1}...` : "SIMULATION READY"}
            </span>
          </div>

          <div className="puzzle-canvas-wrap">
            <Canvas
              camera={{ position: activeLevel.cameraPos, fov: 46 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true }}
            >
              <color attach="background" args={["#080C1A"]} />
              <PuzzleSimulationScene
                userQueue={userQueue}
                simulatedStep={simulatedStep}
              />
            </Canvas>

            <div className="canvas-instruction-pill">
              <span>DRAG TO ORBIT · ARRANGE QUEUE ON RIGHT · HIT "SIMULATE" TO TEST</span>
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE ORDERING QUEUE */}
        <div className="puzzle-queue-card">
          <div className="queue-card-header">
            <div>
              <h3>Arrange Back-to-Front Queue</h3>
              <p>Top item (Rank 1) is painted first; bottom item is painted last.</p>
            </div>
            <div className="stage-reward-pill">
              <Sparkles size={14} />
              <span>+50 XP</span>
            </div>
          </div>

          <div className="queue-direction-indicator">
            <span>🌌 FARTHEST (DRAWN 1ST)</span>
            <span className="arrow-down">↓ OVERWRITTEN BY ↓</span>
            <span>👀 NEAREST (DRAWN LAST)</span>
          </div>

          <div className="puzzle-sortable-list">
            {userQueue.map((item, index) => (
              <div key={item.id} className="puzzle-sort-item">
                <div className="sort-rank-badge">{index + 1}</div>

                <div
                  className="sort-swatch"
                  style={{ background: item.color }}
                />

                <div className="sort-info">
                  <strong>{item.name}</strong>
                  <span className="depth-hint">
                    Distance: {item.trueDepth.toFixed(1)} units
                  </span>
                </div>

                <div className="sort-buttons">
                  <button
                    className="btn-sort-move"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0 || isSimulating}
                    aria-label={`Move ${item.name} upward`}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    className="btn-sort-move"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === userQueue.length - 1 || isSimulating}
                    aria-label={`Move ${item.name} downward`}
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SIMULATION & VERIFICATION CONTROLS */}
          <div className="puzzle-actions-bar">
            <button
              className="btn-futuristic btn-primary"
              onClick={handleSimulate}
              disabled={isSimulating}
            >
              <Play size={16} />
              <span>{isSimulating ? "Simulating Queue..." : "Simulate Painter's Algorithm"}</span>
            </button>

            <button
              className="btn-futuristic btn-secondary"
              onClick={handleReset}
              disabled={isSimulating}
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          {/* FEEDBACK STATUS BANNER */}
          {feedback && (
            <div className={`puzzle-feedback-banner ${feedback.isCorrect ? "success" : "error"}`}>
              {feedback.isCorrect ? (
                <>
                  <CheckCircle2 size={20} className="text-success" />
                  <div>
                    <strong>EXCELLENT SPATIAL REASONING!</strong>
                    <p>{feedback.message}</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={20} className="text-error" />
                  <div>
                    <strong>INCORRECT DRAW ORDER</strong>
                    <p>{feedback.message}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* QUIZ SECTION */}
      <section className="puzzle-quiz-section">
        <KnowledgeQuiz
          quizId="quiz-puzzle"
          question="Suppose Object X has a depth of 7.2 units and Object Y has a depth of 3.4 units relative to the camera. Which object must Painter's Algorithm draw first?"
          options={[
            "Object Y must be drawn first because it is nearer to the camera",
            "Object X must be drawn first because it is farther from the camera",
            "Both objects must be rendered simultaneously in parallel shaders",
            "Whichever object has the highest vertex count",
          ]}
          correctIndex={1}
          explanation="Correct! In Painter's Algorithm, distant background surfaces are drawn first (Object X at depth 7.2), so that nearer foreground objects (Object Y at depth 3.4) can naturally overwrite their pixels."
          rewardXp={50}
        />
      </section>
    </div>
  );
}
