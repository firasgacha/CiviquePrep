import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Question } from '../types';
import { useBookmarks } from '../hooks/useBookmarks';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';

interface FlashcardsProps {
    questions: Question[];
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function Flashcards({ questions }: FlashcardsProps) {
    const { t } = useTranslation();
    const [selectedList, setSelectedList] = useState<'csp' | 'cr' | null>(null);
    const [currentTheme, setCurrentTheme] = useState<number>(0);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [isShuffled, setIsShuffled] = useState<boolean>(false);
    const [sessionOrder, setSessionOrder] = useState<string[]>([]);
    const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
    const [sessionComplete, setSessionComplete] = useState<boolean>(false);
    const [smartReview, setSmartReview] = useState<boolean>(false);

    const { isBookmarked, toggleBookmark } = useBookmarks('flashcards');
    const { recordAnswer, isDueForReview } = useSpacedRepetition();

    // Handle list selection
    const handleListSelect = (list: 'csp' | 'cr') => {
        setSelectedList(list);
        resetSession();
    };

    // Reset session
    const resetSession = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setKnownCards(new Set());
        setSessionComplete(false);
    };

    // Reset to list selection
    const handleBackToList = () => {
        setSelectedList(null);
        setCurrentTheme(0);
        setSessionOrder([]);
        setIsShuffled(false);
        resetSession();
    };

    // Filter questions
    const filteredQuestions = useMemo(() => {
        let filtered = questions;

        // Filter by selected list (csp or cr)
        if (selectedList) {
            filtered = filtered.filter(q => q.list === selectedList);
        }

        // Filter by theme
        if (currentTheme !== 0) {
            filtered = filtered.filter(q => q.theme === currentTheme);
        }

        // Smart Review: prioritize questions due for review
        if (smartReview) {
            const dueQuestions = filtered.filter(q => isDueForReview(q.id));
            const notDue = filtered.filter(q => !isDueForReview(q.id));
            filtered = [...dueQuestions, ...notDue];
        }

        return filtered;
    }, [questions, selectedList, currentTheme, smartReview, isDueForReview]);

    // Compute session order based on filtered questions and shuffle state
    const computedSessionOrder = useMemo(() => {
        if (filteredQuestions.length === 0) return [];
        const ids = filteredQuestions.map(q => q.id);
        return isShuffled ? shuffleArray(ids) : ids;
    }, [filteredQuestions, isShuffled]);

    // Sync computed order to state when it changes
    useEffect(() => {
        setSessionOrder(computedSessionOrder);
    }, [computedSessionOrder]);

    // Get current question
    const currentQuestion = useMemo(() => {
        if (sessionOrder.length === 0) return null;
        const questionId = sessionOrder[currentIndex];
        return filteredQuestions.find(q => q.id === questionId) || null;
    }, [sessionOrder, currentIndex, filteredQuestions]);

    // Handle shuffle toggle
    const handleShuffle = () => {
        setIsShuffled(!isShuffled);
        setSessionOrder(shuffleArray([...sessionOrder]));
    };

    // Handle reset order
    const handleResetOrder = () => {
        setIsShuffled(false);
        setSessionOrder(filteredQuestions.map(q => q.id));
        setCurrentIndex(0);
    };

    // Handle flip
    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    // Handle card navigation
    const goToNextCard = () => {
        if (currentIndex < sessionOrder.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        } else {
            setSessionComplete(true);
        }
    };

    const goToPrevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    // Handle known/review actions
    const handleKnown = () => {
        if (currentQuestion) {
            setKnownCards(prev => new Set(prev).add(currentQuestion.id));
            recordAnswer(currentQuestion.id, true);
            goToNextCard();
        }
    };

    const handleReviewAgain = () => {
        if (currentQuestion) {
            recordAnswer(currentQuestion.id, false);
            goToNextCard();
        }
    };

    // Handle theme change
    const handleThemeChange = (theme: number) => {
        setCurrentTheme(theme);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    // Render list selection screen
    if (selectedList === null) {
        return (
            <div className="tab-content">
                <h2 className="list-selection-title">{t('selectQuestionList')}</h2>
                <div className="list-selection-grid">
                    <button
                        className="list-selection-btn csp"
                        onClick={() => handleListSelect('csp')}
                    >
                        <span className="list-name">{t('cspList')}</span>
                        <span className="list-count">{questions.filter(q => q.list === 'csp').length} {t('questions')}</span>
                    </button>
                    <button
                        className="list-selection-btn cr"
                        onClick={() => handleListSelect('cr')}
                    >
                        <span className="list-name">{t('crList')}</span>
                        <span className="list-count">{questions.filter(q => q.list === 'cr').length} {t('questions')}</span>
                    </button>
                </div>
            </div>
        );
    }

    // Render session complete screen
    if (sessionComplete) {
        const cardsToReview = sessionOrder.length - knownCards.size;

        return (
            <div className="tab-content flashcard-session-complete">
                <h2>🎉 {t('sessionComplete')}</h2>

                <div className="session-stats">
                    <div className="stat-card">
                        <span className="stat-number">{sessionOrder.length}</span>
                        <span className="stat-label">{t('cardsReviewed')}</span>
                    </div>
                    <div className="stat-card known">
                        <span className="stat-number">{knownCards.size}</span>
                        <span className="stat-label">{t('cardsKnown')}</span>
                    </div>
                    <div className="stat-card review">
                        <span className="stat-number">{cardsToReview}</span>
                        <span className="stat-label">{t('cardsToReview')}</span>
                    </div>
                </div>

                <div className="session-actions">
                    <button className="btn-primary" onClick={resetSession}>
                        {t('restartSession')}
                    </button>
                    <button className="btn-secondary" onClick={handleBackToList}>
                        {t('backToSelection')}
                    </button>
                </div>
            </div>
        );
    }

    // Render theme filter and flashcard view
    return (
        <div className="tab-content">
            {/* Back Button */}
            <button className="back-btn" onClick={handleBackToList}>
                ← {t('backToList')}
            </button>

            {/* Theme Filter */}
            <div className="theme-grid">
                <button
                    className={`theme-btn ${currentTheme === 0 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(0)}
                >
                    {t('all')}
                </button>
                <button
                    className={`theme-btn ${currentTheme === 1 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(1)}
                >
                    1. {t('principles')}
                </button>
                <button
                    className={`theme-btn ${currentTheme === 2 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(2)}
                >
                    2. {t('institutions')}
                </button>
                <button
                    className={`theme-btn ${currentTheme === 3 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(3)}
                >
                    3. {t('rights')}
                </button>
                <button
                    className={`theme-btn ${currentTheme === 4 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(4)}
                >
                    4. {t('history')}
                </button>
                <button
                    className={`theme-btn ${currentTheme === 5 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(5)}
                >
                    5. {t('social')}
                </button>
                <button
                    className={`theme-btn ${currentTheme === 6 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(6)}
                >
                    6. {t('daily')}
                </button>
            </div>

            {/* Smart Review Toggle */}
            <div className="smart-review-toggle">
                <label className="toggle-label">
                    <input
                        type="checkbox"
                        checked={smartReview}
                        onChange={(e) => setSmartReview(e.target.checked)}
                    />
                    <span>{t('smartReviewFlashcards')}</span>
                </label>
            </div>

            {/* Flashcard */}
            {currentQuestion && (
                <div className="flashcard-container">
                    <div
                        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                        onClick={handleFlip}
                    >
                        <div className="flashcard-inner">
                            {/* Front - Question */}
                            <div className="flashcard-front">
                                <div className="flashcard-header">
                                    <span className="question-number">#{currentQuestion.num}</span>
                                    <span className="question-type">
                                        {currentQuestion.type === 'mise en situation' ? t('situation') : t('knowledge')}
                                    </span>
                                    <button
                                        className={`bookmark-btn ${isBookmarked(currentQuestion.id) ? 'bookmarked' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleBookmark(currentQuestion.id);
                                        }}
                                    >
                                        {isBookmarked(currentQuestion.id) ? '⭐' : '☆'}
                                    </button>
                                </div>
                                <div className="flashcard-question">
                                    {currentQuestion.text}
                                </div>
                                <div className="flashcard-hint">
                                    {t('flipCard')}
                                </div>
                            </div>

                            {/* Back - Answer */}
                            <div className="flashcard-back">
                                <div className="flashcard-header">
                                    <span className="answer-label">{t('showAnswer')}</span>
                                </div>
                                <div className="flashcard-correct-answer">
                                    {(() => {
                                        const letter = currentQuestion.correct;
                                        const index = letter.charCodeAt(0) - 65;
                                        return (
                                            <div className="correct-option">
                                                <span className="option-letter">{letter}</span>
                                                <span className="option-text">{currentQuestion.options[index]}</span>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flashcard-controls">
                <div className="control-row">
                    <button
                        className="nav-btn"
                        onClick={goToPrevCard}
                        disabled={currentIndex === 0}
                    >
                        ←
                    </button>

                    <div className="progress-indicator">
                        <span className="current">{currentIndex + 1}</span>
                        <span className="separator">/</span>
                        <span className="total">{sessionOrder.length}</span>
                    </div>

                    <button
                        className="nav-btn"
                        onClick={goToNextCard}
                        disabled={currentIndex === sessionOrder.length - 1}
                    >
                        →
                    </button>
                </div>

                <div className="action-row">
                    {isFlipped ? (
                        <>
                            <button
                                className="action-btn review"
                                onClick={handleReviewAgain}
                            >
                                {t('reviewAgain')}
                            </button>
                            <button
                                className="action-btn known"
                                onClick={handleKnown}
                            >
                                {t('known')}
                            </button>
                        </>
                    ) : (
                        <button
                            className="action-btn flip"
                            onClick={handleFlip}
                        >
                            {t('showAnswer')}
                        </button>
                    )}
                </div>

                <div className="shuffle-row">
                    <button
                        className={`shuffle-btn ${isShuffled ? 'active' : ''}`}
                        onClick={handleShuffle}
                    >
                        🔀 {t('shuffle')}
                    </button>
                    {isShuffled && (
                        <button
                            className="shuffle-btn reset"
                            onClick={handleResetOrder}
                        >
                            {t('resetShuffle')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
