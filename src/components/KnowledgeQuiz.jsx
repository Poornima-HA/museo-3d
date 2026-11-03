import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, Award } from "lucide-react";
import { useProgress } from "../context/ProgressContext";

export default function KnowledgeQuiz({
  quizId,
  question,
  options,
  correctIndex,
  explanation,
  rewardXp = 50,
}) {
  const { completedQuizzes, markQuizComplete } = useProgress();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const isAlreadyCompleted = completedQuizzes.includes(quizId);

  function handleSelect(idx) {
    if (submitted || isAlreadyCompleted) return;
    setSelectedIndex(idx);
  }

  function handleSubmit() {
    if (selectedIndex === null) return;
    setSubmitted(true);
    if (selectedIndex === correctIndex) {
      markQuizComplete(quizId);
    }
  }

  function handleReset() {
    setSelectedIndex(null);
    setSubmitted(false);
  }

  const isCorrect = (submitted && selectedIndex === correctIndex) || isAlreadyCompleted;

  return (
    <div className="knowledge-quiz-card">
      <div className="quiz-header">
        <div className="quiz-badge">
          <HelpCircle size={16} />
          <span>KNOWLEDGE CHECK</span>
        </div>
        <div className="quiz-reward">
          <Award size={16} />
          <span>+{rewardXp} XP</span>
        </div>
      </div>

      <h4 className="quiz-question">{question}</h4>

      <div className="quiz-options">
        {options.map((opt, idx) => {
          let stateClass = "";
          if (isAlreadyCompleted) {
            stateClass = idx === correctIndex ? "option-correct" : "";
          } else if (submitted) {
            if (idx === correctIndex) stateClass = "option-correct";
            else if (idx === selectedIndex) stateClass = "option-incorrect";
          } else if (selectedIndex === idx) {
            stateClass = "option-selected";
          }

          return (
            <button
              key={idx}
              className={`quiz-option-btn ${stateClass}`}
              onClick={() => handleSelect(idx)}
              disabled={submitted || isAlreadyCompleted}
            >
              <span className="option-index">{String.fromCharCode(65 + idx)}</span>
              <span className="option-text">{opt}</span>
              {submitted && idx === correctIndex && (
                <CheckCircle2 size={18} className="option-icon text-success" />
              )}
              {submitted && idx === selectedIndex && idx !== correctIndex && (
                <XCircle size={18} className="option-icon text-error" />
              )}
              {isAlreadyCompleted && idx === correctIndex && (
                <CheckCircle2 size={18} className="option-icon text-success" />
              )}
            </button>
          );
        })}
      </div>

      {!submitted && !isAlreadyCompleted && (
        <div className="quiz-actions">
          <button
            className="btn-futuristic btn-primary"
            disabled={selectedIndex === null}
            onClick={handleSubmit}
          >
            Verify Understanding
          </button>
        </div>
      )}

      {(submitted || isAlreadyCompleted) && (
        <div className={`quiz-feedback ${isCorrect ? "feedback-success" : "feedback-error"}`}>
          <div className="feedback-title">
            {isCorrect ? (
              <>
                <CheckCircle2 size={18} />
                <strong>Correct! +{rewardXp} XP Added</strong>
              </>
            ) : (
              <>
                <XCircle size={18} />
                <strong>Not quite. Review the explanation below:</strong>
              </>
            )}
          </div>
          <p className="feedback-explanation">{explanation}</p>
          {!isCorrect && (
            <button className="btn-futuristic btn-secondary btn-sm" onClick={handleReset}>
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
