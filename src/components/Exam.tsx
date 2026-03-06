import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Question } from '../types';
import { THEME_NAMES } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import type { ExamDifficulty } from './ExamConfigs';
import { EXAM_CONFIGS } from './ExamConfigs';

interface ExamProps {
    questions: Question[];
}

export type { ExamDifficulty, ExamConfig } from './ExamConfigs';
export { EXAM_CONFIGS } from './ExamConfigs';

export function Exam({ questions }: ExamProps) {
    const { t } = useTranslation();
    const [selectedList, setSelectedList] = useState<'csp' | 'cr' | null>(null);
    const [examDifficulty, setExamDifficulty] = useState<ExamDifficulty>('standard');
    const [examActive, setExamActive] = useState<boolean>(false);
    const [examFinished, setExamFinished] = useState<boolean>(false);
    const [examQuestions, setExamQuestions] = useState<Question[]>([]);
    const [examAnswers, setExamAnswers] = useState<(string | null)[]>([]);
    const [examIndex, setExamIndex] = useState<number>(0);
    const [examTimer, setExamTimer] = useState<number>(35 * 60);
    const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
    const [showFlaggedOnly, setShowFlaggedOnly] = useState<boolean>(false);
    const [examHistory, setExamHistory] = useLocalStorage<Array<{ id: string; date: string; score: number; total: number; }>>('civique-exam-history', []);
    const { spacedData } = useSpacedRepetition();

    // Handle list selection
    const handleListSelect = (list: 'csp' | 'cr') => {
        setSelectedList(list);
        // Reset exam state when switching lists
        setExamActive(false);
        setExamFinished(false);
        setExamQuestions([]);
        setExamAnswers([]);
        setExamIndex(0);
        if (timerInterval) clearInterval(timerInterval);
    };

    // Reset to list selection
    const handleBackToList = () => {
        setSelectedList(null);
        setExamActive(false);
        setExamFinished(false);
        setExamQuestions([]);
        setExamAnswers([]);
        setExamIndex(0);
        if (timerInterval) clearInterval(timerInterval);
    };

    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Get count of mistakes for the selected list
    const mistakesCount = useMemo(() => {
        if (!selectedList) return 0;
        const listQuestions = questions.filter(q => q.list === selectedList);
        return listQuestions.filter(q => {
            const stats = spacedData[q.id];
            return stats && stats.timesShown > 0 && stats.timesCorrect < stats.timesShown;
        }).length;
    }, [questions, selectedList, spacedData]);

    const startExam = useCallback(() => {
        // Handle mistakes review mode
        if (examDifficulty === 'mistakes') {
            const listQuestions = questions.filter(q => q.list === selectedList);
            // Filter to only questions that have been answered incorrectly
            const mistakeQuestions = listQuestions.filter(q => {
                const stats = spacedData[q.id];
                return stats && stats.timesShown > 0 && stats.timesCorrect < stats.timesShown;
            });

            if (mistakeQuestions.length === 0) {
                alert(t('noMistakes'));
                return;
            }

            const shuffled = shuffleArray([...mistakeQuestions]);
            setExamQuestions(shuffled);
            setExamAnswers(Array(shuffled.length).fill(null));
            setExamIndex(0);
            setFlaggedQuestions(new Set());
            setShowFlaggedOnly(false);
            setExamActive(true);
            setExamFinished(false);
            // No timer for mistakes review mode - user can take their time
            setExamTimer(0);

            if (timerInterval) clearInterval(timerInterval);
            return;
        }

        // Get config for selected difficulty
        const config = EXAM_CONFIGS[examDifficulty];

        // Filter questions by selected list
        const listQuestions = questions.filter(q => q.list === selectedList);
        const shuffled = shuffleArray([...listQuestions]);
        const selected = shuffled.slice(0, config.questionCount);
        const withTypes = selected.map((q, idx) => ({
            ...q,
            type: idx < config.questionTypes.connaissance ? 'connaissance' as const : 'mise en situation' as const
        }));
        setExamQuestions(withTypes);
        setExamAnswers(Array(config.questionCount).fill(null));
        setExamIndex(0);
        setFlaggedQuestions(new Set());
        setShowFlaggedOnly(false);
        setExamActive(true);
        setExamFinished(false);
        setExamTimer(config.timeLimit * 60);

        if (timerInterval) clearInterval(timerInterval);
        const interval = setInterval(() => {
            setExamTimer(prev => {
                if (prev > 0) return prev - 1;
                return 0;
            });
        }, 1000);
        setTimerInterval(interval);
    }, [questions, timerInterval, selectedList, examDifficulty, spacedData, t]);

    const finishExam = useCallback(() => {
        const config = EXAM_CONFIGS[examDifficulty];
        const score = examQuestions.reduce((acc, q, idx) => {
            return acc + (examAnswers[idx] === q.correct ? 1 : 0);
        }, 0);

        setExamHistory(prev => [...prev, { id: crypto.randomUUID(), date: new Date().toISOString(), score, total: config.questionCount }]);
        setExamActive(false);
        setExamFinished(true);
        if (timerInterval) clearInterval(timerInterval);
    }, [examQuestions, examAnswers, timerInterval, setExamHistory, examDifficulty]);

    const resetExam = useCallback(() => {
        // Go back to list selection
        setSelectedList(null);
        setExamActive(false);
        setExamFinished(false);
        setExamQuestions([]);
        setExamAnswers([]);
        setExamIndex(0);
        setFlaggedQuestions(new Set());
        if (timerInterval) clearInterval(timerInterval);
    }, [timerInterval]);

    useEffect(() => {
        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    }, [timerInterval]);

    useEffect(() => {
        if (examTimer === 0 && examActive) {
            requestAnimationFrame(() => {
                finishExam();
            });
        }
    }, [examTimer, examActive, finishExam]);

    const setExamAnswer = (letter: string) => {
        setExamAnswers(prev => {
            const next = [...prev];
            next[examIndex] = letter;
            return next;
        });
    };

    const toggleFlag = () => {
        setFlaggedQuestions(prev => {
            const next = new Set(prev);
            if (next.has(examIndex)) {
                next.delete(examIndex);
            } else {
                next.add(examIndex);
            }
            return next;
        });
    };

    const goToNext = () => {
        if (showFlaggedOnly) {
            // Find next flagged question
            const flaggedArray = Array.from(flaggedQuestions).sort((a, b) => a - b);
            const currentPos = flaggedArray.indexOf(examIndex);
            if (currentPos < flaggedArray.length - 1) {
                setExamIndex(flaggedArray[currentPos + 1]);
            }
        } else {
            setExamIndex(i => i + 1);
        }
    };

    const goToPrev = () => {
        if (showFlaggedOnly) {
            const flaggedArray = Array.from(flaggedQuestions).sort((a, b) => a - b);
            const currentPos = flaggedArray.indexOf(examIndex);
            if (currentPos > 0) {
                setExamIndex(flaggedArray[currentPos - 1]);
            }
        } else {
            setExamIndex(i => i - 1);
        }
    };

    const examTimerFormatted = useMemo(() => {
        const m = Math.floor(examTimer / 60);
        const s = examTimer % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, [examTimer]);

    const examScore = useMemo(() => {
        let correct = 0;
        for (let i = 0; i < examQuestions.length; i++) {
            if (examAnswers[i] && examAnswers[i] === examQuestions[i]?.correct) {
                correct++;
            }
        }
        return correct;
    }, [examQuestions, examAnswers]);

    const deleteExamResult = (id: string) => {
        setExamHistory(prev => prev.filter(entry => entry.id !== id));
    };

    const themeName = (t: number) => THEME_NAMES[t] || '';
    const isFlagged = (idx: number) => flaggedQuestions.has(idx);

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

    if (!examActive && !examFinished) {
        return (
            <div className="tab-content">
                <button className="back-btn" onClick={handleBackToList}>
                    ← {t('backToList')}
                </button>

                <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <h2 style={{ color: '#0b2b4a', marginBottom: '1rem' }}>{t('examTitle')}</h2>

                    {/* Difficulty Selection */}
                    <div className="exam-difficulty-selector">
                        <p style={{ marginBottom: '1rem' }}>{t('selectDifficulty') || 'Select difficulty:'}</p>
                        <div className="difficulty-options">
                            {(['quick', 'standard', 'intensive'] as ExamDifficulty[]).map(diff => (
                                <button
                                    key={diff}
                                    className={`difficulty-btn ${examDifficulty === diff ? 'active' : ''}`}
                                    onClick={() => setExamDifficulty(diff)}
                                >
                                    <span className="diff-name">{t(`diff_${diff}`) || EXAM_CONFIGS[diff].name}</span>
                                    <span className="diff-details">
                                        {EXAM_CONFIGS[diff].questionCount} {t('questions')} · {EXAM_CONFIGS[diff].timeLimit} min
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mistakes Review Mode */}
                    <div className="exam-difficulty-selector" style={{ marginTop: '1.5rem' }}>
                        <p style={{ marginBottom: '1rem' }}>{t('reviewMistakes') || 'Review your mistakes:'}</p>
                        <div className="difficulty-options">
                            <button
                                className={`difficulty-btn ${examDifficulty === 'mistakes' ? 'active' : ''}`}
                                onClick={() => setExamDifficulty('mistakes')}
                                disabled={mistakesCount === 0}
                            >
                                <span className="diff-name">{t('diff_mistakes') || 'Review Mistakes'}</span>
                                <span className="diff-details">
                                    {mistakesCount > 0
                                        ? `${mistakesCount} ${t('questionsToReview').toLowerCase()}`
                                        : t('noMistakesYet')}
                                </span>
                            </button>
                        </div>
                    </div>

                    <p style={{ marginBottom: '2rem' }}>{t('examDescription')}</p>

                    {/* Exam History */}
                    {examHistory.length > 0 && (
                        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                            <h3>📊 {t('history')}</h3>
                            {examHistory.slice().reverse().map((entry) => (
                                <div key={entry.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>
                                        {new Date(entry.date).toLocaleDateString()}: <strong>{entry.score}/{entry.total}</strong>
                                        {entry.score >= entry.total * 0.6 ? ' ✅' : ' ❌'}
                                    </span>
                                    <button
                                        onClick={() => deleteExamResult(entry.id)}
                                        style={{
                                            background: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}
                                        title="Supprimer"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button className="exam-btn" onClick={startExam}>
                        {examDifficulty === 'mistakes' ? t('startMistakesReview') : t('startExam')}
                    </button>
                </div>
            </div>
        );
    }

    if (examActive && examQuestions.length > 0) {
        const currentQuestion = examQuestions[examIndex];
        const flaggedCount = flaggedQuestions.size;
        const isMistakesMode = examDifficulty === 'mistakes';

        return (
            <div className="tab-content">
                <div className="exam-header">
                    <span className="exam-progress">{t('question')} {examIndex + 1} / {examQuestions.length}</span>
                    {!isMistakesMode && <span className="timer">{examTimerFormatted}</span>}
                    {isMistakesMode && <span style={{ fontWeight: 500, color: '#e74c3c' }}>{t('mistakesReviewMode')}</span>}
                    <span style={{ fontWeight: 500 }}>{currentQuestion.type === 'connaissance' ? t('knowledge') : t('situation')}</span>
                </div>

                {/* Flag controls */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                    <button
                        className={`flag-btn ${isFlagged(examIndex) ? 'flagged' : ''}`}
                        onClick={toggleFlag}
                    >
                        {isFlagged(examIndex) ? t('unflag') : t('flag')}
                    </button>
                    {flaggedCount > 0 && (
                        <button
                            className={`review-flagged-btn ${showFlaggedOnly ? 'active' : ''}`}
                            onClick={() => {
                                setShowFlaggedOnly(!showFlaggedOnly);
                                if (!showFlaggedOnly && flaggedQuestions.size > 0) {
                                    setExamIndex(Math.min(...Array.from(flaggedQuestions)));
                                }
                            }}
                        >
                            {t('reviewFlagged')} ({flaggedCount})
                        </button>
                    )}
                </div>

                <div className="question-card" style={{ background: '#f5faff' }}>
                    <span className="theme-tag">{themeName(currentQuestion.theme)} · {currentQuestion.type === 'connaissance' ? t('knowledge') : t('situation')}</span>
                    <div className="q-text">{examIndex + 1}. {currentQuestion.text}</div>
                    <div className="options">
                        {currentQuestion.options.map((opt, idx) => {
                            const letter = String.fromCharCode(65 + idx);
                            return (
                                <div
                                    key={idx}
                                    className={`option ${examAnswers[examIndex] === letter ? 'selected' : ''}`}
                                    onClick={() => setExamAnswer(letter)}
                                >
                                    {letter}) {opt}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="exam-actions">
                    <button className="exam-btn" disabled={examIndex === 0} onClick={goToPrev}>
                        {t('previous')}
                    </button>
                    {examIndex < examQuestions.length - 1 ? (
                        <button
                            className="exam-btn"
                            onClick={goToNext}
                            disabled={examAnswers[examIndex] === null}
                        >
                            {t('next')}
                        </button>
                    ) : (
                        <button
                            className="exam-btn"
                            onClick={finishExam}
                            disabled={examAnswers[examIndex] === null}
                        >
                            {t('finish')}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (examFinished) {
        return (
            <div className="tab-content">
                <button className="back-btn" onClick={handleBackToList}>
                    ← {t('backToList')}
                </button>

                <div className="result-box">
                    <div className="score">{examScore} / 50</div>
                    <div style={{ fontSize: '1.3rem', margin: '0.5rem 0' }}>
                        {examScore >= 30 ? t('pass') : t('fail')}
                    </div>
                    <p>{t('threshold')}</p>
                    <button className="exam-btn" onClick={resetExam}>{t('newAttempt')}</button>
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <h3>{t('yourAnswers')}</h3>
                    {examQuestions.map((q, idx) => (
                        <div key={idx} style={{ borderBottom: '1px solid #ccc', padding: '0.8rem 0' }}>
                            <div>
                                <strong>{idx + 1}. {q.text}</strong>{' '}
                                <span style={{ fontSize: '0.85rem' }}>({t(q.type || 'knowledge')})</span>
                                {isFlagged(idx) && <span style={{ marginLeft: '0.5rem' }}>🚩</span>}
                            </div>
                            <div>
                                {t('yourChoice')}: {examAnswers[idx] || '–'} | {t('corrections')}: {q.correct}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
}
