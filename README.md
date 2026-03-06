# CiviquePrep - French Civic Exam Preparation App

<p align="center">
  <img src="public/exam-svgrepo.svg" width="120" alt="CiviquePrep Logo" />
</p>

CiviquePrep is a comprehensive PWA (Progressive Web Application) designed to help people prepare for the French civic exam (examen civique français). It provides 190 real exam questions with various study modes, practice exams, flashcards, and gamification features.

## 📋 Quick Links

- **[Full Documentation](docs/README.md)** - Complete application documentation
- **[API Reference](docs/API.md)** - Hooks, types, and component APIs

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## ✨ Features

- **Training Mode** - Practice questions with immediate feedback
- **Exam Mode** - Timed practice exams (Quick, Standard, Intensive, Custom, Mistakes Review)
- **Flashcards** - Flip-card style learning
- **Bookmarks & Notes** - Save questions for later
- **Spaced Repetition** - SM-2 algorithm for optimal learning
- **Gamification** - Streaks, badges, XP, and levels
- **Multi-language** - French, English, Spanish, Italian, Arabic, Ukrainian, Chinese
- **PWA** - Installable, works offline

## 📁 Project Structure

```
CiviquePrep/
├── src/
│   ├── components/     # React UI components
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React Context providers
│   ├── data/           # Question data
│   ├── i18n/           # Translations
│   └── types/          # TypeScript types
├── docs/               # Documentation
├── public/             # Static assets & PWA
└── package.json
```

## Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Framework  | React 19 + TypeScript             |
| Build Tool | Vite 7                            |
| Styling    | CSS                               |
| i18n       | i18next                           |
| PWA        | Service Worker + Web App Manifest |

## 📄 License

Copyright © 2024 CiviquePrep. All rights reserved.

---

_For detailed documentation, see [docs/README.md](docs/README.md)_
