import { useState, useMemo } from 'react';
import type { Question, UserSelections } from '../types';
import { THEME_NAMES } from '../types';

interface TrainingProps {
    questions: Question[];
}

export function Training({ questions }: TrainingProps) {
    const [currentTheme, setCurrentTheme] = useState<number>(0);
    const [globalShowCorrection, setGlobalShowCorrection] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [userSelections, setUserSelections] = useState<UserSelections>({});
    const [revealedQuestions, setRevealedQuestions] = useState<Set<string>>(new Set());
    const perPage = 10;

    const filteredQuestions = useMemo(() => {
        if (currentTheme === 0) return questions;
        return questions.filter(q => q.theme === currentTheme);
    }, [questions, currentTheme]);

    const totalPages = Math.ceil(filteredQuestions.length / perPage);

    const paginatedQuestions = useMemo(() => {
        const start = (page - 1) * perPage;
        return filteredQuestions.slice(start, start + perPage);
    }, [filteredQuestions, page]);

    const handleThemeChange = (theme: number) => {
        setCurrentTheme(theme);
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

    const themeName = (t: number) => THEME_NAMES[t] || '';

    return (
        <div className="tab-content">
            <div className="theme-grid">
                <button
                    className={`theme-btn ${currentTheme === 0 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(0)}
                >
                    Tous
                </button>
                <button
                    className={`theme-btn ${currentTheme === 1 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(1)}
                >
                    1. Principes
                </button>
                <button
                    className={`theme-btn ${currentTheme === 2 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(2)}
                >
                    2. Institutions
                </button>
                <button
                    className={`theme-btn ${currentTheme === 3 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(3)}
                >
                    3. Droits & devoirs
                </button>
                <button
                    className={`theme-btn ${currentTheme === 4 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(4)}
                >
                    4. Histoire & culture
                </button>
                <button
                    className={`theme-btn ${currentTheme === 5 ? 'active' : ''}`}
                    onClick={() => handleThemeChange(5)}
                >
                    5. Vie sociale
                </button>
            </div>

            <div className="controls">
                <span className="counter">{filteredQuestions.length} questions</span>
                <button
                    className={`toggle-corrige ${!globalShowCorrection ? 'off' : ''}`}
                    onClick={() => setGlobalShowCorrection(!globalShowCorrection)}
                >
                    {globalShowCorrection ? 'Masquer corrigé' : 'Afficher tout corrigé'}
                </button>
            </div>

            <div className="navigate">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    ←
                </button>
                <span>page {page} / {totalPages}</span>
                <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                    →
                </button>
            </div>

            {paginatedQuestions.map(q => (
                <div key={q.id} className="question-card">
                    <span className="theme-tag">{themeName(q.theme)} · thème {q.theme}</span>
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
                            ⚡ révéler (cette question)
                        </button>
                        {getUserChoice(q.id) && <span>votre choix : {getUserChoice(q.id)}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
}
