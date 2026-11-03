export default function Footer({ onNavigate }) {
  return (
    <footer className="futuristic-footer">
      <div className="footer-inner">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span>MUSEO</span> <span className="text-cyan">3D</span>
            </div>
            <p className="footer-tagline">
              Explore. Experiment. Understand 3D Graphics.
            </p>
            <p className="footer-subtext">
              An interactive virtual museum and computer graphics learning laboratory exploring Painter's Algorithm, Z-buffering, and 3D visibility determination.
            </p>
          </div>

          <div className="footer-links-col">
            <span className="footer-header">LABORATORIES</span>
            <button onClick={() => onNavigate("museum")}>01 · Virtual Museum</button>
            <button onClick={() => onNavigate("lab")}>02 · Painter's Algorithm Lab</button>
            <button onClick={() => onNavigate("comparison")}>03 · Renderer Showdown</button>
            <button onClick={() => onNavigate("puzzle")}>04 · Painter's Puzzle</button>
          </div>

          <div className="footer-links-col">
            <span className="footer-header">GRAPHICS TOPICS</span>
            <span>Camera-Space Projection</span>
            <span>Back-to-Front Depth Sorting</span>
            <span>Hardware Depth Testing (Z-Buffer)</span>
            <span>Cyclic Overlap & Newell's Test</span>
          </div>

          <div className="footer-tech-col">
            <span className="footer-header">ARCHITECTURE</span>
            <div className="tech-badge-strip">
              <span>Three.js</span>
              <span>React Three Fiber</span>
              <span>Drei</span>
              <span>WebGL 2.0</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <span>MUSEO 3D © 2026 · VIRTUAL MUSEUM OBJECT RENDERING SYSTEM</span>
          <span>BUILT FOR COMPUTER GRAPHICS STUDENTS & RESEARCHERS</span>
        </div>
      </div>
    </footer>
  );
}
