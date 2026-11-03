import { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { useProgress } from "../context/ProgressContext";
import KnowledgeQuiz from "./KnowledgeQuiz";
import {
  Box,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Eye,
  Camera,
  RotateCw,
} from "lucide-react";

// Exhibit Data with rich computer graphics engineering metadata
const EXHIBITS_DATA = [
  {
    id: "monolith",
    index: "01",
    title: "The Quantum Monolith",
    subtitle: "Spatial Primitives & Lattice Geometry",
    position: [-4.2, 0, -1.2],
    cameraTarget: [-4.2, 2.1, -1.2],
    cameraPos: [-4.2, 3.2, 3.5],
    color: "#22D3EE",
    pedestalGlow: "#0891B2",
    vertices: 48,
    polygons: 36,
    materialType: "PBR Metallic-Roughness (Cyan)",
    cgFocus: "Vertex transformations, normal vectors, and wireframe rasterization",
    description:
      "A nested geometric construct exploring how modern graphics engines transform local object coordinates into world space. Its outer lattice reveals the underlying polygonal edges computed by the vertex processing pipeline.",
    technicalDeepDive:
      "Every 3D object begins as an array of vertex coordinates in local model space. To render this monolith, the vertex shader multiplies each vertex by the Model-View-Projection (MVP) matrix: V_clip = M_proj * M_view * M_model * V_local. Notice the crisp polygonal edges when wireframe is enabled.",
  },
  {
    id: "mobius",
    index: "02",
    title: "The Golden Möbius",
    subtitle: "Parametric Torus Knot & Metallic BRDF",
    position: [0, 0, -2.4],
    cameraTarget: [0, 2.1, -2.4],
    cameraPos: [0, 3.2, 2.2],
    color: "#F59E0B",
    pedestalGlow: "#D97706",
    vertices: 2560,
    polygons: 1280,
    materialType: "High-Anisotropy Metallic Specular",
    cgFocus: "Parametric surface equations, tangent spaces, and specular highlights",
    description:
      "An intricate continuous torus knot governed by trigonometric parametric equations. Its smooth gold skin reflects light using modern microfacet Bidirectional Reflectance Distribution Functions (BRDF).",
    technicalDeepDive:
      "Unlike simple cubes, curved surfaces require vertex normals to be interpolated across faces using Phong normal interpolation: N_pixel = normalize(lerp(N_a, N_b, N_c)). This gives the illusion of a perfectly smooth curve despite being composed of finite planar quads and triangles.",
  },
  {
    id: "ruby",
    index: "03",
    title: "The Ruby Polyhedron",
    subtitle: "Faceted Octahedron & Flat Shading",
    position: [4.2, 0, -1.2],
    cameraTarget: [4.2, 2.1, -1.2],
    cameraPos: [4.2, 3.2, 3.5],
    color: "#F43F5E",
    pedestalGlow: "#BE123C",
    vertices: 24,
    polygons: 16,
    materialType: "Translucent Refractive Crystal (Flat Shaded)",
    cgFocus: "Flat shading vs Gouraud shading, face normal calculation",
    description:
      "A pristine crystalline octahedron featuring intentional flat shading. Each triangular facet receives a single constant color computed from the surface normal of that specific polygon.",
    technicalDeepDive:
      "In flat shading, the face normal is computed via the cross product of two edge vectors: N_face = (V_1 - V_0) x (V_2 - V_0). Because adjacent faces do not share smoothed normals, sharp specular boundaries appear between facets, demonstrating the distinct visual signature of early 1970s rendering.",
  },
  {
    id: "gyroscope",
    index: "04",
    title: "The Celestial Gyroscope",
    subtitle: "Hierarchical Kinematic Transform Chains",
    position: [0, 0, 2.6],
    cameraTarget: [0, 2.1, 2.6],
    cameraPos: [0, 3.6, 7.2],
    color: "#8B5CF6",
    pedestalGlow: "#6D28D9",
    vertices: 3840,
    polygons: 1920,
    materialType: "Emissive Core + Polished Titanium Rings",
    cgFocus: "Hierarchical scene graphs, Euler rotations, and transform matrices",
    description:
      "Concentric rotating gimbal rings illustrating hierarchical coordinate transformations. Each ring's orientation is computed relative to its parent frame in the scene graph.",
    technicalDeepDive:
      "In 3D game engines, objects are organized into parent-child tree hierarchies. The global transform matrix of each ring is the recursive product of its local transform with all its ancestor matrices: M_world = M_parent * M_local. This prevents gimbal lock and allows complex orbital kinematics.",
  },
];

// Interactive Pedestal Component
function Pedestal({ position, glowColor, isSelected, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      {/* Base Plinth */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.15, 0.3, 32]} />
        <meshStandardMaterial color="#0F172A" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Main Column */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.85, 1.0, 32]} />
        <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Glowing Indicator Ring */}
      <mesh position={[0, 1.32, 0]}>
        <torusGeometry args={[0.78, 0.04, 16, 32]} />
        <meshBasicMaterial
          color={isSelected ? "#22D3EE" : glowColor}
          toneMapped={false}
        />
      </mesh>

      {/* Top Deck Surface */}
      <mesh position={[0, 1.35, 0]} receiveShadow>
        <cylinderGeometry args={[0.82, 0.82, 0.08, 32]} />
        <meshStandardMaterial
          color={isSelected ? "#1E1B4B" : "#0B0F19"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Selection Spotlight Indicator on Floor */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.35, 32]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

// 3D Exhibit Meshes
function MonolithMesh({ wireframe, autoRotate }) {
  const ref = useRef();
  const innerRef = useRef();

  useFrame((_, delta) => {
    if (autoRotate && ref.current) {
      ref.current.rotation.y += delta * 0.4;
      ref.current.rotation.x += delta * 0.2;
    }
    if (autoRotate && innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.7;
    }
  });

  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color="#22D3EE"
          emissive="#0891B2"
          emissiveIntensity={0.2}
          metalness={0.85}
          roughness={0.18}
          wireframe={wireframe}
        />
      </mesh>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#A5F3FC"
          emissive="#06B6D4"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

function MobiusMesh({ wireframe, autoRotate }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (autoRotate && ref.current) {
      ref.current.rotation.z += delta * 0.4;
      ref.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={ref} rotation={[Math.PI / 3, 0.2, 0]}>
      <mesh castShadow>
        <torusKnotGeometry args={[0.65, 0.22, 128, 32]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#B45309"
          emissiveIntensity={0.25}
          metalness={0.92}
          roughness={0.15}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

function RubyMesh({ wireframe, autoRotate }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (autoRotate && ref.current) {
      ref.current.rotation.y += delta * 0.5;
      ref.current.rotation.x += delta * 0.25;
    }
  });

  return (
    <group ref={ref} rotation={[0.2, 0.4, 0]}>
      <mesh castShadow>
        <octahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#F43F5E"
          emissive="#9F1239"
          emissiveIntensity={0.3}
          metalness={0.4}
          roughness={0.1}
          flatShading
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

function GyroscopeMesh({ wireframe, autoRotate }) {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame((_, delta) => {
    if (autoRotate) {
      if (ring1.current) ring1.current.rotation.x += delta * 0.7;
      if (ring2.current) ring2.current.rotation.y += delta * 0.5;
      if (ring3.current) ring3.current.rotation.z += delta * 0.9;
    }
  });

  return (
    <group>
      {/* Outer Ring */}
      <mesh ref={ring1}>
        <torusGeometry args={[0.95, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#8B5CF6"
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
      {/* Middle Ring */}
      <mesh ref={ring2} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.75, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#A78BFA"
          metalness={0.85}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
      {/* Inner Ring */}
      <mesh ref={ring3} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[0.55, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#C4B5FD"
          metalness={0.8}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
      {/* Glowing Central Sphere */}
      <mesh>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial
          color="#DDD6FE"
          emissive="#7C3AED"
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// Museum Architectural Room
function MuseumGalleryInterior({ selectedExhibitId, onSelectExhibit, wireframe, autoRotate }) {
  return (
    <>
      {/* Atmospheric Lighting */}
      <ambientLight intensity={0.4} color="#0B132B" />
      <directionalLight
        position={[6, 12, 8]}
        intensity={1.8}
        color="#F8FAFC"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Exhibit Spotlights */}
      <pointLight position={[-4.2, 5, -1.2]} intensity={25} color="#22D3EE" distance={10} />
      <pointLight position={[0, 5, -2.4]} intensity={25} color="#F59E0B" distance={10} />
      <pointLight position={[4.2, 5, -1.2]} intensity={25} color="#F43F5E" distance={10} />
      <pointLight position={[0, 5, 2.6]} intensity={25} color="#8B5CF6" distance={10} />

      {/* Gallery Floor with subtle reflective grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#080D1A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Floor Grid Lines */}
      <gridHelper args={[28, 28, "#1E293B", "#0F172A"]} position={[0, 0.005, 0]} />

      {/* Perimeter Walls */}
      <mesh position={[0, 5, -8]} receiveShadow>
        <boxGeometry args={[28, 10, 0.4]} />
        <meshStandardMaterial color="#0A0F1D" roughness={0.7} />
      </mesh>
      <mesh position={[-12, 5, 0]}>
        <boxGeometry args={[0.4, 10, 24]} />
        <meshStandardMaterial color="#090E1B" roughness={0.7} />
      </mesh>
      <mesh position={[12, 5, 0]}>
        <boxGeometry args={[0.4, 10, 24]} />
        <meshStandardMaterial color="#090E1B" roughness={0.7} />
      </mesh>

      {/* Back Wall Glow Strips */}
      <mesh position={[0, 4.5, -7.78]}>
        <planeGeometry args={[24, 0.08]} />
        <meshBasicMaterial color="#22D3EE" />
      </mesh>
      <mesh position={[0, 5.5, -7.78]}>
        <planeGeometry args={[24, 0.05]} />
        <meshBasicMaterial color="#8B5CF6" />
      </mesh>

      {/* EXHIBIT 01: MONOLITH */}
      <Pedestal
        position={[-4.2, 0, -1.2]}
        glowColor="#22D3EE"
        isSelected={selectedExhibitId === "monolith"}
        onClick={() => onSelectExhibit("monolith")}
      />
      <group position={[-4.2, 2.15, -1.2]} onClick={() => onSelectExhibit("monolith")}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
          <MonolithMesh
            wireframe={selectedExhibitId === "monolith" ? wireframe : false}
            autoRotate={autoRotate}
          />
        </Float>
      </group>

      {/* EXHIBIT 02: MOBIUS */}
      <Pedestal
        position={[0, 0, -2.4]}
        glowColor="#F59E0B"
        isSelected={selectedExhibitId === "mobius"}
        onClick={() => onSelectExhibit("mobius")}
      />
      <group position={[0, 2.15, -2.4]} onClick={() => onSelectExhibit("mobius")}>
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.2}>
          <MobiusMesh
            wireframe={selectedExhibitId === "mobius" ? wireframe : false}
            autoRotate={autoRotate}
          />
        </Float>
      </group>

      {/* EXHIBIT 03: RUBY */}
      <Pedestal
        position={[4.2, 0, -1.2]}
        glowColor="#F43F5E"
        isSelected={selectedExhibitId === "ruby"}
        onClick={() => onSelectExhibit("ruby")}
      />
      <group position={[4.2, 2.15, -1.2]} onClick={() => onSelectExhibit("ruby")}>
        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.2}>
          <RubyMesh
            wireframe={selectedExhibitId === "ruby" ? wireframe : false}
            autoRotate={autoRotate}
          />
        </Float>
      </group>

      {/* EXHIBIT 04: GYROSCOPE */}
      <Pedestal
        position={[0, 0, 2.6]}
        glowColor="#8B5CF6"
        isSelected={selectedExhibitId === "gyroscope"}
        onClick={() => onSelectExhibit("gyroscope")}
      />
      <group position={[0, 2.15, 2.6]} onClick={() => onSelectExhibit("gyroscope")}>
        <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.1}>
          <GyroscopeMesh
            wireframe={selectedExhibitId === "gyroscope" ? wireframe : false}
            autoRotate={autoRotate}
          />
        </Float>
      </group>
    </>
  );
}

// Camera controller that smoothly animates target and position
function CameraRig({ selectedExhibit }) {
  const controlsRef = useRef();

  useEffect(() => {
    if (!controlsRef.current) return;
    if (selectedExhibit) {
      controlsRef.current.target.set(...selectedExhibit.cameraTarget);
    } else {
      controlsRef.current.target.set(0, 1.8, 0);
    }
  }, [selectedExhibit]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minDistance={2.5}
      maxDistance={18}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minPolarAngle={Math.PI / 6}
      enableDamping
      dampingFactor={0.06}
    />
  );
}

export default function MuseumScene() {
  const { markMissionVisited, markArtifactInspected, inspectedArtifacts } = useProgress();
  const [selectedId, setSelectedId] = useState(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // Mark mission visited on mount
  useEffect(() => {
    markMissionVisited("museum");
  }, [markMissionVisited]);

  const selectedExhibit = useMemo(
    () => EXHIBITS_DATA.find((e) => e.id === selectedId) || null,
    [selectedId]
  );

  function handleSelect(id) {
    setSelectedId(id);
    if (id) {
      markArtifactInspected(id);
    }
  }

  function handleNext() {
    const idx = EXHIBITS_DATA.findIndex((e) => e.id === selectedId);
    const nextIdx = (idx + 1) % EXHIBITS_DATA.length;
    handleSelect(EXHIBITS_DATA[nextIdx].id);
  }

  function handlePrev() {
    const idx = EXHIBITS_DATA.findIndex((e) => e.id === selectedId);
    const prevIdx = (idx - 1 + EXHIBITS_DATA.length) % EXHIBITS_DATA.length;
    handleSelect(EXHIBITS_DATA[prevIdx].id);
  }

  return (
    <div className="museum-page">
      {/* HEADER SECTION */}
      <div className="experience-header">
        <div className="experience-kicker">
          <span className="kicker-badge">MISSION 01</span>
          <span>SPATIAL EXPLORATION & MATERIALS</span>
        </div>
        <h1 className="experience-title">
          Virtual Museum <span className="gradient-text">Gallery</span>
        </h1>
        <p className="experience-subtitle">
          Inspect 3D geometric artifacts in real time. Examine how vertex transformations, normal vectors, and material shaders create photorealistic digital forms.
        </p>
      </div>

      {/* 3D CANVAS & INTERACTION CONTAINER */}
      <div className="museum-viewport-card">
        {/* VIEWPORT CONTROLS BAR */}
        <div className="viewport-topbar">
          <div className="camera-presets">
            <span className="preset-label">
              <Camera size={14} /> PERSPECTIVE:
            </span>
            <button
              className={`preset-btn ${!selectedId ? "active" : ""}`}
              onClick={() => handleSelect(null)}
            >
              Overview
            </button>
            {EXHIBITS_DATA.map((item) => (
              <button
                key={item.id}
                className={`preset-btn ${selectedId === item.id ? "active" : ""}`}
                onClick={() => handleSelect(item.id)}
              >
                {item.title.split(" ")[1] || item.title}
              </button>
            ))}
          </div>

          <div className="viewport-actions">
            <button
              className={`tool-pill ${wireframe ? "active" : ""}`}
              onClick={() => setWireframe(!wireframe)}
              title="Toggle Mesh Wireframe"
            >
              <Box size={14} />
              <span>Wireframe: {wireframe ? "ON" : "OFF"}</span>
            </button>
            <button
              className={`tool-pill ${autoRotate ? "active" : ""}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto Rotation"
            >
              <RotateCw size={14} />
              <span>Rotate: {autoRotate ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>

        {/* 3D WEBGL CANVAS */}
        <div className="museum-canvas-wrap">
          <Canvas
            shadows
            camera={{ position: [0, 4.8, 11], fov: 48 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false }}
          >
            <color attach="background" args={["#080B18"]} />
            <MuseumGalleryInterior
              selectedExhibitId={selectedId}
              onSelectExhibit={handleSelect}
              wireframe={wireframe}
              autoRotate={autoRotate}
            />
            <CameraRig selectedExhibit={selectedExhibit} />
          </Canvas>

          {/* INTERACTION HINT OVERLAY */}
          <div className="canvas-hud-hint">
            <span className="pulse-dot" />
            <span>
              {selectedExhibit
                ? `INSPECTING ${selectedExhibit.title.toUpperCase()} · ORBIT TO INSPECT ALL SIDES`
                : "CLICK ANY ARTIFACT OR PEDESTAL TO FOCUS CAMERA · DRAG TO ORBIT · SCROLL TO ZOOM"}
            </span>
          </div>

          {/* ARTIFACT INSPECTOR OVERLAY PANEL */}
          {selectedExhibit && (
            <div className="artifact-inspector-drawer">
              <div className="drawer-header">
                <div className="drawer-badge">
                  <span>EXHIBIT {selectedExhibit.index}</span>
                  <span className="drawer-dot" style={{ background: selectedExhibit.color }} />
                </div>
                <button
                  className="drawer-close-btn"
                  onClick={() => handleSelect(null)}
                  aria-label="Close Inspector"
                >
                  ✕
                </button>
              </div>

              <h3 className="drawer-title">{selectedExhibit.title}</h3>
              <p className="drawer-subtitle">{selectedExhibit.subtitle}</p>

              <div className="drawer-metrics">
                <div className="metric-cell">
                  <span className="metric-label">VERTICES</span>
                  <strong className="metric-value">{selectedExhibit.vertices}</strong>
                </div>
                <div className="metric-cell">
                  <span className="metric-label">POLYGONS</span>
                  <strong className="metric-value">{selectedExhibit.polygons}</strong>
                </div>
                <div className="metric-cell">
                  <span className="metric-label">MATERIAL</span>
                  <strong className="metric-value">{selectedExhibit.materialType}</strong>
                </div>
              </div>

              <div className="drawer-body">
                <p>{selectedExhibit.description}</p>
                <div className="technical-box">
                  <div className="technical-title">
                    <Layers size={14} />
                    <span>GRAPHICS ENGINEERING INSIGHT</span>
                  </div>
                  <p>{selectedExhibit.technicalDeepDive}</p>
                </div>
              </div>

              <div className="drawer-footer">
                <button className="btn-futuristic btn-secondary btn-sm" onClick={handlePrev}>
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  className={`btn-futuristic btn-sm ${wireframe ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setWireframe(!wireframe)}
                >
                  <Eye size={14} /> {wireframe ? "Solid Mesh" : "Wireframe"}
                </button>
                <button className="btn-futuristic btn-secondary btn-sm" onClick={handleNext}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ARTIFACT CARDS GRID */}
      <section className="museum-artifacts-grid">
        <div className="section-header-compact">
          <h3>The Collection ({EXHIBITS_DATA.length} Interactive Exhibits)</h3>
          <span className="inspected-counter">
            {inspectedArtifacts.length} OF {EXHIBITS_DATA.length} INSPECTED
          </span>
        </div>

        <div className="artifacts-cards">
          {EXHIBITS_DATA.map((item) => {
            const isInspected = inspectedArtifacts.includes(item.id);
            const isCurrent = selectedId === item.id;

            return (
              <div
                key={item.id}
                className={`artifact-summary-card ${isCurrent ? "active-card" : ""}`}
                onClick={() => handleSelect(item.id)}
              >
                <div className="card-top-row">
                  <span className="artifact-num">EXHIBIT {item.index}</span>
                  {isInspected && (
                    <span className="inspected-badge">
                      <CheckCircle size={12} /> INSPECTED
                    </span>
                  )}
                </div>

                <h4 className="artifact-name">{item.title}</h4>
                <p className="artifact-desc">{item.description}</p>

                <div className="card-bottom-row">
                  <span className="artifact-cg-focus">
                    <Sparkles size={12} /> {item.cgFocus}
                  </span>
                  <button className="btn-inspect-link">
                    Inspect 3D →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MISSION KNOWLEDGE CHECK */}
      <section className="museum-quiz-section">
        <KnowledgeQuiz
          quizId="quiz-museum"
          question="In 3D computer graphics, why is Phong normal interpolation used over flat shading on curved geometric surfaces?"
          options={[
            "It reduces the total number of polygons needed to store the model",
            "It interpolates surface normals across polygon faces, producing smooth specular highlights without requiring infinite polygons",
            "It bypasses the fragment shader entirely to speed up rendering on mobile GPUs",
            "It calculates back-to-front depth sorting automatically",
          ]}
          correctIndex={1}
          explanation="Correct! Real-world curved surfaces are approximated with planar polygons. Flat shading computes one normal per polygon, causing harsh facet boundaries. Phong normal interpolation lerps vertex normals across each pixel/fragment, giving the optical illusion of curvature."
          rewardXp={50}
        />
      </section>
    </div>
  );
}
