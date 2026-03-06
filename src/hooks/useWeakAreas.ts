import { useMemo } from "react";
import { useSpacedRepetition } from "./useSpacedRepetition";

export interface ThemeAnalysis {
  themeId: number;
  themeName: string;
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number;
  masteryLevel: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface WeakAreasReport {
  weakestThemes: ThemeAnalysis[];
  strongestThemes: ThemeAnalysis[];
  needsWork: boolean;
}

export function useWeakAreas(
  questions: { id: string; theme: number }[],
  themeNames: { [key: number]: string },
) {
  const { spacedData, getMasteryLevel } = useSpacedRepetition();

  const analysis = useMemo(() => {
    // Group questions by theme
    const themeStats: {
      [theme: number]: { total: number; correct: number; questions: string[] };
    } = {};

    // Initialize all themes
    for (let i = 1; i <= 6; i++) {
      themeStats[i] = { total: 0, correct: 0, questions: [] };
    }

    // Count answered questions per theme
    questions.forEach((q) => {
      const stats = spacedData[q.id];
      if (stats && stats.timesShown > 0) {
        if (!themeStats[q.theme]) {
          themeStats[q.theme] = { total: 0, correct: 0, questions: [] };
        }
        themeStats[q.theme].total += stats.timesShown;
        themeStats[q.theme].correct += stats.timesCorrect;
        themeStats[q.theme].questions.push(q.id);
      }
    });

    // Calculate analysis for each theme
    const themeAnalysis: ThemeAnalysis[] = Object.keys(themeStats)
      .map((themeStr) => {
        const themeNum = parseInt(themeStr);
        const stats = themeStats[themeNum];
        const accuracyRate =
          stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

        // Calculate average mastery for questions in this theme
        let avgMastery = 0;
        if (stats.questions.length > 0) {
          avgMastery = Math.round(
            stats.questions.reduce(
              (sum, qId) => sum + getMasteryLevel(qId),
              0,
            ) / stats.questions.length,
          );
        }

        const difficulty: "easy" | "medium" | "hard" =
          accuracyRate >= 80 ? "easy" : accuracyRate >= 50 ? "medium" : "hard";

        return {
          themeId: themeNum,
          themeName: themeNames[themeNum] || `Theme ${themeNum}`,
          totalAnswered: stats.total,
          correctCount: stats.correct,
          incorrectCount: stats.total - stats.correct,
          accuracyRate,
          masteryLevel: avgMastery,
          difficulty,
        };
      })
      .filter((t) => t.totalAnswered > 0);

    // Sort by accuracy (ascending = weakest first)
    const sortedByAccuracy = [...themeAnalysis].sort(
      (a, b) => a.accuracyRate - b.accuracyRate,
    );

    // Get weakest (bottom 2) and strongest (top 2)
    const weakestThemes = sortedByAccuracy.slice(
      0,
      Math.min(2, sortedByAccuracy.length),
    );
    const strongestThemes = sortedByAccuracy
      .slice(-Math.min(2, sortedByAccuracy.length))
      .reverse();

    // Determine if user needs work on any themes
    const needsWork = themeAnalysis.some(
      (t) => t.accuracyRate < 60 && t.totalAnswered > 0,
    );

    return {
      weakestThemes,
      strongestThemes,
      needsWork,
      allThemes: themeAnalysis,
    };
  }, [questions, spacedData, getMasteryLevel, themeNames]);

  const getRecommendedThemes = useMemo(() => {
    // Return themes sorted by weakness for study recommendations
    return analysis.allThemes
      .filter((t) => t.accuracyRate < 70 && t.totalAnswered > 0)
      .sort((a, b) => a.accuracyRate - b.accuracyRate);
  }, [analysis]);

  return {
    ...analysis,
    getRecommendedThemes,
  };
}
