import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBookmarks } from '../hooks/useBookmarks';
import type { Question } from '../types';

interface BookmarksProps {
    questions: Question[];
}

export function Bookmarks({ questions }: BookmarksProps) {
    const { t } = useTranslation();
    const [bookmarkType, setBookmarkType] = useState<'questions' | 'flashcards'>('questions');

    // Question bookmarks
    const { bookmarks: questionBookmarks, isBookmarked: isQuestionBookmarked, toggleBookmark: toggleQuestionBookmark, bookmarkCount: questionBookmarkCount } = useBookmarks('questions');

    // Flashcard bookmarks
    const { bookmarks: flashcardBookmarks, isBookmarked: isFlashcardBookmarked, toggleBookmark: toggleFlashcardBookmark, bookmarkCount: flashcardBookmarkCount } = useBookmarks('flashcards');

    const [showCorrection, setShowCorrection] = useState<boolean>(false);
    const [selectedTheme, setSelectedTheme] = useState<number>(0);

    // Get bookmarked questions based on current type
    const isBookmarked = bookmarkType === 'questions' ? isQuestionBookmarked : isFlashcardBookmarked;
    const toggleBookmark = bookmarkType === 'questions' ? toggleQuestionBookmark : toggleFlashcardBookmark;
    const bookmarks = bookmarkType === 'questions' ? questionBookmarks : flashcardBookmarks;
    const bookmarkCount = bookmarkType === 'questions' ? questionBookmarkCount : flashcardBookmarkCount;

    // Get bookmarked questions
    const bookmarkedQuestions = useMemo(() => {
        return questions.filter(q => isBookmarked(q.id));
    }, [questions, isBookmarked]);

    // Filter by theme
    const filteredQuestions = useMemo(() => {
        if (selectedTheme === 0) return bookmarkedQuestions;
        return bookmarkedQuestions.filter(q => q.theme === selectedTheme);
    }, [bookmarkedQuestions, selectedTheme]);

    // Check if there are any bookmarks at all
    const hasAnyBookmarks = questionBookmarkCount > 0 || flashcardBookmarkCount > 0;

    if (!hasAnyBookmarks) {
        return (
            <div className="tab-content">
                <h2>{t('bookmarks')}</h2>
                <div className="no-results">
                    ⭐ {t('noBookmarks')}
                </div>
            </div>
        );
    }

    return (
        <div className="tab-content">
            <h2>{t('bookmarks')}</h2>

            {/* Bookmark Type Tabs */}
            <div className="bookmark-type-tabs">
                <button
                    className={`bookmark-type-tab ${bookmarkType === 'questions' ? 'active' : ''}`}
                    onClick={() => setBookmarkType('questions')}
                >
                    {t('bookmarks')} ({questionBookmarkCount})
                </button>
                <button
                    className={`bookmark-type-tab ${bookmarkType === 'flashcards' ? 'active' : ''}`}
                    onClick={() => setBookmarkType('flashcards')}
                >
                    {t('flashcards')} ({flashcardBookmarkCount})
                </button>
            </div>

            {bookmarkCount > 0 && (
                <>
                    <div className="controls">
                        <span className="counter">{bookmarkCount} {t('bookmarkCount')}</span>
                        <button
                            className={`toggle-corrige ${!showCorrection ? 'off' : ''}`}
                            onClick={() => setShowCorrection(!showCorrection)}
                        >
                            {showCorrection ? t('hideAllCorrection') : t('showAllCorrection')}
                        </button>
                    </div>

                    <div className="theme-grid">
                        <button
                            className={`theme-btn ${selectedTheme === 0 ? 'active' : ''}`}
                            onClick={() => setSelectedTheme(0)}
                        >
                            {t('all')}
                        </button>
                        <button
                            className={`theme-btn ${selectedTheme === 1 ? 'active' : ''}`}
                            onClick={() => setSelectedTheme(1)}
                        >
                            1. {t('principles')}
                        </button>
                        <button
                            className={`theme-btn ${selectedTheme === 2 ? 'active' : ''}`}
                            onClick={() => setSelectedTheme(2)}
                        >
                            2. {t('institutions')}
                        </button>
                        <button
                            className={`theme-btn ${selectedTheme === 3 ? 'active' : ''}`}
                            onClick={() => setSelectedTheme(3)}
                        >
                            3. {t('rights')}
                        </button>
                        <button
                            className={`theme-btn ${selectedTheme === 4 ? 'active' : ''}`}
                            onClick={() => setSelectedTheme(4)}
                        >
                            4. {t('history')}
                        </button>
                        <button
                            className={`theme-btn ${selectedTheme === 5 ? 'active' : ''}`}
                            onClick={() => setSelectedTheme(5)}
                        >
                            5. {t('social')}
                        </button>
                    </div>

                    <div className="questions-grid">
                        {filteredQuestions.map((question) => {
                            const isSelected = bookmarks[question.id];

                            return (
                                <div
                                    key={question.id}
                                    className={`question-card ${isSelected ? 'selected' : ''}`}
                                >
                                    <div className="question-header">
                                        <span className="question-number">#{question.num}</span>
                                        <span className="question-type">
                                            {question.type === 'mise en situation' ? t('situation') : t('knowledge')}
                                        </span>
                                        <button
                                            className="remove-bookmark"
                                            onClick={() => toggleBookmark(question.id)}
                                            title={t('removeBookmark')}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="question-text">
                                        {question.text}
                                    </div>
                                    {showCorrection && (
                                        <div className="correction">
                                            <div className="options">
                                                {question.options.map((option, idx) => {
                                                    const letter = String.fromCharCode(65 + idx);
                                                    const isCorrect = letter === question.correct;
                                                    const isUserChoice = isSelected && isCorrect;

                                                    return (
                                                        <div
                                                            key={letter}
                                                            className={`option ${isCorrect ? 'correct' : ''} ${isUserChoice ? 'user-choice' : ''}`}
                                                        >
                                                            <span className="option-letter">{letter}</span>
                                                            <span className="option-text">{option}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {bookmarkCount === 0 && (
                <div className="no-results">
                    {bookmarkType === 'questions' ? '⭐' : '📇'} {bookmarkType === 'questions' ? t('noBookmarks') : t('noFlashcardBookmarks')}
                </div>
            )}
        </div>
    );
}
