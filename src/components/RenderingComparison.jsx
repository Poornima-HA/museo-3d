import { useState, useMemo, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { sortBackToFront } from "../algorithms/painterAlgorithm";
import { useProgress } from "../context/ProgressContext";
import KnowledgeQuiz from "./KnowledgeQuiz";
import {
  Eye,
  Cpu,
} from "lucide-react";

// SCENE 1: Non-Intersecting Separated Cubes
const SEPARATED_EXHIBITS = [
  {
    id: "cyan-block",
    name: "Cyan Monolith",
    color: "#06B6D4",
    position: [-0.8, -0.2, -1.2],
    size: [1.8, 1.8, 1.8],
  },
  {
    id: "violet-block",
    name: "Violet Monolith",
    color: "#8B5CF6",
    position: [0.6, 0.1, 0.0],
    size: [1.8, 1.8, 1.8],
  },
  {
    id: "rose-block",
    name: "Rose Monolith",
    color: "#F43F5E",
    position: [-0.1, 0.4, 1.2],
    size: [1.8, 1.8, 1.8],
  },
];

// SCENE 2: Intersecting / Penetrating Geometry (Crucial CG Benchmark!)
const INTERSECTING_EXHIBITS = [
  {
    id: "slab-blue",
    name: "Blue Penetrating Slab",
    color: "#0284C7",
    position: [0, 0, -0.2],
    rotation: [0, Math.PI / 4, 0],
    size: [3.4, 2.2, 0.4],
  },
  {
    id: "slab-pink",
    name: "Pink Cross Slab",
    color: "#F43F5E",
    position: [0, 0, 0.2],
    rotation: [0, -Math.PI / 4, 0],
    size: [3.4, 2.2, 0.4],
  },
  {
    id: "gold-ring",
    name: "Amber Intersecting Torus",
    color: "#F59E0B",
    position: [0, 0, 0],
    rotation: [Math.PI / 2, 0, 0],
    size: [1.6, 0.22, 16, 48],
    isTorus: true,
  },
];

// 3D Meshes for Painter's Algorithm View (Depth test OFF, back-to-front render order)
function PainterScene({ exhibits, showDepthBuffer }) {
  const { camera } = useThree();

  const sorted = useMemo(() => {
    return sortBackToFront(exhibits, camera);
  }, [exhibits, camera]);

  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 6, 8]} intensity={2.2} />

      {sorted.map((item, index) => (
        <mesh
          key={item.id}
          position={item.position}
          rotation={item.rotation || [0, 0, 0]}
          renderOrder={index + 1}
        >
          {item.isTorus ? (
            <torusGeometry args={item.size} />
          ) : (
            <boxGeometry args={item.size} />
          )}

          {showDepthBuffer ? (
            <meshDepthMaterial depthPacking={THREE.BasicDepthPacking} />
          ) : (
            <meshStandardMaterial
              color={item.color}
              roughness={0.25}
              metalness={0.2}
              depthTest={false}
              depthWrite={false}
            />
          )}
        </mesh>
      ))}

      <OrbitControls makeDefault minDistance={4} maxDistance={14} enablePan={false} />
    </>
  );
}

// 3D Meshes for Z-Buffer View (Depth test ON, hardware per-fragment depth testing)
function ZBufferScene({ exhibits, showDepthBuffer }) {
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 6, 8]} intensity={2.2} />

      {exhibits.map((item) => (
        <mesh
          key={item.id}
          position={item.position}
          rotation={item.rotation || [0, 0, 0]}
        >
          {item.isTorus ? (
            <torusGeometry args={item.size} />
          ) : (
            <boxGeometry args={item.size} />
          )}

          {showDepthBuffer ? (
            <meshDepthMaterial depthPacking={THREE.BasicDepthPacking} />
          ) : (
            <meshStandardMaterial
              color={item.color}
              roughness={0.25}
              metalness={0.2}
              depthTest={true}
              depthWrite={true}
            />
          )}
        </mesh>
      ))}

      <OrbitControls makeDefault minDistance={4} maxDistance={14} enablePan={false} />
    </>
  );
}

export default function RenderingComparison() {
  const { markMissionVisited } = useProgress();

  useEffect(() => {
    markMissionVisited("comparison");
  }, [markMissionVisited]);

  const [scenario, setScenario] = useState("intersecting"); // 'separated' or 'intersecting'
  const [showDepthBuffer, setShowDepthBuffer] = useState(false);

  const activeExhibits = scenario === "separated" ? SEPARATED_EXHIBITS : INTERSECTING_EXHIBITS;

  return (
    <div className="showdown-page">
      {/* HEADER */}
      <div className="experience-header">
        <div className="experience-kicker">
          <span className="kicker-badge">MISSION 03</span>
          <span>SIDE-BY-SIDE RENDERER SHOWDOWN</span>
        </div>
        <h1 className="experience-title">
          Painter's Algorithm vs <span className="gradient-text">Hardware Z-Buffer</span>
        </h1>
        <p className="experience-subtitle">
          Two philosophies for visibility determination. Examine how back-to-front software sorting compares to the hardware depth testing used in modern GPUs.
        </p>
      </div>

      {/* BENCHMARK CONTROLS BAR */}
      <div className="showdown-controls-bar">
        <div className="scenario-toggles">
          <span className="control-label">BENCHMARK SCENARIO:</span>
          <button
            className={`btn-futuristic btn-sm ${scenario === "intersecting" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setScenario("intersecting")}
          >
            Intersecting Geometry (Stress Test)
          </button>
          <button
            className={`btn-futuristic btn-sm ${scenario === "separated" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setScenario("separated")}
          >
            Separated Geometry (Standard)
          </button>
        </div>

        <div className="depth-buffer-toggle">
          <button
            className={`tool-pill ${showDepthBuffer ? "active" : ""}`}
            onClick={() => setShowDepthBuffer(!showDepthBuffer)}
          >
            <Eye size={14} />
            <span>Grayscale Z-Buffer Mode: {showDepthBuffer ? "ACTIVE" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* DUAL VIEWPORTS (LEFT VS RIGHT) */}
      <div className="showdown-dual-grid">
        {/* LEFT: PAINTER'S ALGORITHM */}
        <div className="showdown-card painter-side">
          <div className="showdown-card-top">
            <div className="technique-identity">
              <span className="tech-badge badge-painter">SOFTWARE OBJECT SORT</span>
              <h3>Painter's Algorithm</h3>
            </div>
            <span className="pipeline-tag">Depth Testing: DISABLED</span>
          </div>

          <div className="showdown-canvas-wrap">
            <Canvas
              camera={{ position: [0, 1.2, 7.5], fov: 46 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true }}
            >
              <color attach="background" args={["#080C1A"]} />
              <PainterScene
                exhibits={activeExhibits}
                showDepthBuffer={showDepthBuffer}
              />
            </Canvas>

            <div className="canvas-callout callout-painter">
              {scenario === "intersecting" ? (
                <span>
                  ⚠️ <strong>ARTIFACT DETECTED:</strong> Whole objects are sorted by center. The slab behind paints completely over the intersecting foreground section!
                </span>
              ) : (
                <span>✓ Clean rendering: objects are clearly separated in depth.</span>
              )}
            </div>
          </div>

          <div className="technique-description">
            <p>
              Sorts objects in software from farthest to nearest, then rasterizes them sequentially into the color buffer. Newer fragments overwrite whatever was drawn before.
            </p>
          </div>
        </div>

        {/* RIGHT: Z-BUFFER */}
        <div className="showdown-card zbuffer-side">
          <div className="showdown-card-top">
            <div className="technique-identity">
              <span className="tech-badge badge-zbuffer">HARDWARE FRAGMENT PIPELINE</span>
              <h3>Z-Buffer Algorithm</h3>
            </div>
            <span className="pipeline-tag success">Depth Testing: ENABLED</span>
          </div>

          <div className="showdown-canvas-wrap">
            <Canvas
              camera={{ position: [0, 1.2, 7.5], fov: 46 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true }}
            >
              <color attach="background" args={["#080C1A"]} />
              <ZBufferScene
                exhibits={activeExhibits}
                showDepthBuffer={showDepthBuffer}
              />
            </Canvas>

            <div className="canvas-callout callout-zbuffer">
              {scenario === "intersecting" ? (
                <span>
                  ✓ <strong>PER-PIXEL ACCURACY:</strong> Each fragment compares depth against the 24-bit Z-buffer. The intersection line is pixel-perfect!
                </span>
              ) : (
                <span>✓ Pixel-level depth testing resolves visibility automatically.</span>
              )}
            </div>
          </div>

          <div className="technique-description">
            <p>
              Allocates a dedicated depth buffer storing floating-point Z values per pixel. As fragments are rasterized, only pixels closer than the stored depth update the frame.
            </p>
          </div>
        </div>
      </div>

      {/* TECHNICAL DEPTH BUFFER EXPLANATION */}
      {showDepthBuffer && (
        <div className="depth-buffer-explainer">
          <div className="explainer-inner">
            <div className="explainer-icon">
              <Cpu size={24} className="text-cyan" />
            </div>
            <div className="explainer-text">
              <h4>Understanding the 24-Bit Depth Buffer</h4>
              <p>
                In Grayscale Depth mode above, brightness represents camera-space depth. Pixels closer to the camera near plane are rendered lighter/whiter, while pixels farther toward the far plane are darker. Modern GPUs perform millions of per-pixel depth comparisons per second in hardware before writing color, completely bypassing the need for object-order sorting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ENGINEERING COMPARISON MATRIX */}
      <section className="comparison-matrix-section">
        <div className="section-header-compact">
          <h3>Architectural Comparison Matrix</h3>
          <p>Key technical differences between object-space sorting and screen-space depth buffering:</p>
        </div>

        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>ENGINEERING METRIC</th>
                <th>PAINTER'S ALGORITHM</th>
                <th>Z-BUFFER ALGORITHM</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Working Principle</strong></td>
                <td>Sorts objects/polygons in CPU space back-to-front; paints sequentially.</td>
                <td>Stores closest depth per pixel in hardware buffer during rasterization.</td>
              </tr>
              <tr>
                <td><strong>Computational Complexity</strong></td>
                <td><code>O(N log N)</code> sorting overhead, where N is polygon count.</td>
                <td><code>O(N)</code> geometry processing + <code>O(1)</code> constant-time depth test per pixel.</td>
              </tr>
              <tr>
                <td><strong>Memory Requirements</strong></td>
                <td>Zero additional buffer memory required (only color buffer).</td>
                <td>Requires dedicated depth buffer (typically 16-bit or 24-bit per pixel).</td>
              </tr>
              <tr>
                <td><strong>Intersecting Geometry</strong></td>
                <td><span className="badge-flaw">Fails</span> without cutting polygons into sub-meshes.</td>
                <td><span className="badge-pass">Native Support:</span> Resolves intersections at exact pixel boundaries.</td>
              </tr>
              <tr>
                <td><strong>Alpha Blending & Transparency</strong></td>
                <td><span className="badge-pass">Required:</span> Transparent surfaces must be painted back-to-front for correct alpha blending!</td>
                <td><span className="badge-flaw">Cannot Blend Alone:</span> Standard depth writing occludes transparent surfaces behind them.</td>
              </tr>
              <tr>
                <td><strong>Modern Production Use</strong></td>
                <td>Particle systems, glass sorting, 2D sprite rendering.</td>
                <td>Core graphics pipeline standard in OpenGL, DirectX, Vulkan, and WebGL.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* KNOWLEDGE CHECK QUIZ */}
      <section className="showdown-quiz-section">
        <KnowledgeQuiz
          quizId="quiz-comparison"
          question="Why do modern 3D game engines still use Painter's Algorithm sorting for transparent (alpha-blended) glass and particle surfaces even though they have a hardware Z-buffer?"
          options={[
            "Because Z-buffers are incompatible with floating-point colors",
            "Because alpha blending is order-dependent: background colors must already be in the frame buffer to compute (Color_src * Alpha) + (Color_dst * (1 - Alpha))",
            "Because Painter's Algorithm runs faster than GPU depth tests on mobile devices",
            "Because transparent polygons do not possess vertex normal vectors",
          ]}
          correctIndex={1}
          explanation="Brilliant! Alpha blending is non-commutative: the final color depends on the exact sequence of blend equations. If transparent objects write to the Z-buffer without back-to-front sorting, they block objects behind them without blending properly. Hence, modern engines render all opaque geometry with Z-buffering first, then render transparent geometry sorted back-to-front with Painter's order!"
          rewardXp={50}
        />
      </section>
    </div>
  );
}
