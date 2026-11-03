# MUSEO 3D
### Explore. Experiment. Understand 3D Graphics.

> **Museo 3D** is an interactive virtual museum and computer graphics learning laboratory designed to teach visibility determination, depth sorting, and rendering pipelines (specifically comparing **Painter's Algorithm** with modern **Hardware Z-Buffering**).

---

## 🏛️ Project Overview

Museo 3D bridges the gap between abstract computer graphics theory and interactive spatial intuition. Rather than viewing static slides, students and engineers interact with real-time WebGL scenes to observe how 3D primitives are transformed, sorted, and rasterized onto a 2D screen.

### Core Experience Modules

1. **Cinematic Interactive Landing Page**:
   - Real-time 3D interactive kinetic sculpture responding to cursor pointer movements.
   - Core curriculum overview covering spatial geometry, visibility determination, depth buffers, and gamified mastery.
   - Live Explorer HUD tracking level, XP, and rank.

2. **Mission 01: Virtual Museum Gallery**:
   - High-fidelity 3D architectural gallery interior with reflective floor grid, spotlights, and display plinths.
   - Four distinct interactive exhibits:
     - *The Quantum Monolith* (PBR metallic-roughness, coordinate systems, vertex transformations)
     - *The Golden Möbius* (Parametric torus knot curves, tangent spaces, microfacet BRDF)
     - *The Ruby Polyhedron* (Faceted octahedron, flat shading vs Phong normal interpolation)
     - *The Celestial Gyroscope* (Hierarchical kinematic chains, scene graph matrix multiplications)
   - Interactive 3D Inspector: Wireframe mode toggle, auto-rotation controls, camera view presets, and technical deep-dives.

3. **Mission 02: Painter's Algorithm Laboratory**:
   - Mathematical camera-space depth calculations ($d = (\mathbf{P}_{obj} - \mathbf{P}_{cam}) \cdot \hat{\mathbf{v}}_{fwd}$).
   - Step-by-step playback controls (Play, Pause, Step Next, Step Prev, Reset, Speed Control $0.5\times, 1\times, 2\times$).
   - Dynamic render queue: active drawing step highlighting with real-time bounding volume cues.
   - **Interactive Depth Playground**: Sliders to adjust object $Z$-positions in real time, causing the render queue to dynamically re-sort.
   - **The Cyclic Overlap Paradox**: Interactive failure case demonstration illustrating why Painter's algorithm fails on cyclic overlapping surfaces without polygon subdivision (Newell's algorithm / BSP trees).

4. **Mission 03: Renderer Showdown (Painter's vs Z-Buffer)**:
   - Side-by-side synchronized viewports comparing:
     - **Left**: Software-style Painter's Algorithm (`depthTest = false`, `depthWrite = false`, back-to-front sorting).
     - **Right**: Hardware Z-Buffer (`depthTest = true`, `depthWrite = true`).
   - Stress-test scenarios: Intersecting geometry vs non-intersecting layered solids.
   - **Grayscale Depth Buffer Visualizer**: View the exact 24-bit depth map used by the GPU rasterizer.
   - Comprehensive architectural comparison matrix (complexity, memory, intersecting meshes, order-dependent alpha blending).

5. **Bonus Quest: The Painter's Puzzle Quest**:
   - Multi-stage spatial challenge across 3 progressive difficulty levels.
   - Arrange overlapping artifacts from farthest to nearest along the viewing ray.
   - **Real-Time 3D Simulation**: Hit "Simulate Painter's Algorithm" to watch your custom queue execute in 3D and verify if occlusion errors or tearing occur.
   - Instant feedback and XP rewards.

6. **Explorer Progress Hub**:
   - Persistent progression system (stored in `localStorage` with duplicate XP prevention).
   - Explorer Ranks: *Polygon Apprentice*, *Raster Explorer*, *Shader Alchemist*, *Depth Buffer Master*, and *Computer Graphics Virtuoso*.
   - Mission checklist, unlockable achievement badges, and a Computer Graphics Study Sheet covering visibility formulas.

---

## 📐 Mathematical Formulation

### 1. Camera-Space Depth Projection
Given an observer camera with world position $\mathbf{P}_{cam}$ and normalized forward vector $\hat{\mathbf{v}}_{fwd}$, the depth $d$ of an object at world position $\mathbf{P}_{obj}$ is:

$$d = (\mathbf{P}_{obj} - \mathbf{P}_{cam}) \cdot \hat{\mathbf{v}}_{fwd}$$

In Painter's Algorithm, objects are sorted in descending order of depth:

$$\text{Queue} = \text{sort}_{\text{descending}}(\{ (O_i, d_i) \})$$

### 2. Hardware Z-Buffer Fragment Test
During rasterization on modern GPUs, each fragment generated at screen coordinates $(x, y)$ has an interpolated depth $z_{frag} \in [0, 1]$:

$$\text{if } z_{frag} < z_{buffer}[x, y] \implies \begin{cases} z_{buffer}[x, y] \leftarrow z_{frag} \\ \text{framebuffer}[x, y] \leftarrow \text{color}_{frag} \end{cases}$$

### 3. Alpha Blending (Order Dependency)
Transparent surfaces must use back-to-front Painter's sorting because color blending is non-commutative:

$$\mathbf{C}_{final} = \mathbf{C}_{src} \cdot \alpha + \mathbf{C}_{dst} \cdot (1 - \alpha)$$

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite 8
- **3D Graphics Engine**: Three.js + React Three Fiber (R3F) + Drei
- **Icons**: Lucide React
- **Design System**: Custom Midnight Navy futuristic aesthetic (`#080B18`, `#11162A`, `#8B5CF6`, `#22D3EE`, `#C4B5FD`)
- **Typography**: Space Grotesk, DM Sans, JetBrains Mono

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Production Build & Linting
```bash
npm run lint
npm run build
```

---

## 📜 License & Credits

Built for curious minds and computer graphics engineers.
Museo 3D © 2026.
