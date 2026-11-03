/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";
import { ProgressContext } from "./ProgressContextDef";
export { useProgress } from "./useProgress";

const STORAGE_KEY = "museo3d_learning_progress_v2";

const MISSION_REWARDS = {
  museum: 100,
  lab: 150,
  comparison: 200,
};

const PUZZLE_LEVEL_REWARDS = {
  "puzzle-1": 50,
  "puzzle-2": 50,
  "puzzle-3": 50,
};

const QUIZ_REWARDS = {
  "quiz-lab": 50,
  "quiz-comparison": 50,
  "quiz-puzzle": 50,
};

const RANKS = [
  { minXp: 0, title: "Polygon Apprentice", badge: "📐", description: "Beginning your computer graphics journey" },
  { minXp: 200, title: "Raster Explorer", badge: "🔍", description: "Understanding screen-space projections & drawing order" },
  { minXp: 400, title: "Shader Alchemist", badge: "🔮", description: "Mastering visibility determination and surface sorting" },
  { minXp: 600, title: "Depth Buffer Master", badge: "🛡️", description: "Deeply versed in Z-buffer hardware and graphics pipelines" },
  { minXp: 750, title: "Computer Graphics Virtuoso", badge: "🏆", description: "Accomplished 3D graphics engineer and researcher" },
];

export function ProgressProvider({ children }) {
  const [visitedMissions, setVisitedMissions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.visitedMissions || [];
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [completedPuzzleLevels, setCompletedPuzzleLevels] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.completedPuzzleLevels || [];
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [completedQuizzes, setCompletedQuizzes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.completedQuizzes || [];
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [inspectedArtifacts, setInspectedArtifacts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.inspectedArtifacts || [];
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      const data = {
        visitedMissions,
        completedPuzzleLevels,
        completedQuizzes,
        inspectedArtifacts,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [visitedMissions, completedPuzzleLevels, completedQuizzes, inspectedArtifacts]);

  // Compute XP strictly from verified completions (impossible to double count)
  const missionXp = visitedMissions.reduce((acc, id) => acc + (MISSION_REWARDS[id] || 0), 0);
  const puzzleXp = completedPuzzleLevels.reduce((acc, id) => acc + (PUZZLE_LEVEL_REWARDS[id] || 0), 0);
  const quizXp = completedQuizzes.reduce((acc, id) => acc + (QUIZ_REWARDS[id] || 0), 0);
  const totalXp = missionXp + puzzleXp + quizXp;

  // Determine Rank & Level
  let currentRank = RANKS[0];
  let nextRank = RANKS[1];
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalXp >= RANKS[i].minXp) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] || null;
      break;
    }
  }

  const level = Math.floor(totalXp / 150) + 1;
  const levelProgress = (totalXp % 150) / 150;

  function markMissionVisited(id) {
    if (!visitedMissions.includes(id)) {
      setVisitedMissions((prev) => [...prev, id]);
    }
  }

  function markPuzzleLevelComplete(levelId) {
    if (!completedPuzzleLevels.includes(levelId)) {
      setCompletedPuzzleLevels((prev) => [...prev, levelId]);
    }
  }

  function markQuizComplete(quizId) {
    if (!completedQuizzes.includes(quizId)) {
      setCompletedQuizzes((prev) => [...prev, quizId]);
    }
  }

  function markArtifactInspected(artifactId) {
    if (!inspectedArtifacts.includes(artifactId)) {
      setInspectedArtifacts((prev) => [...prev, artifactId]);
    }
  }

  function resetProgress() {
    setVisitedMissions([]);
    setCompletedPuzzleLevels([]);
    setCompletedQuizzes([]);
    setInspectedArtifacts([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <ProgressContext.Provider
      value={{
        visitedMissions,
        completedPuzzleLevels,
        completedQuizzes,
        inspectedArtifacts,
        totalXp,
        level,
        levelProgress,
        currentRank,
        nextRank,
        markMissionVisited,
        markPuzzleLevelComplete,
        markQuizComplete,
        markArtifactInspected,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
