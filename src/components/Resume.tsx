import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useBookmarks } from '../hooks/useBookmarks';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import type { Question, UserSelections } from '../types';
import { THEME_NAMES } from '../types';

interface ResumeProps {
    questions: Question[];
}

interface ExamHistoryItem {
    id: string;
    date: string;
    score: number;
    total: number;
}

export function Resume({ questions }: ResumeProps) {
    const { t } = useTranslation();
    const [trainingSelections] = useLocalStorage<UserSelections>('civique-training-selections', {});
    const [examHistory] = useLocalStorage<ExamHistoryItem[]>('civique-exam-history', []);
    const { bookmarkCount } = useBookmarks();
    const { getOverallMastery } = useSpacedRepetition();

    const stats = useMemo(() => {
        const answeredQuestions = Object.keys(trainingSelections).length;
        const totalQuestions = questions.length;

        // Calculate theme progress
        const themeProgress: { [key: number]: { answered: number; total: number; }; } = {};
        for (let theme = 1; theme <= 5; theme++) {
            const themeQuestions = questions.filter(q => q.theme === theme);
            const answeredInTheme = themeQuestions.filter(q => trainingSelections[q.id] !== undefined).length;
            themeProgress[theme] = {
                answered: answeredInTheme,
                total: themeQuestions.length
            };
        }

        // Calculate exam stats
        const totalExamAttempts = examHistory.length;
        const passedExams = examHistory.filter(e => (e.score / e.total) * 100 >= 60).length;
        const averageScore = totalExamAttempts > 0
            ? Math.round(examHistory.reduce((sum, e) => sum + (e.score / e.total) * 100, 0) / totalExamAttempts)
            : 0;
        const bestScore = totalExamAttempts > 0
            ? Math.max(...examHistory.map(e => e.score))
            : 0;

        return {
            answeredQuestions,
            totalQuestions,
            themeProgress,
            totalExamAttempts,
            passedExams,
            averageScore,
            bestScore
        };
    }, [trainingSelections, examHistory, questions]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const clearAllData = () => {
        if (confirm(t('clearDataConfirm') || 'Are you sure you want to clear all progress data?')) {
            localStorage.removeItem('civique-training-selections');
            localStorage.removeItem('civique-exam-history');
            window.location.reload();
        }
    };

    return (
        <div className="resume-container">
            <h2>{t('resumeTitle')}</h2>

            {/* Overall Progress Card */}
            <div className="resume-card">
                <h3>📊 {t('overallProgress')}</h3>
                <div className="progress-stats">
                    <div className="stat-item">
                        <div className="stat-value">{stats.answeredQuestions}</div>
                        <div className="stat-label">{t('questionsAnswered')}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">
                            {Math.round((stats.answeredQuestions / stats.totalQuestions) * 100)}%
                        </div>
                        <div className="stat-label">{t('completionRate')}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{getOverallMastery}%</div>
                        <div className="stat-label">{t('overallMastery')}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{bookmarkCount}</div>
                        <div className="stat-label">{t('bookmarkCount')}</div>
                    </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="progress-bar-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${(stats.answeredQuestions / stats.totalQuestions) * 100}%` }}
                    />
                </div>
            </div>

            {/* Theme Progress */}
            <div className="resume-card">
                <h3>📚 {t('themeProgress')}</h3>
                <div className="theme-progress-grid">
                    {[1, 2, 3, 4, 5].map(theme => {
                        const progress = stats.themeProgress[theme];
                        const percentage = progress.total > 0
                            ? Math.round((progress.answered / progress.total) * 100)
                            : 0;
                        return (
                            <div key={theme} className="theme-progress-item">
                                <div className="theme-header">
                                    <span className="theme-name">{t(THEME_NAMES[theme].toLowerCase().replace(' & ', '_').replace(' ', '_'))}</span>
                                    <span className="theme-count">{progress.answered}/{progress.total}</span>
                                </div>
                                <div className="theme-progress-bar">
                                    <div
                                        className="theme-progress-fill"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="theme-percentage">{percentage}%</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Exam History */}
            <div className="resume-card">
                <h3>📝 {t('examHistory')}</h3>
                {stats.totalExamAttempts === 0 ? (
                    <p className="no-data">{t('noExamAttempts')}</p>
                ) : (
                    <>
                        <div className="exam-stats">
                            <div className="exam-stat">
                                <span className="exam-stat-value">{stats.totalExamAttempts}</span>
                                <span className="exam-stat-label">{t('totalAttempts')}</span>
                            </div>
                            <div className="exam-stat">
                                <span className="exam-stat-value">{stats.passedExams}</span>
                                <span className="exam-stat-label">{t('passed')}</span>
                            </div>
                            <div className="exam-stat">
                                <span className="exam-stat-value">{stats.averageScore}%</span>
                                <span className="exam-stat-label">{t('averageScore')}</span>
                            </div>
                        </div>
                        <div className="exam-history-list">
                            {examHistory.slice().reverse().map((exam, index) => {
                                const passed = (exam.score / exam.total) * 100 >= 60;
                                return (
                                    <div key={index} className={`exam-result-item ${passed ? 'passed' : 'failed'}`}>
                                        <div className="exam-result-date">{formatDate(exam.date)}</div>
                                        <div className="exam-result-score">
                                            <span className="score-value">{exam.score}/{exam.total}</span>
                                            <span className={`score-badge ${passed ? 'pass' : 'fail'}`}>
                                                {passed ? t('pass') : t('fail')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Achievements Section */}
            <div className="resume-card">
                <h3>🏆 {t('achievements')}</h3>
                <div className="achievements-grid">
                    <div className={`achievement ${stats.answeredQuestions >= 10 ? 'unlocked' : 'locked'}`}>
                        <span className="achievement-icon">🌱</span>
                        <span className="achievement-name">{t('first10')}</span>
                    </div>
                    <div className={`achievement ${stats.answeredQuestions >= 50 ? 'unlocked' : 'locked'}`}>
                        <span className="achievement-icon">📖</span>
                        <span className="achievement-name">{t('halfWay')}</span>
                    </div>
                    <div className={`achievement ${stats.answeredQuestions >= stats.totalQuestions ? 'unlocked' : 'locked'}`}>
                        <span className="achievement-icon">🎓</span>
                        <span className="achievement-name">{t('allQuestions')}</span>
                    </div>
                    <div className={`achievement ${stats.bestScore >= 24 ? 'unlocked' : 'locked'}`}>
                        <span className="achievement-icon">✅</span>
                        <span className="achievement-name">{t('firstPass')}</span>
                    </div>
                    <div className={`achievement ${stats.passedExams >= 3 ? 'unlocked' : 'locked'}`}>
                        <span className="achievement-icon">⭐</span>
                        <span className="achievement-name">{t('consistent')}</span>
                    </div>
                    <div className={`achievement ${stats.bestScore === 40 ? 'unlocked' : 'locked'}`}>
                        <span className="achievement-icon">🏅</span>
                        <span className="achievement-name">{t('perfect')}</span>
                    </div>
                </div>
            </div>

            {/* Clear Data */}
            <div className="resume-card danger-zone">
                <button className="clear-data-btn" onClick={clearAllData}>
                    🗑️ {t('clearAllData')}
                </button>
            </div>
        </div>
    );
}
