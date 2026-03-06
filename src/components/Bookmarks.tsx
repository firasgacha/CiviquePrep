import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBookmarks } from '../hooks/useBookmarks';
import type { Question } from '../types';
import { THEME_NAMES } from '../types';

interface BookmarksProps {
    questions: Question[];
}

export function Bookmarks({ questions }: BookmarksProps) {
    const { t } = useTranslation();
    const { bookmarks, isBookmarked, toggleBookmark, bookmarkCount } = useBookmarks();
    const [showCorrection, setShowCorrection] = useState<boolean>(false);
    const [selectedTheme, setSelectedTheme] = useState<number>(0);

    // Get bookmarked questions
    const bookmarkedQuestions = useMemo(() => {
        return questions.filter(q => isBookmarked(q.id));
    }, [questions, isBookmarked]);

    // Filter by theme
    const filteredQuestions = useMemo(() => {
        if (selectedTheme === 0) return bookmarkedQuestions;
        return bookmarkedQuestions.filter(q => q.theme === selectedTheme);
    }, [bookmarkedQuestions, selectedTheme]);

    const themeName = (tnum: number) => THEME_NAMES[tnum] || '';

    if (bookmarkCount === 0) {
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
                {[1, 2, 3, 4, 5, 6].map(themeNum => (
                    <button
                        key={themeNum}
                        className={`theme-btn ${selectedTheme === themeNum ? 'active' : ''}`}
                        onClick={() => setSelectedTheme(themeNum)}
                    >
                        {themeNum}. {themeName(themeNum)}
                    </button>
                ))}
            </div>

            <div className="bookmarks-list">
                {filteredQuestions.length === 0 ? (
                    <div className="no-results">{t('noBookmarks')}</div>
                ) : (
                    filteredQuestions.map(q => {
                        const bookmark = bookmarks[q.id];
                        return (
                            <div key={q.id} className="question-card bookmarked">
                                <div className="bookmark-header">
                                    <span className="theme-tag">{themeName(q.theme)} · {t('theme')} {q.theme}</span>
                                    <button
                                        className="bookmark-btn active"
                                        onClick={() => toggleBookmark(q.id)}
                                        title={t('removeBookmark')}
                                    >
                                        ⭐
                                    </button>
                                </div>
                                <div className="q-text">{q.num}. {q.text}</div>
                                <div className="options">
                                    {q.options.map((opt, idx) => {
                                        const letter = String.fromCharCode(65 + idx);
                                        const isCorrect = q.correct === letter;
                                        const shouldHighlight = showCorrection && isCorrect;

                                        return (
                                            <div
                                                key={idx}
                                                className={`option ${shouldHighlight ? 'correct-highlight' : ''}`}
                                            >
                                                {letter}) {opt}
                                            </div>
                                        );
                                    })}
                                </div>
                                {bookmark?.notes && (
                                    <div className="bookmark-notes">
                                        <strong>📝 Note:</strong> {bookmark.notes}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
