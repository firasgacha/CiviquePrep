# CiviquePrep Feature Roadmap

## Overview

This document outlines the planned features for enhancing the CiviquePrep application - a French citizenship exam preparation platform.

---

## Feature 1: Question Bookmarks/Favorites

### Description

Allow users to bookmark and save difficult questions for later review, separate from flagged exam questions.

### User Stories

- As a user, I want to bookmark a question so I can review it later
- As a user, I want to view all my bookmarked questions in one place
- As a user, I want to remove bookmarks from questions

### Technical Specification

#### Data Structure

```typescript
interface BookmarkedQuestion {
  questionId: string;
  bookmarkedAt: string; // ISO date
  notes?: string; // optional user notes
}

interface UserBookmarks {
  [questionId: string]: BookmarkedQuestion;
}
```

#### Storage

- Key: `civique-bookmarks`
- Type: `UserBookmarks`

#### UI Components

**Training Tab:**

- Add bookmark icon (⭐) next to each question
- Toggle bookmark on click
- Show filled star when bookmarked

**New "Bookmarks" Tab:**

- List all bookmarked questions
- Group by theme
- Allow removal of bookmarks
- Allow adding personal notes

**Resume Tab:**

- Show bookmark count in stats

---

## Feature 2: Spaced Repetition System

### Description

Prioritize questions the user gets wrong more frequently, using a spaced repetition algorithm to optimize learning.

### User Stories

- As a user, I want questions I get wrong to appear more frequently
- As a user, I want questions I get right consistently to appear less often
- As a user, I want to see my mastery level for each theme

### Technical Specification

#### Data Structure

```typescript
interface QuestionStats {
  questionId: string;
  timesShown: number;
  timesCorrect: number;
  lastAnswered: string; // ISO date
  easeFactor: number; // SM-2 algorithm factor (default 2.5)
  interval: number; // days until next review
  nextReview: string; // ISO date
}

interface UserSpacedRepetition {
  [questionId: string]: QuestionStats;
}
```

#### Algorithm: SM-2 Simplified

```typescript
function calculateNextReview(
  easeFactor: number,
  interval: number,
  quality: number, // 0-5, where 5 = perfect answer
): { easeFactor: number; interval: number; nextReview: Date } {
  // quality < 3 means wrong answer, reset interval
  if (quality < 3) {
    return {
      easeFactor: Math.max(1.3, easeFactor - 0.2),
      interval: 1,
      nextReview: addDays(new Date(), 1),
    };
  }

  // Correct answer
  const newInterval = interval === 0 ? 1 : interval * easeFactor;
  const newEaseFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  return {
    easeFactor: Math.max(1.3, newEaseFactor),
    interval: Math.round(newInterval),
    nextReview: addDays(new Date(), Math.round(newInterval)),
  };
}
```

#### Storage

- Key: `civique-spaced-repetition`
- Type: `UserSpacedRepetition`

#### UI Components

**Training Tab:**

- Add "Smart Review" filter option
- Show mastery percentage per question
- Prioritize due questions at top

**Resume Tab:**

- Show overall mastery score
- Show per-theme mastery levels

---

## Feature 3: Weak Areas Analysis

### Description

Analyze user's incorrect answers to identify themes they struggle with and provide targeted recommendations.

### User Stories

- As a user, I want to see which themes I'm weakest in
- As a user, I want recommendations on what to study next
- As a user, I want visual charts showing my performance by theme

### Technical Specification

#### Data Structure

```typescript
interface ThemeAnalysis {
  themeId: number;
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number;
  recentAccuracy: number; // last 20 answers
  difficulty: "easy" | "medium" | "hard";
  recommendedAction: string;
}

interface WeakAreasReport {
  weakestThemes: ThemeAnalysis[];
  strongestThemes: ThemeAnalysis[];
  lastAnalyzed: string;
}
```

#### Analysis Algorithm

```typescript
function analyzeWeakAreas(
  trainingSelections: UserSelections,
  questions: Question[],
): WeakAreasReport {
  // Group answers by theme
  // Calculate accuracy per theme
  // Compare recent vs overall performance
  // Identify trends (improving vs declining)
  // Generate recommendations
}
```

#### Storage

- Key: `civique-weak-areas`
- Type: `WeakAreasReport`
- Update: After each training session or on Resume tab access

#### UI Components

**Resume Tab (Enhanced):**

- Add "Weak Areas" section
- Horizontal bar chart showing accuracy per theme
- Color-coded difficulty indicators
- Study recommendations with links

---

## Feature 4: Question Difficulty Tracking

### Description

Automatically track and display difficulty ratings for each question based on user performance data.

### User Stories

- As a user, I want to see how difficult others find each question
- As a user, I want difficult questions highlighted during practice

### Technical Specification

#### Data Structure

```typescript
interface QuestionDifficulty {
  questionId: string;
  globalAccuracy: number; // aggregated from all users (if shared)
  userAccuracy: number; // personal accuracy
  difficulty: "easy" | "medium" | "hard";
  totalAttempts: number;
}

interface GlobalDifficulty {
  [questionId: string]: QuestionDifficulty;
}
```

#### Difficulty Calculation

```typescript
function calculateDifficulty(userAccuracy: number): "easy" | "medium" | "hard" {
  if (userAccuracy >= 80) return "easy";
  if (userAccuracy >= 50) return "medium";
  return "hard";
}
```

#### Storage

- Key: `civique-question-difficulty`
- Type: `GlobalDifficulty`
- Sync: Optional cloud sync (future)

#### UI Components

**Training Tab:**

- Add difficulty badge to each question (color-coded)
- Filter by difficulty level

**Exam Tab:**

- Show difficulty indicator during exam (optional)

---

## Feature 5: Gamification (Streaks & Badges)

### Description

Add motivational elements like daily practice streaks and achievement badges.

### User Stories

- As a user, I want to maintain a daily practice streak
- As a user, I want to earn badges for achievements
- As a user, I want to see my progress visually

### Technical Specification

#### Data Structure

```typescript
interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string; // ISO date
  totalPracticeDays: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  requirement: BadgeRequirement;
}

interface BadgeRequirement {
  type: "streak" | "exams" | "questions" | "themes" | "accuracy";
  target: number;
}

interface UserGamification {
  streak: UserStreak;
  badges: Badge[];
  level: number;
  xp: number;
}
```

#### Badge Definitions

```typescript
const BADGES = [
  { id: "first-question", name: "First Step", type: "questions", target: 1 },
  {
    id: "hundred-questions",
    name: "Centurion",
    type: "questions",
    target: 100,
  },
  { id: "streak-7", name: "Week Warrior", type: "streak", target: 7 },
  { id: "streak-30", name: "Monthly Master", type: "streak", target: 30 },
  { id: "perfect-exam", name: "Perfect Score", type: "accuracy", target: 100 },
  { id: "all-themes", name: "Theme Explorer", type: "themes", target: 6 },
];
```

#### Storage

- Key: `civique-gamification`
- Type: `UserGamification`

#### UI Components

**Header:**

- Show streak flame icon with count
- Show XP/level indicator

**New "Achievements" Tab:**

- Grid of badges (earned and locked)
- Progress toward next badge
- Streak calendar

---

## Feature 6: Multiple Exam Difficulty Levels

### Description

Allow users to choose different exam difficulty levels with varying time limits and question counts.

### User Stories

- As a user, I want to take an easy exam for quick practice
- As a user, I want to take a hard exam to test my full knowledge

### Technical Specification

#### Exam Configurations

```typescript
interface ExamConfig {
  name: string;
  questionCount: number;
  timeLimit: number; // minutes
  questionTypes: {
    connaissance: number;
    miseEnSituation: number;
  };
  passingScore: number;
}

const EXAM_CONFIGS: Record<string, ExamConfig> = {
  quick: {
    name: "Quick Practice",
    questionCount: 20,
    timeLimit: 15,
    questionTypes: { connaissance: 15, miseEnSituation: 5 },
    passingScore: 60,
  },
  standard: {
    name: "Standard",
    questionCount: 50,
    timeLimit: 35,
    questionTypes: { connaissance: 30, miseEnSituation: 20 },
    passingScore: 60,
  },
  intensive: {
    name: "Intensive",
    questionCount: 80,
    timeLimit: 60,
    questionTypes: { connaissance: 50, miseEnSituation: 30 },
    passingScore: 65,
  },
  custom: {
    name: "Custom",
    questionCount: 0, // user selects
    timeLimit: 0,
    questionTypes: { connaissance: 0, miseEnSituation: 0 },
    passingScore: 60,
  },
};
```

#### Storage

- Add `examDifficulty` to exam history entries

#### UI Components

**Exam Tab (Updated):**

- Dropdown/difficulty selector before starting
- Show time/question count per option
- Option to customize exam (custom mode)

---

## Implementation Priority

| Priority | Feature                | Estimated Effort | Impact |
| -------- | ---------------------- | ---------------- | ------ |
| 1        | Bookmarks/Favorites    | Medium           | High   |
| 2        | Spaced Repetition      | Medium           | High   |
| 3        | Weak Areas Analysis    | Low              | Medium |
| 4        | Exam Difficulty Levels | Low              | Medium |
| 5        | Gamification           | High             | Medium |
| 6        | Question Difficulty    | Low              | Low    |

---

## Technical Debt & Improvements

### Recommended Code Changes

1. **Create shared hooks:**
   - `useBookmarks()` - hook for bookmark operations
   - `useSpacedRepetition()` - hook for SR operations
   - `useAnalytics()` - hook for statistics

2. **Create shared utilities:**
   - `analytics.ts` - calculations for weak areas, difficulty
   - `gamification.ts` - badge checking, XP calculations

3. **Component Updates:**
   - Add new "Bookmarks" tab to navigation
   - Enhance Resume tab with charts
   - Add achievement popup component
