import { useState, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { sortBackToFront } from "../algorithms/painterAlgorithm";
import { useProgress } from "../context/ProgressContext";
import KnowledgeQuiz from "./KnowledgeQuiz";
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Layers,
  Clock,
} from "lucide-react";

// Default initial objects for the laboratory
const INITIAL_LAB_OBJECTS = [
  {
    id: "azure-cube",
    name: "Azure Cube",
    shape: "box",
    color: "#06B6D4",
    initialPos: [-0.9, 0.2, -1.8],
    size: [1.6, 1.6, 1.6],
    description: "Deep background geometric anchor",
  },
  {
    id: "amber-sphere",
    name: "Golden Sphere",
    shape: "sphere",
    color: "#F59E0B",
    initialPos: [0.4, -0.3, -0.5],
    size: [1.0, 32, 32],
    description: "Mid-distance spherical geometry",
  },
  {
    id: "ruby-octa",
    name: "Ruby Octahedron",
    shape: "octahedron",
    color: "#F43F5E",
    initialPos: [-0.2, 0.5, 0.8],
    size: [1.1, 0],
    description: "Foreground faceted prism",
  },
  {
    id: "violet-torus",
    name: "Violet Torus",
    shape: "torus",
    color: "#8B5CF6",
    initialPos: [0.9, 0.0, 2.0],
    size: [0.75, 0.28, 16, 32],
    description: "Nearest foreground ring",
  },
];

// Cyclic overlap demo objects (Triangle A, B, C forming non-sortable cycle)
const CYCLIC_OBJECTS = [
  {
    id: "cycle-a",
    name: "Polygon Alpha (Red)",
    color: "#EF4444",
    position: [-0.6, 0.3, 0.2],
    rotation: [0, 0, 0.4],
    desc: "Overlaps Beta, but passes behind Gamma",
  },
  {
    id: "cycle-b",
    name: "Polygon Beta (Green)",
    color: "#10B981",
    position: [0.6, 0.3, -0.1],
    rotation: [0, 0, -0.4],
    desc: "Overlaps Gamma, but passes behind Alpha",
  },
  {
    id: "cycle-c",
    name: "Polygon Gamma (Blue)",
    color: "#3B82F6",
    position: [0.0, -0.6, 0.0],
    rotation: [0.3, 0, 0],
    desc: "Overlaps Alpha, but passes behind Beta",
  },
];

// 3D Scene for Standard Painter's Lab
function StandardLabScene({ objectsList, drawCount, activeIndex }) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 8]} intensity={2.0} color="#FFFFFF" />
      <pointLight position={[-4, 3, 2]} intensity={20} color="#22D3EE" />
      <pointLight position={[4, -2, 4]} intensity={25} color="#8B5CF6" />

      {/* Grid on the ground plane to show spatial depth */}
      <gridHelper args={[16, 16, "#334155", "#1E293B"]} position={[0, -2, 0]} />

      {/* Render objects in strict queue order without depth buffer testing */}
      {objectsList.map((item, index) => {
        const isVisible = index < drawCount;
        const isCurrentlyDrawing = index === activeIndex;

        return (
          <group key={item.id} position={item.position}>
            {/* 3D Geometry */}
            <mesh
              visible={isVisible}
              renderOrder={index + 1}
              castShadow={false}
              receiveShadow={false}
            >
              {item.shape === "box" && <boxGeometry args={item.size} />}
              {item.shape === "sphere" && <sphereGeometry args={item.size} />}
              {item.shape === "octahedron" && <octahedronGeometry args={item.size} />}
              {item.shape === "torus" && (
                <torusGeometry args={item.size} />
              )}

              {/* Crucial: depthTest and depthWrite are disabled to demonstrate pure Painter's Algorithm! */}
              <meshStandardMaterial
                color={item.color}
                emissive={isCurrentlyDrawing ? item.color : "#000000"}
                emissiveIntensity={isCurrentlyDrawing ? 0.6 : 0.05}
                roughness={0.25}
                metalness={0.3}
                depthTest={false}
                depthWrite={false}
              />
            </mesh>

            {/* Glowing bounding indicator when currently drawing */}
            {isCurrentlyDrawing && (
              <mesh renderOrder={index + 2}>
                <boxGeometry args={[2.2, 2.2, 2.2]} />
                <meshBasicMaterial
                  color="#22D3EE"
                  wireframe
                  transparent
                  opacity={0.8}
                  depthTest={false}
                  depthWrite={false}
                />
              </mesh>
            )}
          </group>
        );
      })}

      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        minDistance={5}
        maxDistance={15}
        enablePan={false}
      />
    </>
  );
}

// 3D Scene for the Cyclic Overlap Failure Case
function CyclicLabScene({ drawOrderMode }) {
  const orderedList = useMemo(() => {
    if (drawOrderMode === "bca") return [CYCLIC_OBJECTS[1], CYCLIC_OBJECTS[2], CYCLIC_OBJECTS[0]];
    if (drawOrderMode === "cab") return [CYCLIC_OBJECTS[2], CYCLIC_OBJECTS[0], CYCLIC_OBJECTS[1]];
    return CYCLIC_OBJECTS;
  }, [drawOrderMode]);

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} />

      {orderedList.map((poly, index) => (
        <mesh
          key={poly.id}
          position={poly.position}
          rotation={poly.rotation}
          renderOrder={index + 1}
        >
          <planeGeometry args={[2.2, 1.2]} />
          {/* Depth test disabled to demonstrate painter's cyclic clipping failure */}
          <meshStandardMaterial
            color={poly.color}
            side={THREE.DoubleSide}
            roughness={0.3}
            metalness={0.2}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      ))}

      <OrbitControls makeDefault target={[0, 0, 0]} minDistance={4} maxDistance={10} />
    </>
  );
}

export default function PainterLab() {
  const { markMissionVisited } = useProgress();

  // Mark mission visited
  useEffect(() => {
    markMissionVisited("lab");
  }, [markMissionVisited]);

  const [activeTab, setActiveTab] = useState("interactive"); // 'interactive' or 'failure-case'
  const [objectPositions, setObjectPositions] = useState(() =>
    INITIAL_LAB_OBJECTS.map((obj) => ({
      ...obj,
      position: [...obj.initialPos],
    }))
  );

  const [drawCount, setDrawCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per step
  const [cyclicOrder, setCyclicOrder] = useState("abc");

  // Camera reference position for depth calculation: camera at [0, 0, 8.5] pointing towards [0, 0, -1]
  const fixedCameraRef = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    cam.position.set(0, 0, 8.5);
    cam.lookAt(0, 0, 0);
    cam.updateMatrixWorld(true);
    return cam;
  }, []);

  // Compute depth for each object and sort back-to-front
  const sortedQueue = useMemo(() => {
    return sortBackToFront(objectPositions, fixedCameraRef);
  }, [objectPositions, fixedCameraRef]);

  // Automated playback step timer
  useEffect(() => {
    if (!isPlaying) return;

    if (drawCount >= sortedQueue.length) {
      // Don't call setState directly synchronously
      const endTimer = setTimeout(() => {
        setIsPlaying(false);
      }, 0);
      return () => clearTimeout(endTimer);
    }

    const timer = setTimeout(() => {
      setDrawCount((c) => {
        const next = c + 1;
        if (next >= sortedQueue.length) {
          setIsPlaying(false);
        }
        return Math.min(next, sortedQueue.length);
      });
    }, playbackSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, drawCount, sortedQueue.length, playbackSpeed]);

  // Controls
  function handlePlayPause() {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (drawCount >= sortedQueue.length) {
      setDrawCount(0);
    }
    setIsPlaying(true);
  }

  function handleStepForward() {
    setIsPlaying(false);
    setDrawCount((c) => Math.min(c + 1, sortedQueue.length));
  }

  function handleStepBackward() {
    setIsPlaying(false);
    setDrawCount((c) => Math.max(c - 1, 0));
  }

  function handleReset() {
    setIsPlaying(false);
    setDrawCount(0);
  }

  function handleDepthSliderChange(id, newZ) {
    setIsPlaying(false);
    setObjectPositions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, position: [item.position[0], item.position[1], parseFloat(newZ)] }
          : item
      )
    );
  }

  const activeIndex = drawCount > 0 ? drawCount - 1 : -1;
  const currentItem = activeIndex >= 0 && activeIndex < sortedQueue.length ? sortedQueue[activeIndex] : null;

  return (
    <div className="painter-lab-page">
      {/* HEADER */}
      <div className="experience-header">
        <div className="experience-kicker">
          <span className="kicker-badge">MISSION 02</span>
          <span>VISIBILITY DETERMINATION ALGORITHM</span>
        </div>
        <h1 className="experience-title">
          Painter's Algorithm <span className="gradient-text">Laboratory</span>
        </h1>
        <p className="experience-subtitle">
          Watch objects painted back-to-front along the camera ray. Manipulate depth coordinates in real time and discover why graphics engineers had to conquer overlapping geometries.
        </p>
      </div>

      {/* MODE TABS */}
      <div className="lab-mode-tabs">
        <button
          className={`mode-tab-btn ${activeTab === "interactive" ? "active" : ""}`}
          onClick={() => setActiveTab("interactive")}
        >
          <Sliders size={16} />
          <span>Interactive Depth Queue</span>
        </button>
        <button
          className={`mode-tab-btn ${activeTab === "failure-case" ? "active" : ""}`}
          onClick={() => setActiveTab("failure-case")}
        >
          <AlertTriangle size={16} />
          <span>The Cyclic Overlap Paradox (Failure Case)</span>
        </button>
      </div>

      {activeTab === "interactive" ? (
        <div className="lab-layout-grid">
          {/* 3D VIEWPORT */}
          <div className="lab-viewport-card">
            <div className="lab-viewport-header">
              <span className="live-pill">
                <span className="live-dot" /> LIVE 3D RASTERIZER (DEPTH BUFFER OFF)
              </span>
              <span className="step-counter">
                STEP {drawCount} OF {sortedQueue.length} PAINTED
              </span>
            </div>

            <div className="lab-canvas-container">
              <Canvas
                camera={{ position: [0, 1.2, 8.5], fov: 48 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true }}
              >
                <color attach="background" args={["#080C1A"]} />
                <StandardLabScene
                  objectsList={sortedQueue}
                  drawCount={drawCount}
                  activeIndex={activeIndex}
                />
              </Canvas>

              <div className="viewport-overlay-status">
                {drawCount === 0 && (
                  <span className="status-banner waiting">
                    Click "Play" or "Step Next" to begin rasterization queue
                  </span>
                )}
                {currentItem && drawCount < sortedQueue.length && (
                  <span className="status-banner drawing">
                    Currently Painting: <strong>{currentItem.name}</strong> (Depth: {currentItem.depth.toFixed(2)})
                  </span>
                )}
                {drawCount === sortedQueue.length && (
                  <span className="status-banner complete">
                    ✓ All objects rendered in back-to-front order!
                  </span>
                )}
              </div>
            </div>

            {/* PLAYBACK CONTROLS */}
            <div className="lab-controls-panel">
              <div className="playback-btns">
                <button
                  className="btn-futuristic btn-primary"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={16} /> Pause
                    </>
                  ) : drawCount >= sortedQueue.length ? (
                    <>
                      <RotateCcw size={16} /> Replay
                    </>
                  ) : (
                    <>
                      <Play size={16} /> Play Animation
                    </>
                  )}
                </button>

                <button
                  className="btn-futuristic btn-secondary"
                  onClick={handleStepBackward}
                  disabled={drawCount === 0 || isPlaying}
                >
                  ← Step Prev
                </button>

                <button
                  className="btn-futuristic btn-secondary"
                  onClick={handleStepForward}
                  disabled={drawCount >= sortedQueue.length || isPlaying}
                >
                  Step Next →
                </button>

                <button
                  className="btn-futuristic btn-ghost"
                  onClick={handleReset}
                  title="Reset Queue"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              <div className="speed-selector">
                <Clock size={14} />
                <span>Speed:</span>
                <button
                  className={`speed-btn ${playbackSpeed === 1500 ? "active" : ""}`}
                  onClick={() => setPlaybackSpeed(1500)}
                >
                  0.5x
                </button>
                <button
                  className={`speed-btn ${playbackSpeed === 1000 ? "active" : ""}`}
                  onClick={() => setPlaybackSpeed(1000)}
                >
                  1x
                </button>
                <button
                  className={`speed-btn ${playbackSpeed === 500 ? "active" : ""}`}
                  onClick={() => setPlaybackSpeed(500)}
                >
                  2x
                </button>
              </div>
            </div>
          </div>

          {/* DEPTH QUEUE & SLIDERS SIDEBAR */}
          <div className="lab-sidebar-card">
            <div className="sidebar-header">
              <h3>Render Queue (Back-to-Front)</h3>
              <p className="sidebar-desc">
                Surfaces sorted by scalar distance along camera viewing ray:
                <br />
                <code>d = (P_obj - P_cam) · v_fwd</code>
              </p>
            </div>

            <div className="queue-list">
              {sortedQueue.map((item, index) => {
                const isPainted = index < drawCount;
                const isCurrent = index === activeIndex;

                return (
                  <div
                    key={item.id}
                    className={`queue-item ${isCurrent ? "current" : isPainted ? "painted" : "waiting"}`}
                  >
                    <div className="queue-rank">{index + 1}</div>
                    <span
                      className="queue-color-swatch"
                      style={{ background: item.color }}
                    />
                    <div className="queue-info">
                      <div className="queue-name-row">
                        <strong>{item.name}</strong>
                        <span className="queue-depth-tag">
                          Depth: {item.depth.toFixed(2)}
                        </span>
                      </div>
                      <span className="queue-role">
                        {index === 0
                          ? "Farthest (Rendered 1st)"
                          : index === sortedQueue.length - 1
                          ? "Nearest (Overwrites All)"
                          : "Intermediate Depth"}
                      </span>
                    </div>

                    <div className="queue-status-tag">
                      {isCurrent ? "DRAWING" : isPainted ? "PAINTED" : "QUEUED"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DYNAMIC POSITION SLIDERS */}
            <div className="depth-sliders-section">
              <div className="slider-header-row">
                <Sliders size={14} />
                <h4>Interactive Depth Playground</h4>
              </div>
              <p className="slider-subtext">
                Drag any slider to change an object's Z position. Watch the render queue instantly re-sort in real time!
              </p>

              <div className="sliders-list">
                {objectPositions.map((obj) => (
                  <div key={obj.id} className="slider-group">
                    <div className="slider-label-row">
                      <span style={{ color: obj.color }}>● {obj.name}</span>
                      <span className="coord-val">Z: {obj.position[2].toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="-2.8"
                      max="2.8"
                      step="0.1"
                      value={obj.position[2]}
                      onChange={(e) => handleDepthSliderChange(obj.id, e.target.value)}
                      className="futuristic-slider"
                    />
                    <div className="slider-scale">
                      <span>Far (-2.8)</span>
                      <span>Near (+2.8)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FAILURE CASE DEMONSTRATION */
        <div className="failure-case-container">
          <div className="failure-card">
            <div className="failure-grid">
              <div className="failure-canvas-wrap">
                <Canvas
                  camera={{ position: [0, 0, 4.5], fov: 45 }}
                  dpr={[1, 1.5]}
                  gl={{ antialias: true }}
                >
                  <color attach="background" args={["#080C1A"]} />
                  <CyclicLabScene drawOrderMode={cyclicOrder} />
                </Canvas>
                <div className="failure-hint">
                  DRAG TO ROTATE SCENE · NOTICE INCORRECT OCCLUSION
                </div>
              </div>

              <div className="failure-explanation">
                <div className="failure-badge">
                  <AlertTriangle size={16} />
                  <span>ALGORITHM LIMITATION</span>
                </div>

                <h3>The Cyclic Overlap Conundrum</h3>
                <p>
                  Consider three overlapping triangles positioned in a cyclic arrangement:
                </p>
                <ul className="failure-list">
                  <li><strong>Polygon Alpha</strong> occludes <strong>Polygon Beta</strong></li>
                  <li><strong>Polygon Beta</strong> occludes <strong>Polygon Gamma</strong></li>
                  <li><strong>Polygon Gamma</strong> occludes <strong>Polygon Alpha</strong></li>
                </ul>

                <p>
                  There is <em>no valid back-to-front permutation</em> of these three surfaces! Whichever surface is painted last will erroneously cover the surface that should be in front of it.
                </p>

                <div className="failure-order-buttons">
                  <span className="order-picker-label">Try Alternate Draw Orders:</span>
                  <div className="btn-group">
                    <button
                      className={`btn-futuristic btn-sm ${cyclicOrder === "abc" ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => setCyclicOrder("abc")}
                    >
                      Draw A → B → C
                    </button>
                    <button
                      className={`btn-futuristic btn-sm ${cyclicOrder === "bca" ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => setCyclicOrder("bca")}
                    >
                      Draw B → C → A
                    </button>
                    <button
                      className={`btn-futuristic btn-sm ${cyclicOrder === "cab" ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => setCyclicOrder("cab")}
                    >
                      Draw C → A → B
                    </button>
                  </div>
                </div>

                <div className="solution-box">
                  <strong>The Historical Solution:</strong>
                  <p>
                    To resolve this in software rendering, algorithms like <strong>Newell's Algorithm</strong> or <strong>Binary Space Partitioning (BSP Trees)</strong> must cut polygons into smaller sub-triangles along the plane of intersection. This computationally heavy sorting drove the invention of hardware Z-buffering!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDUCATIONAL FOUNDATIONS SECTION */}
      <section className="lab-theory-section">
        <div className="theory-card">
          <div className="theory-header">
            <Layers size={18} />
            <h3>How Painter's Algorithm Works — Engineering Breakdown</h3>
          </div>

          <div className="theory-grid">
            <div className="theory-step">
              <span className="step-num">01</span>
              <h4>Depth Calculation</h4>
              <p>
                Every object or polygon center is projected onto the camera's forward viewing vector. Its scalar distance from the camera eye determines its depth value.
              </p>
            </div>

            <div className="theory-step">
              <span className="step-num">02</span>
              <h4>Sort in Object Space</h4>
              <p>
                The geometry array is sorted in descending order of depth (<code>O(N log N)</code> complexity). The surface with the largest positive distance is placed at index 0.
              </p>
            </div>

            <div className="theory-step">
              <span className="step-num">03</span>
              <h4>Back-to-Front Rasterization</h4>
              <p>
                The renderer paints surfaces sequentially into the frame buffer. Nearer objects paint their colors directly over earlier pixels, naturally occluding the background.
              </p>
            </div>

            <div className="theory-step">
              <span className="step-num">04</span>
              <h4>The Geometry Boundary Flaw</h4>
              <p>
                Because entire objects are drawn atomically, intersecting geometry where one part is in front and another is behind cannot be resolved without splitting the mesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KNOWLEDGE CHECK QUIZ */}
      <section className="lab-quiz-section">
        <KnowledgeQuiz
          quizId="quiz-lab"
          question="What is the primary computational limitation of Painter's Algorithm when applied to 3D meshes without polygon subdivision?"
          options={[
            "It requires massive amounts of extra video RAM compared to modern GPUs",
            "It cannot resolve intersecting geometry or cyclic overlaps where surfaces mutually occlude one another",
            "It cannot be executed on CPU software renderers",
            "It inverts normal vectors on metallic surfaces",
          ]}
          correctIndex={1}
          explanation="Correct! When two meshes penetrate one another or form a cyclic overlap (A occludes B, B occludes C, C occludes A), there is no single global depth order that correctly renders visibility without splitting the polygons."
          rewardXp={50}
        />
      </section>
    </div>
  );
}
