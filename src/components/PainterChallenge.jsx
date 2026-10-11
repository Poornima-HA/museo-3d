
import { useState } from "react";

const initialObjects = [
  { id: "crystal", name: "Ruby Crystal", depth: 3, color: "#ff6b8a", shape: "◆" },
  { id: "sphere", name: "Azure Sphere", depth: 1, color: "#57c7ff", shape: "●" },
  { id: "cube", name: "Golden Cube", depth: 2, color: "#ffc857", shape: "■" },
];

export default function PainterChallenge({ onComplete }) {
  const [objects, setObjects] = useState(initialObjects);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  function moveObject(index, direction) {
    const target = index + direction;

    if (target < 0 || target >= objects.length || completed) return;

    const updated = [...objects];
    [updated[index], updated[target]] = [
      updated[target],
      updated[index],
    ];

    setObjects(updated);
    setMessage("");
  }

  function checkAnswer() {
    const correct = [...objects].sort((a, b) => b.depth - a.depth);
    const isCorrect = objects.every(
      (object, index) => object.id === correct[index].id
    );

    if (isCorrect) {
      setMessage("Amazing! You painted from back to front!");
      setCompleted(true);
      onComplete?.();
    } else {
      setMessage("Not quite! Move the farthest object to the top first.");
    }
  }

  function resetChallenge() {
    setObjects(initialObjects);
    setMessage("");
    setCompleted(false);
  }

  return (
    <section className="painter-challenge">
      <div className="challenge-header">
        <p className="section-kicker">LEVEL 1 · RENDERING QUEST</p>
        <h2>The Painter's Challenge 🎨</h2>
        <p>
          The Painter's Algorithm draws distant objects first and
          nearer objects afterward. Arrange these artifacts in that order.
        </p>
      </div>

      <div className="challenge-instructions">
        <span>🌌 BACK</span>
        <span>Paint in this direction →</span>
        <span>👀 FRONT</span>
      </div>

      <div className="challenge-list">
        {objects.map((object, index) => (
          <article className="challenge-object" key={object.id}>
            <div
              className="challenge-shape"
              style={{ color: object.color }}
            >
              {object.shape}
            </div>

            <div className="challenge-object-info">
              <strong>{object.name}</strong>
              <span>
                {object.depth === 1
                  ? "Nearest to camera"
                  : object.depth === 3
                    ? "Farthest from camera"
                    : "Middle distance"}
              </span>
            </div>

            <div className="challenge-controls">
              <button
                onClick={() => moveObject(index, -1)}
                disabled={index === 0 || completed}
                aria-label={`Move ${object.name} earlier`}
              >
                ↑
              </button>
              <button
                onClick={() => moveObject(index, 1)}
                disabled={index === objects.length - 1 || completed}
                aria-label={`Move ${object.name} later`}
              >
                ↓
              </button>
            </div>
          </article>
        ))}
      </div>

      {message && (
        <p
          className={completed ? "challenge-message success" : "challenge-message"}
          role="status"
        >
          {message}
        </p>
      )}

      <div className="challenge-actions">
        <button
          className="primary"
          onClick={checkAnswer}
          disabled={completed}
        >
          {completed ? "✓ Challenge Completed" : "Check My Answer"}
        </button>

        <button className="challenge-reset" onClick={resetChallenge}>
          Try Again
        </button>
      </div>

      <p className="challenge-note">
        Learning demo: this challenge uses simplified object depth.
        Real Painter's Algorithm implementations must also handle
        overlapping and intersecting surfaces carefully.
      </p>
    </section>
  );
}
