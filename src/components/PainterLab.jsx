
import { useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { sortBackToFront } from "../algorithms/painterAlgorithm";

const objects = [
  {
    id: "azure",
    name: "Azure Cube",
    color: "#40a9ff",
    position: [-0.65, 0, -1.2],
    shape: "box",
  },
  {
    id: "gold",
    name: "Golden Sphere",
    color: "#ffc857",
    position: [0, 0, 0],
    shape: "sphere",
  },
  {
    id: "ruby",
    name: "Ruby Cube",
    color: "#ff526f",
    position: [0.65, 0, 1.2],
    shape: "box",
  },
];

// 3D scene: draws objects in the order calculated by the algorithm.
function LabObjects({ drawCount }) {
  const { camera } = useThree();

  const sorted = useMemo(
    () => sortBackToFront(objects, camera),
    [camera]
  );

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 6]} intensity={2} />

      {sorted.map((item, index) => (
        <mesh
          key={item.id}
          position={item.position}
          visible={index < drawCount}
          renderOrder={index + 1}
        >
          {item.shape === "sphere" ? (
            <sphereGeometry args={[0.9, 32, 32]} />
          ) : (
            <boxGeometry args={[1.5, 1.5, 1.5]} />
          )}

          <meshStandardMaterial
            color={item.color}
            emissive={item.color}
            emissiveIntensity={0.12}
            roughness={0.3}
            metalness={0.2}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

export default function PainterLab() {
  const [drawCount, setDrawCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate a stable, back-to-front queue for our fixed lab camera.
  const sorted = useMemo(
    () =>
      [...objects]
        .map((item) => ({
          ...item,
          depth: 8 - item.position[2],
        }))
        .sort((a, b) => b.depth - a.depth),
    []
  );

  // Automatically paint one object every second during playback.
  useEffect(() => {
    if (!isPlaying) return;

    if (drawCount >= sorted.length) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setDrawCount((current) =>
        Math.min(current + 1, sorted.length)
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, drawCount, sorted.length]);

  function handlePlayPause() {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    // Replay automatically if all objects have already been painted.
    if (drawCount >= sorted.length) {
      setDrawCount(0);
    }

    setIsPlaying(true);
  }

  function handleDrawNext() {
    setIsPlaying(false);
    setDrawCount((current) =>
      Math.min(current + 1, sorted.length)
    );
  }

  function handleReset() {
    setIsPlaying(false);
    setDrawCount(0);
  }

  const progress = (drawCount / sorted.length) * 100;

  return (
    <section className="lab">
      <div className="lab-header">
        <p className="eyebrow">
          COMPUTER GRAPHICS / LIVE EXPERIMENT
        </p>

        <h2>
          Painter's Algorithm <span>Lab</span>
        </h2>

        <p>
          Observe how objects are painted from the farthest to the
          nearest using the Painter's Algorithm.
        </p>
      </div>

      <div className="lab-grid">
        <div className="lab-canvas">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 48 }}
            gl={{ antialias: true }}
          >
            <color attach="background" args={["#0b1120"]} />
            <LabObjects drawCount={drawCount} />
          </Canvas>

          <div className="lab-canvas-label">
            {drawCount} / {sorted.length} OBJECTS PAINTED
          </div>
        </div>

        <aside className="lab-panel">
          <p className="eyebrow">RENDER QUEUE</p>
          <h3>Back to front</h3>

          {sorted.map((item, index) => (
            <div className="order-row" key={item.id}>
              <span className="order-number">
                {index + 1}
              </span>

              <span
                className="swatch"
                style={{ background: item.color }}
              />

              <div className="order-info">
                <strong>{item.name}</strong>
                <p>Depth: {item.depth.toFixed(2)}</p>
              </div>

              <span
                className={
                  index < drawCount ? "drawn" : "waiting"
                }
              >
                {index < drawCount ? "PAINTED" : "WAITING"}
              </span>
            </div>
          ))}

          <div className="progress-track">
            <div style={{ width: `${progress}%` }} />
          </div>

          <p className="muted">
            {drawCount === 0
              ? "Ready to paint the farthest object."
              : drawCount === sorted.length
              ? "Rendering sequence complete."
              : isPlaying
              ? "Painting objects automatically..."
              : "Paused. Continue with Draw Next or Play."}
          </p>

          <div className="lab-controls">
            <button
              className="primary"
              onClick={handlePlayPause}
            >
              {isPlaying
                ? "Ⅱ Pause Animation"
                : drawCount === sorted.length
                ? "▶ Replay Animation"
                : "▶ Play Animation"}
            </button>

            <button
              className="secondary"
              onClick={handleDrawNext}
              disabled={drawCount >= sorted.length}
            >
              Draw Next Object →
            </button>

            <button
              className="secondary"
              onClick={handleReset}
            >
              ↺ Reset Experiment
            </button>
          </div>
        </aside>
      </div>

      <div className="lab-explanation">
        <h3>How the algorithm works</h3>

        <ol>
          <li>
            Calculate each object's depth relative to the camera.
          </li>
          <li>
            Sort objects from farthest to nearest.
          </li>
          <li>
            Paint objects in the calculated order.
          </li>
          <li>
            Later objects can overwrite pixels painted earlier.
          </li>
        </ol>

        <p>
          Limitation: sorting whole objects by a single depth value
          cannot correctly resolve every intersecting or cyclic overlap.
          Polygon splitting or another visibility technique may be needed.
        </p>
      </div>
    </section>
  );
}
