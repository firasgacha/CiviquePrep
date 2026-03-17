# CiviquePrep - French Civic Exam Preparation App

<p align="center">
  <img src="../public/exam-svgrepo.svg" width="120" alt="CiviquePrep Logo" />
</p>

CiviquePrep is a comprehensive PWA (Progressive Web Application) designed to help people prepare for the French civic exam (examen civique français). It provides 190 real exam questions with various study modes, practice exams, flashcards, and gamification features to make learning engaging and effective.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technical Architecture](#technical-architecture)
4. [Project Structure](#project-structure)
5. [Components](#components)
6. [Hooks & Utilities](#hooks--utilities)
7. [Internationalization](#internationalization)
8. [PWA Configuration](#pwa-configuration)
9. [Question Data Structure](#question-data-structure)
10. [Getting Started](#getting-started)

---

## 📖 Overview

CiviquePrep is built with modern web technologies to provide an offline-capable, installable mobile-first learning application. The app is primarily focused on helping foreigners prepare for the French citizenship exam (naturalisation), but is also useful for anyone learning about French civics.

**Key Statistics:**

- 190 real exam questions
- 6 thematic categories
- 7 supported languages
- Offline-first PWA

---

## ✨ Features

### Study Modes

| Feature           | Description                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| **Training Mode** | Practice questions with immediate feedback, theme filtering, search, and spaced repetition                |
| **Exam Mode**     | Timed practice exams with various difficulty levels (Quick, Standard, Intensive, Custom, Mistakes Review) |
| **Flashcards**    | Flip-card style learning with bookmark support                                                            |
| **Notes**         | Personal note-taking for each question                                                                    |
| **Bookmarks**     | Save favorite questions for later review                                                                  |
| **Resume**        | Summary of exam history and performance                                                                   |
| **Suggestions**   | Send feedback and suggestions via email                                                                   |

### Smart Features

- **Spaced Repetition (SM-2 Algorithm)**: Questions appear based on your learning progress
- **Weak Areas Analysis**: Automatically identifies themes needing more practice
- **Gamification**: Streaks, badges, XP, and levels to motivate learning
- **Multi-language Support**: Available in French, English, Spanish, Italian, Arabic, Ukrainian, and Chinese

### Technical Features

- **PWA Support**: Installable on mobile devices, works offline
- **Dark/Light Theme**: System preference detection with manual toggle
- **Responsive Design**: Works on mobile, tablet, and desktop
- **RTL Support**: Full support for Arabic language

---

## 🏗️ Technical Architecture

### Tech Stack

| Layer                    | Technology                                        |
| ------------------------ | ------------------------------------------------- |
| **Framework**            | React 19 + TypeScript                             |
| **Build Tool**           | Vite 7                                            |
| **Styling**              | CSS (custom properties, CSS variables)            |
| **Internationalization** | i18next + react-i18next                           |
| **Email Service**        | EmailJS                                           |
| **State Management**     | React hooks (useState, useContext) + localStorage |
| **PWA**                  | Service Worker + Web App Manifest                 |

### Architecture Pattern

The application follows a component-based architecture with:

```
src/
├── components/       # React UI components
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── data/           # Static data (questions)
├── i18n/           # Internationalization files
├── types/          # TypeScript type definitions
├── App.tsx         # Main application component
└── main.tsx        # Application entry point
```

---

## 📂 Project Structure

```
CiviquePrep/
├── public/                     # Static assets
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── exam-svgrepo.svg       # App icon
│
├── .env                       # Environment variables (EmailJS config)
│
├── src/
│   ├── components/           # UI Components
│   │   ├── About.tsx         # About page
│   │   ├── Bookmarks.tsx    # Bookmarked questions
│   │   ├── Exam.tsx         # Exam practice mode
│   │   ├── ExamConfigs.ts   # Exam configuration types
│   │   ├── Flashcards.tsx   # Flashcard study mode
│   │   ├── Info.tsx         # Exam information & registration
│   │   ├── InstallPrompt.tsx # PWA install prompt
│   │   ├── LanguageSelector.tsx # Language picker
│   │   ├── Notes.tsx        # Personal notes
│   │   ├── Resume.tsx       # Performance summary
│   │   ├── ScrollToTop.tsx  # Scroll utility
│   │   ├── Suggestions.tsx  # User suggestions form
│   │   ├── ThemeToggle.tsx  # Dark/light mode toggle
│   │   ├── Training.tsx     # Training mode
│   │   └── UpdateNotification.tsx # PWA update notification
│   │
│   ├── contexts/
│   │   └── ThemeContext.tsx # Theme management
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useBookmarks.ts        # Bookmark management
│   │   ├── useGamification.ts     # Gamification system
│   │   ├── useLocalStorage.ts    # localStorage wrapper
│   │   ├── useSpacedRepetition.ts # SM-2 algorithm
│   │   └── useWeakAreas.ts       # Weak area analysis
│   │
│   ├── data/
│   │   └── questions.ts     # 190 exam questions
│   │
│   ├── i18n/
│   │   ├── index.ts         # i18next configuration
│   │   └── locales/         # Translation files
│   │       ├── ar.json      # Arabic
│   │       ├── en.json      # English
│   │       ├── es.json      # Spanish
│   │       ├── fr.json      # French
│   │       ├── it.json      # Italian
│   │       ├── uk.json      # Ukrainian
│   │       └── zh.json      # Chinese
│   │
│   ├── types/
│   │   └── index.ts         # TypeScript definitions
│   │
│   ├── App.css             # Global styles
│   ├── App.tsx             # Main component
│   └── main.tsx            # Entry point
│
├── package.json            # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
└── eslint.config.js       # ESLint config
```

---

## 🧩 Components

### Navigation & Layout

#### [`App.tsx`](src/App.tsx:1)

Main application component that handles routing between different tabs (views). Uses React state to manage active tab and integrates all major features.

**Key Features:**

- Tab-based navigation
- Language and theme controls in header
- Streak and badge display
- Gamification integration

#### [`ThemeContext.tsx`](src/contexts/ThemeContext.tsx:1)

React Context provider for dark/light theme management.

**Features:**

- System preference detection
- Manual toggle
- Persists to localStorage

---

### Study Components

#### [`Training.tsx`](src/components/Training.tsx:1)

Practice mode component with various study options.

**Features:**

- Theme filtering (6 themes)
- Question type filtering (connaissance, mise en situation)
- Search functionality
- Smart review (spaced repetition)
- Pagination (10 questions per page)
- Bookmark support
- Answer tracking

#### [`Exam.tsx`](src/components/Exam.tsx:1)

Timed exam practice with multiple difficulty levels.

**Exam Configurations:**
| Difficulty | Questions | Time | Type Mix | Pass Score |
|------------|-----------|------|----------|------------|
| Quick | 20 | 15 min | 15 Knowledge / 5 Situation | 60% |
| Standard | 50 | 35 min | 30 Knowledge / 20 Situation | 60% |
| Intensive | 80 | 60 min | 50 Knowledge / 30 Situation | 65% |
| Custom | 30 | 25 min | 20 Knowledge / 10 Situation | 60% |
| Mistakes Review | Dynamic | 30 min | Based on errors | 100% |

**Features:**

- Timer with countdown
- Question flagging
- Answer review
- Score calculation
- Exam history storage

#### [`Flashcards.tsx`](src/components/Flashcards.tsx:1)

Flip-card style study mode.

**Features:**

- Flip animation
- Navigation between cards
- Progress tracking
- Bookmark support

#### [`Bookmarks.tsx`](src/components/Bookmarks.tsx:1)

View and manage bookmarked questions.

**Features:**

- List all bookmarks
- Remove bookmarks
- Add notes to bookmarks
- Filter by theme

#### [`Notes.tsx`](src/components/Notes.tsx:1)

Personal note-taking system.

**Features:**

- Create notes for any question
- Edit existing notes
- Search notes
- Delete notes

#### [`Resume.tsx`](src/components/Resume.tsx:1)

Performance summary and history.

**Features:**

- Exam history with scores
- Theme mastery breakdown
- Weak areas identification
- Performance trends

#### [`Info.tsx`](src/components/Info.tsx:1)

Information about the French civic exam.

**Content:**

- Exam description
- Registration links (CCIP, FEI, Naturalisation)
- Exam location information

#### [`About.tsx`](src/components/About.tsx:1)

Application information and credits.

#### [`Suggestions.tsx`](src/components/Suggestions.tsx:1)

User feedback form using EmailJS for sending suggestions.

**Features:**

- Name, email (optional), and message fields
- EmailJS integration for direct email delivery
- Success/error feedback
- Dark mode support
- Loading state during submission

**Configuration:**

The component uses environment variables for EmailJS configuration:
| Variable | Description |
| -------- | ------------|
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_TARGET_EMAIL` | Target email address |

---

### UI Components

#### [`LanguageSelector.tsx`](src/components/LanguageSelector.tsx:1)

Dropdown for language selection with RTL support detection.

#### [`ThemeToggle.tsx`](src/components/ThemeToggle.tsx:1)

Button to toggle between dark and light themes.

#### [`InstallPrompt.tsx`](src/components/InstallPrompt.tsx:1)

PWA install prompt that appears when the app is installable.

#### [`UpdateNotification.tsx`](src/components/UpdateNotification.tsx:1)

Notification when a new app version is available.

#### [`ScrollToTop.tsx`](src/components/ScrollToTop.tsx:1)

Utility component that scrolls to top on route change.

---

## 🪝 Hooks & Utilities

### [`useLocalStorage.ts`](src/hooks/useLocalStorage.ts:1)

Custom hook for localStorage operations with type safety.

**Features:**

- JSON serialization/deserialization
- Cross-tab synchronization
- Error handling

**Usage:**

```typescript
const [value, setValue] = useLocalStorage<string>("key", "default");
```

---

### [`useSpacedRepetition.ts`](src/hooks/useSpacedRepetition.ts:1)

Implements the SM-2 spaced repetition algorithm for optimal learning.

**Key Functions:**
| Function | Description |
|----------|-------------|
| `recordAnswer()` | Record an answer and calculate next review date |
| `isDueForReview()` | Check if a question is due for review |
| `getMasteryLevel()` | Get mastery percentage (0-100) for a question |
| `getOverallMastery()` | Get average mastery across all questions |
| `getThemeMastery()` | Get mastery breakdown by theme |
| `resetProgress()` | Reset all progress data |

**SM-2 Algorithm:**

- Questions answered incorrectly reset to 1-day interval
- Correct answers increase interval by ease factor
- Ease factor adjusts based on response quality

---

### [`useGamification.ts`](src/hooks/useGamification.ts:1)

Gamification system with streaks, badges, XP, and levels.

**Available Badges:**
| Badge | Requirement | Icon |
|-------|-------------|------|
| First Question | Answer 1 question | 🎯 |
| Century | Answer 100 questions | 💯 |
| Week Streak | 7-day streak | 🔥 |
| Month Streak | 30-day streak | ⚡ |
| Perfect Exam | 100% on an exam | 🏆 |
| First Exam | Complete 1 exam | 📝 |

**Features:**

- Daily streak tracking
- XP accumulation
- Level system (100 XP per level)
- Badge unlocking

---

### [`useBookmarks.ts`](src/hooks/useBookmarks.ts:1)

Bookmark management system.

**Features:**

- Toggle bookmarks
- Add notes to bookmarks
- Separate storage for questions and flashcards
- Bookmark count tracking

---

### [`useWeakAreas.ts`](src/hooks/useWeakAreas.ts:1)

Analysis tool for identifying weak areas.

**Features:**

- Theme-based accuracy calculation
- Weakest/strongest theme identification
- Difficulty classification (easy/medium/hard)
- Study recommendations

---

## 🌍 Internationalization

### Supported Languages

| Code | Language  | Direction |
| ---- | --------- | --------- |
| fr   | French    | LTR       |
| en   | English   | LTR       |
| es   | Spanish   | LTR       |
| it   | Italian   | LTR       |
| uk   | Ukrainian | LTR       |
| zh   | Chinese   | LTR       |
| ar   | Arabic    | RTL       |

### Translation Files

Translation files are located in [`src/i18n/locales/`](src/i18n/locales/). Each file contains translations for all UI strings.

### RTL Support

Arabic language (ar) automatically enables right-to-left layout via the `dir` attribute on the main container.

---

## 📱 PWA Configuration

### Manifest ([`manifest.json`](public/manifest.json:1))

```json
{
  "name": "Préparation examen civique",
  "short_name": "CiviquePrep",
  "display": "standalone",
  "theme_color": "#1e3a6b",
  "categories": ["education", "reference"]
}
```

### Service Worker ([`sw.js`](public/sw.js:1))

The service worker implements:

- **Cache-first** strategy for static assets
- **Network-first** strategy for navigation requests
- **Offline fallback** for navigation
- **Cache versioning** for updates

**Update Flow:**

1. New version deployed
2. Service worker detects update
3. SW_ACTIVATED message sent to clients
4. Update notification appears
5. User clicks update
6. New service worker activates
7. Page reloads

---

## 📝 Question Data Structure

### Question Interface ([`types/index.ts`](src/types/index.ts:1))

```typescript
interface Question {
  num: number; // Question number
  text: string; // Question text
  options: string[]; // Answer options (A, B, C, D)
  correct: string; // Correct answer (A, B, C, or D)
  theme: number; // Theme category (1-6)
  id: string; // Unique identifier
  revealed?: boolean; // Whether answer was revealed
  type?: "connaissance" | "mise en situation"; // Question type
  list?: "csp" | "cr"; // Question list (optional)
}
```

### Theme Categories

| ID  | Theme              | Description                         |
| --- | ------------------ | ----------------------------------- |
| 0   | Tous               | All themes                          |
| 1   | Principes          | Principles & values of the Republic |
| 2   | Institutions       | French institutions                 |
| 3   | Droits & devoirs   | Rights & duties                     |
| 4   | Histoire & culture | History & culture                   |
| 5   | Vie sociale        | Social life                         |
| 6   | Vie quotidienne    | Daily life                          |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
cd CiviquePrep

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run lint`    | Run ESLint               |
| `npm run preview` | Preview production build |

---

## 📄 License

Copyright © 2024 CiviquePrep. All rights reserved.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- Internationalization by [i18next](https://www.i18next.com/)
- Spaced repetition based on [SM-2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
