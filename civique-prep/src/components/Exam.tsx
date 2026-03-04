import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Question } from '../types';
import { THEME_NAMES } from '../types';

interface ExamProps {
    questions: Question[];
}

export function Exam({ questions }: ExamProps) {
    const [examActive, setExamActive] = useState<boolean>(false);
    const [examFinished, setExamFinished] = useState<boolean>(false);
    const [examQuestions, setExamQuestions] = useState<Question[]>([]);
    const [examAnswers, setExamAnswers] = useState<(string | null)[]>([]);
    const [examIndex, setExamIndex] = useState<number>(0);
    const [examTimer, setExamTimer] = useState<number>(45 * 60);
    const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);

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
        setExamActive(false);
        setExamFinished(true);
        if (timerInterval) clearInterval(timerInterval);
    }, [timerInterval]);

    const resetExam = useCallback(() => {
        setExamActive(false);
        setExamFinished(false);
        setExamQuestions([]);
        setExamAnswers([]);
        setExamIndex(0);
        if (timerInterval) clearInterval(timerInterval);
    }, [timerInterval]);

    useEffect(() => {
        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    }, [timerInterval]);

    useEffect(() => {
        if (examTimer === 0 && examActive) {
            // Use requestAnimationFrame to avoid synchronous setState
            requestAnimationFrame(() => {
                setExamActive(false);
                setExamFinished(true);
                if (timerInterval) clearInterval(timerInterval);
            });
        }
    }, [examTimer, examActive, timerInterval]);

    const setExamAnswer = (letter: string) => {
        setExamAnswers(prev => {
            const next = [...prev];
            next[examIndex] = letter;
            return next;
        });
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

    if (!examActive && !examFinished) {
        return (
            <div className="tab-content">
                <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <h2 style={{ color: '#0b2b4a', marginBottom: '1rem' }}>Examen blanc – 40 questions</h2>
                    <p style={{ marginBottom: '2rem' }}>28 questions de connaissance, 12 mises en situation. Durée : 45 minutes.</p>
                    <button className="exam-btn" onClick={startExam}>▶️ Démarrer l'examen</button>
                </div>
            </div>
        );
    }

    if (examActive && examQuestions.length > 0) {
        const currentQuestion = examQuestions[examIndex];
        return (
            <div className="tab-content">
                <div className="exam-header">
                    <span className="exam-progress">Question {examIndex + 1} / {examQuestions.length}</span>
                    <span className="timer">{examTimerFormatted}</span>
                    <span style={{ fontWeight: 500 }}>{currentQuestion.type}</span>
                </div>

                <div className="question-card" style={{ background: '#f5faff' }}>
                    <span className="theme-tag">{themeName(currentQuestion.theme)} · {currentQuestion.type}</span>
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
                    <button className="exam-btn" disabled={examIndex === 0} onClick={() => setExamIndex(i => i - 1)}>
                        ⬅ Précédent
                    </button>
                    {examIndex < examQuestions.length - 1 ? (
                        <button
                            className="exam-btn"
                            onClick={() => setExamIndex(i => i + 1)}
                            disabled={examAnswers[examIndex] === null}
                        >
                            Suivant ➔
                        </button>
                    ) : (
                        <button
                            className="exam-btn"
                            onClick={finishExam}
                            disabled={examAnswers[examIndex] === null}
                        >
                            📤 Terminer
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
                        {examScore >= 24 ? '✅ Réussite' : '❌ À retravailler'}
                    </div>
                    <p>Seuil indicatif : 24/40</p>
                    <button className="exam-btn" onClick={resetExam}>⟲ Nouvel essai</button>
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <h3>Vos réponses</h3>
                    {examQuestions.map((q, idx) => (
                        <div key={idx} style={{ borderBottom: '1px solid #ccc', padding: '0.8rem 0' }}>
                            <div>
                                <strong>{idx + 1}. {q.text}</strong>{' '}
                                <span style={{ fontSize: '0.85rem' }}>({q.type})</span>
                            </div>
                            <div>
                                votre choix : {examAnswers[idx] || '–'} | bonne réponse : {q.correct}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
}
