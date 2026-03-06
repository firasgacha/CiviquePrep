import { useTranslation } from 'react-i18next';

export function About() {
    const { t } = useTranslation();

    return (
        <div className="tab-content about-section">
            <h2>🇫🇷 {t('aboutTitle')}</h2>

            <div className="about-intro">
                <p>{t('aboutIntro')}</p>
            </div>

            <div className="about-services">
                <h3>🎯 {t('aboutServicesTitle')}</h3>

                <div className="service-card">
                    <div className="service-icon">📘</div>
                    <div className="service-content">
                        <h4>{t('aboutTrainingTitle')}</h4>
                        <p>{t('aboutTrainingDesc')}</p>
                    </div>
                </div>

                <div className="service-card">
                    <div className="service-icon">📝</div>
                    <div className="service-content">
                        <h4>{t('aboutExamTitle')}</h4>
                        <p>{t('aboutExamDesc')}</p>
                    </div>
                </div>

                <div className="service-card">
                    <div className="service-icon">🎯</div>
                    <div className="service-content">
                        <h4>{t('aboutSmartTitle')}</h4>
                        <p>{t('aboutSmartDesc')}</p>
                    </div>
                </div>

                <div className="service-card">
                    <div className="service-icon">📊</div>
                    <div className="service-content">
                        <h4>{t('aboutProgressTitle')}</h4>
                        <p>{t('aboutProgressDesc')}</p>
                    </div>
                </div>

                <div className="service-card">
                    <div className="service-icon">⭐</div>
                    <div className="service-content">
                        <h4>{t('aboutBookmarksTitle')}</h4>
                        <p>{t('aboutBookmarksDesc')}</p>
                    </div>
                </div>

                <div className="service-card">
                    <div className="service-icon">🔥</div>
                    <div className="service-content">
                        <h4>{t('aboutStreaksTitle')}</h4>
                        <p>{t('aboutStreaksDesc')}</p>
                    </div>
                </div>
            </div>

            <div className="about-help">
                <h3>💬 {t('aboutHelpTitle')}</h3>
                <p>{t('aboutHelpDesc')}</p>
            </div>

            <div className="about-version">
                <p>{t('aboutVersion')} 1.0.0</p>
            </div>
        </div>
    );
}
