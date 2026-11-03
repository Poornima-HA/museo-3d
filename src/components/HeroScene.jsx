import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function KineticCore() {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const groupRef = useRef();

  useFrame((state, delta) => {
    // Subtle auto-rotation
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.35;
      coreRef.current.rotation.y += delta * 0.45;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.5;
      ring1Ref.current.rotation.x += delta * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.4;
      ring2Ref.current.rotation.z -= delta * 0.3;
    }

    // Pointer-following tilt
    if (groupRef.current) {
      const targetX = state.pointer.y * 0.4;
      const targetY = state.pointer.x * 0.6;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Faceted Gem */}
      <mesh ref={coreRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#4C1D95"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.85}
          flatShading
        />
      </mesh>

      {/* Outer Gimbal Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.0, 0.045, 16, 64]} />
        <meshStandardMaterial
          color="#22D3EE"
          emissive="#0891B2"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Outer Gimbal Ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.45, 0.035, 16, 64]} />
        <meshStandardMaterial
          color="#C4B5FD"
          emissive="#7C3AED"
          emissiveIntensity={0.5}
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>

      {/* Accent Wireframe Cage */}
      <mesh>
        <octahedronGeometry args={[1.8, 0]} />
        <meshBasicMaterial
          color="#22D3EE"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

function FloatingSatellites() {
  return (
    <>
      {/* Cyan Octahedron - Top Left Far */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.2}>
        <mesh position={[-3.2, 1.8, -1.5]} rotation={[0.4, 0.5, 0]}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color="#22D3EE"
            roughness={0.2}
            metalness={0.8}
            flatShading
          />
        </mesh>
      </Float>

      {/* Golden/Amber Sphere - Bottom Left Near */}
      <Float speed={1.7} rotationIntensity={0.8} floatIntensity={1}>
        <mesh position={[-2.8, -1.8, 1.2]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#B45309"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
      </Float>

      {/* Ruby Polyhedron - Top Right Near */}
      <Float speed={2.4} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[3.2, 2.0, 1.0]} rotation={[0.2, 0.8, 0.4]}>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#EC4899"
            emissive="#9D174D"
            emissiveIntensity={0.4}
            roughness={0.25}
            metalness={0.7}
            flatShading
          />
        </mesh>
      </Float>

      {/* Violet Torus - Bottom Right Far */}
      <Float speed={1.5} rotationIntensity={1.2} floatIntensity={0.9}>
        <mesh position={[3.0, -1.6, -1.0]} rotation={[1.2, 0.2, 0]}>
          <torusGeometry args={[0.5, 0.18, 16, 32]} />
          <meshStandardMaterial
            color="#A78BFA"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </Float>

      {/* Small Floating Crystal Shards */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1.8}>
        <mesh position={[-1.2, 2.6, 0.5]}>
          <tetrahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial color="#67E8F9" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={2.8} rotationIntensity={1.8} floatIntensity={1.4}>
        <mesh position={[1.5, -2.4, 0.2]}>
          <tetrahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial color="#DDD6FE" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>
    </>
  );
}

// Generate static deterministic particle positions outside of render
const PARTICLE_COUNT = 180;
const STATIC_PARTICLE_POSITIONS = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  // Deterministic golden-ratio distribution
  const idx = i * 3;
  const phi = i * 1.6180339887;
  STATIC_PARTICLE_POSITIONS[idx] = Math.sin(phi * 2.3) * 7.5;
  STATIC_PARTICLE_POSITIONS[idx + 1] = Math.cos(phi * 3.7) * 5.5;
  STATIC_PARTICLE_POSITIONS[idx + 2] = Math.sin(phi * 5.1) * 4.5;
}

function ParticleField() {
  const pointsRef = useRef();

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STATIC_PARTICLE_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#22D3EE"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <div className="hero-3d-wrapper">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} color="#1E1B4B" />
        <directionalLight position={[5, 8, 5]} intensity={2.2} color="#F8FAFC" />
        <pointLight position={[-4, 3, 2]} intensity={25} color="#22D3EE" />
        <pointLight position={[4, -2, 2]} intensity={30} color="#8B5CF6" />
        <pointLight position={[0, -4, -2]} intensity={15} color="#A78BFA" />

        <KineticCore />
        <FloatingSatellites />
        <ParticleField />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>

      <div className="hero-3d-hint">
        <span className="hint-pulse" />
        <span>INTERACTIVE 3D · DRAG TO ROTATE SCULPTURE</span>
      </div>
    </div>
  );
}
