import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface Badge {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  earnedAt?: string;
  requirement: BadgeRequirement;
}

export interface BadgeRequirement {
  type: "streak" | "exams" | "questions" | "themes" | "accuracy";
  target: number;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string;
  totalPracticeDays: number;
}

export interface UserGamification {
  streak: UserStreak;
  earnedBadges: string[];
  level: number;
  xp: number;
}

const STORAGE_KEY = "civique-gamification";

export const BADGES: Badge[] = [
  {
    id: "first-question",
    nameKey: "badge_first_question",
    descriptionKey: "badge_first_question_desc",
    icon: "🎯",
    requirement: { type: "questions", target: 1 },
  },
  {
    id: "hundred-questions",
    nameKey: "badge_hundred",
    descriptionKey: "badge_hundred_desc",
    icon: "💯",
    requirement: { type: "questions", target: 100 },
  },
  {
    id: "streak-7",
    nameKey: "badge_streak_7",
    descriptionKey: "badge_streak_7_desc",
    icon: "🔥",
    requirement: { type: "streak", target: 7 },
  },
  {
    id: "streak-30",
    nameKey: "badge_streak_30",
    descriptionKey: "badge_streak_30_desc",
    icon: "⚡",
    requirement: { type: "streak", target: 30 },
  },
  {
    id: "perfect-exam",
    nameKey: "badge_perfect",
    descriptionKey: "badge_perfect_desc",
    icon: "🏆",
    requirement: { type: "accuracy", target: 100 },
  },
  {
    id: "first-exam",
    nameKey: "badge_first_exam",
    descriptionKey: "badge_first_exam_desc",
    icon: "📝",
    requirement: { type: "exams", target: 1 },
  },
];

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0] === dateStr;
}

function isToday(dateStr: string): boolean {
  return getTodayString() === dateStr;
}

export function useGamification(
  answeredQuestionsCount: number,
  examHistory: { score: number; total: number }[],
) {
  const [gamification, setGamification] = useLocalStorage<UserGamification>(
    STORAGE_KEY,
    {
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastPracticeDate: "",
        totalPracticeDays: 0,
      },
      earnedBadges: [],
      level: 1,
      xp: 0,
    },
  );

  // Record practice activity (call this when user answers questions)
  const recordPractice = useCallback(() => {
    const today = getTodayString();
    const lastPractice = gamification.streak.lastPracticeDate;

    setGamification((prev) => {
      const newStreak = { ...prev.streak };

      if (isToday(lastPractice)) {
        // Already practiced today, no streak change
        return prev;
      } else if (isYesterday(lastPractice)) {
        // Continuing streak
        newStreak.currentStreak += 1;
        newStreak.totalPracticeDays += 1;
      } else {
        // Streak broken, start new
        newStreak.currentStreak = 1;
        newStreak.totalPracticeDays += 1;
      }

      newStreak.lastPracticeDate = today;

      if (newStreak.currentStreak > newStreak.longestStreak) {
        newStreak.longestStreak = newStreak.currentStreak;
      }

      // Add XP for practice
      const newXp = prev.xp + 10;

      return {
        ...prev,
        streak: newStreak,
        xp: newXp,
        level: Math.floor(newXp / 100) + 1,
      };
    });
  }, [gamification.streak.lastPracticeDate, setGamification]);

  // Check and award badges
  const checkBadges = useCallback(() => {
    const examsTaken = examHistory.length;
    const averageAccuracy =
      examsTaken > 0
        ? examHistory.reduce((sum, e) => sum + (e.score / e.total) * 100, 0) /
          examsTaken
        : 0;

    const newBadges: string[] = [];

    BADGES.forEach((badge) => {
      if (gamification.earnedBadges.includes(badge.id)) return;

      let earned = false;

      switch (badge.requirement.type) {
        case "questions":
          earned = answeredQuestionsCount >= badge.requirement.target;
          break;
        case "streak":
          earned =
            gamification.streak.currentStreak >= badge.requirement.target;
          break;
        case "exams":
          earned = examsTaken >= badge.requirement.target;
          break;
        case "accuracy":
          earned =
            averageAccuracy >= badge.requirement.target && examsTaken >= 3;
          break;
      }

      if (earned) {
        newBadges.push(badge.id);
      }
    });

    if (newBadges.length > 0) {
      setGamification((prev) => ({
        ...prev,
        earnedBadges: [...prev.earnedBadges, ...newBadges],
      }));
    }
  }, [answeredQuestionsCount, examHistory, gamification, setGamification]);

  const getEarnedBadges = useMemo(() => {
    return BADGES.filter((b) => gamification.earnedBadges.includes(b.id));
  }, [gamification.earnedBadges]);

  const getLockedBadges = useMemo(() => {
    return BADGES.filter((b) => !gamification.earnedBadges.includes(b.id));
  }, [gamification.earnedBadges]);

  const getProgressToNextBadge = useMemo(() => {
    const nextBadge = getLockedBadges[0];
    if (!nextBadge) return null;

    let progress = 0;
    const target = nextBadge.requirement.target;

    switch (nextBadge.requirement.type) {
      case "questions":
        progress = answeredQuestionsCount;
        break;
      case "streak":
        progress = gamification.streak.currentStreak;
        break;
      case "exams":
        progress = examHistory.length;
        break;
    }

    return {
      badge: nextBadge,
      progress: Math.min(100, (progress / target) * 100),
      current: progress,
      target,
    };
  }, [
    answeredQuestionsCount,
    examHistory.length,
    gamification.streak.currentStreak,
    getLockedBadges,
  ]);

  return {
    streak: gamification.streak,
    earnedBadges: getEarnedBadges,
    lockedBadges: getLockedBadges,
    level: gamification.level,
    xp: gamification.xp,
    recordPractice,
    checkBadges,
    getProgressToNextBadge,
  };
}
