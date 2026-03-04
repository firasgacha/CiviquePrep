import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Question } from '../types';
import { THEME_NAMES } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ExamProps {
    questions: Question[];
}

export function Exam({ questions }: ExamProps) {
    const { t } = useTranslation();
    const [examActive, setExamActive] = useState<boolean>(false);
    const [examFinished, setExamFinished] = useState<boolean>(false);
    const [examQuestions, setExamQuestions] = useState<Question[]>([]);
    const [examAnswers, setExamAnswers] = useState<(string | null)[]>([]);
    const [examIndex, setExamIndex] = useState<number>(0);
    const [examTimer, setExamTimer] = useState<number>(45 * 60);
    const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
    const [showFlaggedOnly, setShowFlaggedOnly] = useState<boolean>(false);
    const [examHistory, setExamHistory] = useLocalStorage<Array<{ date: string; score: number; total: number; }>>('civique-exam-history', []);

    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const startExam = useCallback(() => {
        const shuffled = shuffleArray([...questions]);
        const selected = shuffled.slice(0, 40);
        const withTypes = selected.map((q, idx) => ({
            ...q,
            type: idx < 28 ? 'connaissance' as const : 'mise en situation' as const
        }));
        setExamQuestions(withTypes);
        setExamAnswers(Array(40).fill(null));
        setExamIndex(0);
        setFlaggedQuestions(new Set());
        setShowFlaggedOnly(false);
        setExamActive(true);
        setExamFinished(false);
        setExamTimer(45 * 60);

        if (timerInterval) clearInterval(timerInterval);
        const interval = setInterval(() => {
            setExamTimer(prev => {
                if (prev > 0) return prev - 1;
                return 0;
            });
        }, 1000);
        setTimerInterval(interval);
    }, [questions, timerInterval]);

    const finishExam = useCallback(() => {
        const score = examQuestions.reduce((acc, q, idx) => {
            return acc + (examAnswers[idx] === q.correct ? 1 : 0);
        }, 0);

        setExamHistory(prev => [...prev, { date: new Date().toISOString(), score, total: 40 }]);
        setExamActive(false);
        setExamFinished(true);
        if (timerInterval) clearInterval(timerInterval);
    }, [examQuestions, examAnswers, timerInterval, setExamHistory]);

    const resetExam = useCallback(() => {
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

    const themeName = (t: number) => THEME_NAMES[t] || '';
    const isFlagged = (idx: number) => flaggedQuestions.has(idx);

    if (!examActive && !examFinished) {
        return (
            <div className="tab-content">
                <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <h2 style={{ color: '#0b2b4a', marginBottom: '1rem' }}>{t('examTitle')}</h2>
                    <p style={{ marginBottom: '2rem' }}>{t('examDescription')}</p>

                    {/* Exam History */}
                    {examHistory.length > 0 && (
                        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                            <h3>📊 {t('history')}</h3>
                            {examHistory.slice(-5).map((entry, idx) => (
                                <div key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                    {new Date(entry.date).toLocaleDateString()}: {entry.score}/{entry.total}
                                </div>
                            ))}
                        </div>
                    )}

                    <button className="exam-btn" onClick={startExam}>{t('startExam')}</button>
                </div>
            </div>
        );
    }

    if (examActive && examQuestions.length > 0) {
        const currentQuestion = examQuestions[examIndex];
        const flaggedCount = flaggedQuestions.size;

        return (
            <div className="tab-content">
                <div className="exam-header">
                    <span className="exam-progress">{t('question')} {examIndex + 1} / {examQuestions.length}</span>
                    <span className="timer">{examTimerFormatted}</span>
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
                <div className="result-box">
                    <div className="score">{examScore} / 40</div>
                    <div style={{ fontSize: '1.3rem', margin: '0.5rem 0' }}>
                        {examScore >= 24 ? t('pass') : t('fail')}
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
