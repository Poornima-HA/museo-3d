
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";

function Pedestal({ position, color = "#b99a61" }) {
  return (
    <group position={position}>
      {/* Pedestal base */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.95, 0.24, 32]} />
        <meshStandardMaterial
          color="#252d3b"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* Pedestal column */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.58, 0.7, 1.15, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.45}
          roughness={0.35}
        />
      </mesh>

      {/* Top surface */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.12, 32]} />
        <meshStandardMaterial
          color="#e1c78e"
          metalness={0.55}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

function Exhibit({ type, color, position }) {
  return (
    <group position={position}>
      {type === "cube" && (
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial
            color={color}
            metalness={0.35}
            roughness={0.25}
          />
        </mesh>
      )}

      {type === "torus" && (
        <mesh rotation={[Math.PI / 2.5, 0.2, 0]} castShadow>
          <torusGeometry args={[0.48, 0.17, 16, 40]} />
          <meshStandardMaterial
            color={color}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      )}

      {type === "crystal" && (
        <mesh rotation={[0.15, 0.4, 0]} castShadow>
          <octahedronGeometry args={[0.68, 0]} />
          <meshStandardMaterial
            color={color}
            metalness={0.35}
            roughness={0.2}
            flatShading
          />
        </mesh>
      )}
    </group>
  );
}

function MuseumRoom() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={1.1} />

      <directionalLight
        position={[4, 8, 5]}
        intensity={2}
        castShadow
      />

      <pointLight
        position={[-4, 4, -3]}
        intensity={35}
        color="#7acbff"
      />

      <pointLight
        position={[4, 4, -3]}
        intensity={30}
        color="#ffd18a"
      />

      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial
          color="#111827"
          roughness={0.75}
          metalness={0.15}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 4, -5]}>
        <boxGeometry args={[22, 8, 0.2]} />
        <meshStandardMaterial
          color="#1b2535"
          roughness={0.8}
        />
      </mesh>

      {/* Side walls */}
      <mesh position={[-8, 4, 0]}>
        <boxGeometry args={[0.2, 8, 12]} />
        <meshStandardMaterial color="#172131" />
      </mesh>

      <mesh position={[8, 4, 0]}>
        <boxGeometry args={[0.2, 8, 12]} />
        <meshStandardMaterial color="#172131" />
      </mesh>

      {/* Azure Form */}
      <Pedestal position={[-4, 0, -1]} color="#347da8" />
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.12}>
        <Exhibit
          type="cube"
          color="#42c8f5"
          position={[-4, 2.05, -1]}
        />
      </Float>

      {/* Golden Loop */}
      <Pedestal position={[0, 0, -2]} color="#a9874b" />
      <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.1}>
        <Exhibit
          type="torus"
          color="#f1c66f"
          position={[0, 2.05, -2]}
        />
      </Float>

      {/* Ruby Crystal */}
      <Pedestal position={[4, 0, -1]} color="#9b5268" />
      <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.12}>
        <Exhibit
          type="crystal"
          color="#f36c9a"
          position={[4, 2.1, -1]}
        />
      </Float>
    </>
  );
}

export default function MuseumScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.25]}
      camera={{
        position: [0, 4.2, 10],
        fov: 52,
      }}
      gl={{
        antialias: true,
        powerPreference: "default",
      }}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    >
      <MuseumRoom />

      <OrbitControls
        makeDefault
        target={[0, 1.5, -1.5]}
        minDistance={5}
        maxDistance={17}
        maxPolarAngle={Math.PI / 2 - 0.04}
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        rotateSpeed={0.7}
        zoomSpeed={0.8}
      />
    </Canvas>
  );
}
