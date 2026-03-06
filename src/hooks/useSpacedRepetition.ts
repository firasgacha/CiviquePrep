import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface QuestionStats {
  questionId: string;
  timesShown: number;
  timesCorrect: number;
  lastAnswered: string;
  easeFactor: number;
  interval: number;
  nextReview: string;
}

export interface UserSpacedRepetition {
  [questionId: string]: QuestionStats;
}

const STORAGE_KEY = "civique-spaced-repetition";
const DEFAULT_EASE_FACTOR = 2.5;

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function calculateNextReview(
  easeFactor: number,
  interval: number,
  quality: number,
): { easeFactor: number; interval: number; nextReview: Date } {
  // quality < 3 means wrong answer (reset interval)
  if (quality < 3) {
    return {
      easeFactor: Math.max(1.3, easeFactor - 0.2),
      interval: 1,
      nextReview: addDays(new Date(), 1),
    };
  }

  // Correct answer - update based on SM-2
  const newInterval = interval === 0 ? 1 : Math.round(interval * easeFactor);
  const newEaseFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  return {
    easeFactor: Math.max(1.3, newEaseFactor),
    interval: newInterval,
    nextReview: addDays(new Date(), newInterval),
  };
}

export function useSpacedRepetition() {
  const [spacedData, setSpacedData] = useLocalStorage<UserSpacedRepetition>(
    STORAGE_KEY,
    {},
  );

  const recordAnswer = useCallback(
    (questionId: string, isCorrect: boolean) => {
      const quality = isCorrect ? 4 : 1; // 4 = good answer, 1 = wrong answer
      const existing = spacedData[questionId];

      const { easeFactor, interval, nextReview } = calculateNextReview(
        existing?.easeFactor || DEFAULT_EASE_FACTOR,
        existing?.interval || 0,
        quality,
      );

      setSpacedData((prev) => ({
        ...prev,
        [questionId]: {
          questionId,
          timesShown: (existing?.timesShown || 0) + 1,
          timesCorrect: (existing?.timesCorrect || 0) + (isCorrect ? 1 : 0),
          lastAnswered: new Date().toISOString(),
          easeFactor,
          interval,
          nextReview: nextReview.toISOString(),
        },
      }));
    },
    [spacedData, setSpacedData],
  );

  const getQuestionStats = useCallback(
    (questionId: string): QuestionStats | null => {
      return spacedData[questionId] || null;
    },
    [spacedData],
  );

  const isDueForReview = useCallback(
    (questionId: string): boolean => {
      const stats = spacedData[questionId];
      if (!stats) return true; // Never seen, show it
      return new Date(stats.nextReview) <= new Date();
    },
    [spacedData],
  );

  const getMasteryLevel = useCallback(
    (questionId: string): number => {
      // Returns 0-100 mastery based on performance
      const stats = spacedData[questionId];
      if (!stats || stats.timesShown === 0) return 0;

      const accuracyRate = (stats.timesCorrect / stats.timesShown) * 100;
      const consistencyBonus = stats.timesShown > 3 ? 10 : 0;

      return Math.min(100, accuracyRate + consistencyBonus);
    },
    [spacedData],
  );

  const getDueQuestions = useCallback(
    (questions: { id: string }[]): string[] => {
      return questions.filter((q) => isDueForReview(q.id)).map((q) => q.id);
    },
    [isDueForReview],
  );

  const getOverallMastery = useMemo(() => {
    const questions = Object.values(spacedData);
    if (questions.length === 0) return 0;

    const totalMastery = questions.reduce((sum, q) => {
      return sum + getMasteryLevel(q.questionId);
    }, 0);

    return Math.round(totalMastery / questions.length);
  }, [spacedData, getMasteryLevel]);

  const getThemeMastery = useCallback(
    (
      questions: { id: string; theme: number }[],
    ): { [theme: number]: number } => {
      const themeMastery: {
        [theme: number]: { total: number; count: number };
      } = {};

      questions.forEach((q) => {
        const mastery = getMasteryLevel(q.id);
        if (!themeMastery[q.theme]) {
          themeMastery[q.theme] = { total: 0, count: 0 };
        }
        themeMastery[q.theme].total += mastery;
        themeMastery[q.theme].count += 1;
      });

      const result: { [theme: number]: number } = {};
      Object.keys(themeMastery).forEach((theme) => {
        const themeNum = parseInt(theme);
        result[themeNum] =
          themeMastery[themeNum].count > 0
            ? Math.round(
                themeMastery[themeNum].total / themeMastery[themeNum].count,
              )
            : 0;
      });

      return result;
    },
    [getMasteryLevel],
  );

  const resetProgress = useCallback(() => {
    setSpacedData({});
  }, [setSpacedData]);

  return {
    spacedData,
    recordAnswer,
    getQuestionStats,
    isDueForReview,
    getMasteryLevel,
    getDueQuestions,
    getOverallMastery,
    getThemeMastery,
    resetProgress,
  };
}
