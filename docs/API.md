# CiviquePrep API Documentation

This document provides detailed API documentation for the custom hooks, components, and types used in CiviquePrep.

---

## Table of Contents

1. [Type Definitions](#type-definitions)
2. [Hooks API](#hooks-api)
3. [Component Props](#component-props)
4. [localStorage Keys](#localstorage-keys)

---

## Type Definitions

All types are defined in [`src/types/index.ts`](src/types/index.ts:1).

### Question

```typescript
interface Question {
  num: number;
  text: string;
  options: string[];
  correct: string;
  theme: number;
  id: string;
  revealed?: boolean;
  type?: "connaissance" | "mise en situation";
  list?: "csp" | "cr";
}
```

### Tab

```typescript
type Tab =
  | "train"
  | "exam"
  | "resume"
  | "notes"
  | "info"
  | "bookmarks"
  | "about"
  | "flashcards";
```

### ExamState

```typescript
interface ExamState {
  active: boolean;
  finished: boolean;
  questions: Question[];
  answers: (string | null)[];
  index: number;
  timer: number;
}
```

### ExamDifficulty

```typescript
type ExamDifficulty =
  | "quick"
  | "standard"
  | "intensive"
  | "custom"
  | "mistakes";
```

### ExamConfig

```typescript
interface ExamConfig {
  name: string;
  questionCount: number;
  timeLimit: number;
  questionTypes: { connaissance: number; miseEnSituation: number };
  passingScore: number;
}
```

### Theme Names

```typescript
const THEME_NAMES: { [key: number]: string } = {
  0: "Tous",
  1: "Principes",
  2: "Institutions",
  3: "Droits & devoirs",
  4: "Histoire & culture",
  5: "Vie sociale",
  6: "Vie quotidienne",
};
```

---

## Hooks API

### useLocalStorage

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void];
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| key | string | localStorage key |
| initialValue | T | Default value |

**Returns:**

- `value`: Current stored value
- `setValue`: Function to update value

---

### useSpacedRepetition

```typescript
function useSpacedRepetition(): {
  spacedData: UserSpacedRepetition;
  recordAnswer: (questionId: string, isCorrect: boolean) => void;
  getQuestionStats: (questionId: string) => QuestionStats | null;
  isDueForReview: (questionId: string) => boolean;
  getMasteryLevel: (questionId: string) => number;
  getDueQuestions: (questions: { id: string }[]) => string[];
  getOverallMastery: () => number;
  getThemeMastery: (questions: { id: string; theme: number }[]) => {
    [theme: number]: number;
  };
  resetProgress: () => void;
};
```

**QuestionStats Interface:**

```typescript
interface QuestionStats {
  questionId: string;
  timesShown: number;
  timesCorrect: number;
  lastAnswered: string;
  easeFactor: number;
  interval: number;
  nextReview: string;
}
```

**SM-2 Algorithm Details:**

- Initial ease factor: 2.5
- Minimum ease factor: 1.3
- Incorrect answer: interval resets to 1 day
- Correct answer: interval = interval × ease factor
- Ease adjustment: ease + (0.1 - (5 - quality) × (0.08 + (5 - quality) × 0.02))

---

### useGamification

```typescript
function useGamification(
  answeredQuestionsCount: number,
  examHistory: { score: number; total: number }[],
): {
  streak: UserStreak;
  earnedBadges: Badge[];
  lockedBadges: Badge[];
  level: number;
  xp: number;
  recordPractice: () => void;
  checkBadges: () => void;
  getProgressToNextBadge: () => {
    badge: Badge;
    progress: number;
    current: number;
    target: number;
  } | null;
};
```

**UserStreak Interface:**

```typescript
interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string;
  totalPracticeDays: number;
}
```

**Badge Interface:**

```typescript
interface Badge {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  earnedAt?: string;
  requirement: BadgeRequirement;
}

interface BadgeRequirement {
  type: "streak" | "exams" | "questions" | "themes" | "accuracy";
  target: number;
}
```

**Available Badges:**

```typescript
const BADGES: Badge[] = [
  { id: "first-question", requirement: { type: "questions", target: 1 } },
  { id: "hundred-questions", requirement: { type: "questions", target: 100 } },
  { id: "streak-7", requirement: { type: "streak", target: 7 } },
  { id: "streak-30", requirement: { type: "streak", target: 30 } },
  { id: "perfect-exam", requirement: { type: "accuracy", target: 100 } },
  { id: "first-exam", requirement: { type: "exams", target: 1 } },
];
```

---

### useBookmarks

```typescript
function useBookmarks(type: "questions" | "flashcards" = "questions"): {
  bookmarks: UserBookmarks;
  isBookmarked: (questionId: string) => boolean;
  toggleBookmark: (questionId: string) => void;
  addNote: (questionId: string, note: string) => void;
  removeBookmark: (questionId: string) => void;
  bookmarkCount: number;
  bookmarkedIds: string[];
};
```

**BookmarkedQuestion Interface:**

```typescript
interface BookmarkedQuestion {
  questionId: string;
  bookmarkedAt: string;
  notes?: string;
}
```

---

### useWeakAreas

```typescript
function useWeakAreas(
  questions: { id: string; theme: number }[],
  themeNames: { [key: number]: string },
): {
  weakestThemes: ThemeAnalysis[];
  strongestThemes: ThemeAnalysis[];
  needsWork: boolean;
  allThemes: ThemeAnalysis[];
  getRecommendedThemes: ThemeAnalysis[];
};
```

**ThemeAnalysis Interface:**

```typescript
interface ThemeAnalysis {
  themeId: number;
  themeName: string;
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number;
  masteryLevel: number;
  difficulty: "easy" | "medium" | "hard";
}
```

---

## Component Props

### Training Props

```typescript
interface TrainingProps {
  questions: Question[];
}
```

### Exam Props

```typescript
interface ExamProps {
  questions: Question[];
}
```

### Flashcards Props

```typescript
interface FlashcardsProps {
  questions: Question[];
}
```

### Bookmarks Props

```typescript
interface BookmarksProps {
  questions: Question[];
}
```

### Resume Props

```typescript
interface ResumeProps {
  questions: Question[];
}
```

---

## localStorage Keys

| Key                           | Type                              | Description            |
| ----------------------------- | --------------------------------- | ---------------------- |
| `theme`                       | `"light" \| "dark"`               | Current theme          |
| `civique-training-selections` | `Record<string, string>`          | Training answers       |
| `civique-exam-history`        | `Array<{id, date, score, total}>` | Exam history           |
| `civique-gamification`        | `UserGamification`                | Gamification data      |
| `civique-spaced-repetition`   | `UserSpacedRepetition`            | Spaced repetition data |
| `civique-bookmarks`           | `UserBookmarks`                   | Question bookmarks     |
| `civique-flashcard-bookmarks` | `UserBookmarks`                   | Flashcard bookmarks    |
| `civique-notes`               | `Record<string, string>`          | User notes             |

---

## i18n Keys

### Supported Languages

- `fr` - French (default)
- `en` - English
- `es` - Spanish
- `it` - Italian
- `uk` - Ukrainian
- `zh` - Chinese
- `ar` - Arabic (RTL)

### Key Categories

- Navigation: `training`, `exam`, `flashcards`, `bookmarks`, `notes`, `resume`, `info`, `aboutTitle`
- Badges: `badge_*`
- Streaks: `dayStreak`
- Updates: `updateAvailable`, `updateNow`
- Titles: `title`, `subtitle`, `infoTitle`, etc.
