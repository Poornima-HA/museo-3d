import { AlertTriangle, RefreshCw } from "lucide-react";

export default function CanvasFallback({ message = "Unable to initialize 3D WebGL Context." }) {
  return (
    <div className="canvas-fallback-container">
      <div className="canvas-fallback-card">
        <div className="canvas-fallback-icon">
          <AlertTriangle size={36} color="#22D3EE" />
        </div>
        <h3>3D Hardware Acceleration Notice</h3>
        <p>{message}</p>
        <p className="fallback-hint">
          Ensure WebGL is supported and enabled in your browser settings, and that hardware acceleration is turned on.
        </p>
        <button
          className="btn-futuristic btn-secondary"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={16} /> Reload Application
        </button>
      </div>
    </div>
  );
}
