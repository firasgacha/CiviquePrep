import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Question, UserSelections } from '../types';
import { THEME_NAMES } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TrainingProps {
    questions: Question[];
}

export function Training({ questions }: TrainingProps) {
    const { t } = useTranslation();
    const [currentTheme, setCurrentTheme] = useState<number>(0);
    const [globalShowCorrection, setGlobalShowCorrection] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [userSelections, setUserSelections] = useLocalStorage<UserSelections>('civique-training-selections', {});
    const [revealedQuestions, setRevealedQuestions] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState<string>('');
    const perPage = 10;

    const filteredQuestions = useMemo(() => {
        let filtered = questions;

        // Filter by theme
        if (currentTheme !== 0) {
            filtered = filtered.filter(q => q.theme === currentTheme);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(q =>
                q.text.toLowerCase().includes(query) ||
                q.options.some(opt => opt.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [questions, currentTheme, searchQuery]);

    const totalPages = Math.ceil(filteredQuestions.length / perPage);

    const paginatedQuestions = useMemo(() => {
        const start = (page - 1) * perPage;
        return filteredQuestions.slice(start, start + perPage);
    }, [filteredQuestions, page]);

    const handleThemeChange = (theme: number) => {
        setCurrentTheme(theme);
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const selectOption = (qid: string, letter: string) => {
        setUserSelections(prev => {
            if (prev[qid] === letter) {
                const { [qid]: removed, ...rest } = prev;
                void removed;
                return rest;
            }
            return { ...prev, [qid]: letter };
        });
    };

    const isSelected = (qid: string, letter: string) => userSelections[qid] === letter;
    const getUserChoice = (qid: string) => userSelections[qid] || null;

    const revealOne = (qid: string) => {
        setRevealedQuestions(prev => new Set(prev).add(qid));
        setTimeout(() => {
            setRevealedQuestions(prev => {
                const next = new Set(prev);
                next.delete(qid);
                return next;
            });
        }, 2000);
    };

    const themeName = (tnum: number) => THEME_NAMES[tnum] || '';

    return (
        <div className="tab-content">
            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder={t('search')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

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
            </div>

            <div className="controls">
                <span className="counter">{filteredQuestions.length} {t('questions')}</span>
                <button
                    className={`toggle-corrige ${!globalShowCorrection ? 'off' : ''}`}
                    onClick={() => setGlobalShowCorrection(!globalShowCorrection)}
                >
                    {globalShowCorrection ? t('hideAllCorrection') : t('showAllCorrection')}
                </button>
            </div>

            {filteredQuestions.length > 0 && (
                <div className="navigate">
                    <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                        ←
                    </button>
                    <span>{t('page')} {page} / {totalPages || 1}</span>
                    <button className="page-btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>
                        →
                    </button>
                </div>
            )}

            {paginatedQuestions.length === 0 ? (
                <div className="no-results">{t('search')} - {t('questions')}</div>
            ) : (
                paginatedQuestions.map(q => (
                    <div key={q.id} className="question-card">
                        <span className="theme-tag">{themeName(q.theme)} · {t('theme')} {q.theme}</span>
                        <div className="q-text">{q.num}. {q.text}</div>
                        <div className="options">
                            {q.options.map((opt, idx) => {
                                const letter = String.fromCharCode(65 + idx);
                                const isCorrect = q.correct === letter;
                                const shouldHighlight = (globalShowCorrection || revealedQuestions.has(q.id)) && isCorrect;

                                return (
                                    <div
                                        key={idx}
                                        className={`option ${isSelected(q.id, letter) ? 'selected' : ''} ${shouldHighlight ? 'correct-highlight' : ''}`}
                                        onClick={() => selectOption(q.id, letter)}
                                    >
                                        {letter}) {opt}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="footer-card">
                            <button className="show-corrige-btn" onClick={() => revealOne(q.id)}>
                                {t('revealThis')}
                            </button>
                            {getUserChoice(q.id) && <span>{t('yourChoice')}: {getUserChoice(q.id)}</span>}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
