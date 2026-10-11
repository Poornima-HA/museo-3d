
import { useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { sortBackToFront } from "../algorithms/painterAlgorithm";

const exhibits = [
  {
    id: "azure",
    name: "Azure",
    color: "#438cff",
    position: [-0.65, 0.05, -0.8],
    size: [1.8, 1.8, 1.8],
  },
  {
    id: "violet",
    name: "Violet",
    color: "#a17aff",
    position: [0.45, 0.1, 0],
    size: [1.8, 1.8, 1.8],
  },
  {
    id: "rose",
    name: "Rose",
    color: "#ff729d",
    position: [0.05, 0.15, 0.8],
    size: [1.8, 1.8, 1.8],
  },
];

function ComparisonObjects({ painter }) {
  const { camera } = useThree();

  const sorted = useMemo(
    () => sortBackToFront(exhibits, camera),
    [camera]
  );

  // Both panels use the same objects and camera.
  // Only the visibility-rendering technique changes.
  const objectsToRender = painter ? sorted : exhibits;

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 8]} intensity={2.5} />
      <pointLight position={[-3, 2, 3]} color="#6cbcff" intensity={12} />

      {objectsToRender.map((item, index) => (
        <mesh
          key={item.id}
          position={item.position}
          renderOrder={painter ? index + 1 : 0}
        >
          <boxGeometry args={item.size} />
          <meshStandardMaterial
            color={item.color}
            roughness={0.28}
            metalness={0.12}
            depthTest={!painter}
            depthWrite={!painter}
          />
        </mesh>
      ))}
    </>
  );
}

function ComparisonPanel({ title, subtitle, painter }) {
  return (
    <article className="comparison-card">
      <div className="comparison-card-heading">
        <span className="comparison-dot" />
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="comparison-canvas">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#0a1020"]} />
          <ComparisonObjects painter={painter} />
        </Canvas>
      </div>

      <div className="comparison-caption">
        {painter
          ? "Depth testing disabled · Back-to-front draw order"
          : "Depth testing enabled · Nearest surfaces win"}
      </div>
    </article>
  );
}

export default function RenderingComparison() {
  return (
    <section className="comparison">
      <header className="comparison-intro">
        <p className="eyebrow">EXPERIMENT 003 · VISIBILITY TECHNIQUES</p>
        <h2>One scene. <span>Two methods.</span></h2>
        <p>
          Compare how the same overlapping objects are drawn when
          using a depth buffer versus Painter-style rendering.
        </p>
      </header>

      <div className="comparison-grid">
        <ComparisonPanel
          title="Depth Buffer"
          subtitle="Standard visibility testing"
          painter={false}
        />
        <ComparisonPanel
          title="Painter's Algorithm"
          subtitle="Back-to-front painting"
          painter={true}
        />
      </div>

      <div className="comparison-insight">
        <div className="insight-symbol">i</div>
        <div>
          <h3>What should you observe?</h3>
          <p>
            The depth-buffer renderer tests each fragment against the
            stored depth and keeps the nearest visible surface. The
            Painter-style renderer draws whole objects in sorted order,
            allowing later objects to overwrite earlier ones.
          </p>
          <p>
            Because this experiment sorts whole objects by their center
            depth, intersecting geometry can expose its limitations.
            Correct sorting of object centers alone does not guarantee
            correct visibility for every pixel.
          </p>
        </div>
      </div>

      <div className="comparison-legend">
        <span><i className="legend-blue" /> Azure object</span>
        <span><i className="legend-violet" /> Violet object</span>
        <span><i className="legend-rose" /> Rose object</span>
      </div>
    </section>
  );
}
