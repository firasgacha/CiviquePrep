import { useTranslation } from 'react-i18next';

export function Info() {
    const { t } = useTranslation();

    return (
        <div className="info-section">
            <div className="info-content">
                <h2>{t('infoTitle')}</h2>
                <p>
                    {t('infoIntro')}
                </p>

                <div className="info-block">
                    <h3>{t('infoMarianneTitle')}</h3>
                    <p>
                        {t('infoMarianneContent')}
                    </p>
                </div>

                <div className="info-block">
                    <h3>{t('infoExamFormatTitle')}</h3>
                    <div className="exam-format-grid">
                        <div className="format-item">
                            <span className="format-icon">📝</span>
                            <span className="format-text">{t('infoExamFormatQuestions')}</span>
                        </div>
                        <div className="format-item">
                            <span className="format-icon">📚</span>
                            <span className="format-text">{t('infoExamFormatConnaissance')}</span>
                        </div>
                        <div className="format-item">
                            <span className="format-icon">💼</span>
                            <span className="format-text">{t('infoExamFormatSituation')}</span>
                        </div>
                        <div className="format-item">
                            <span className="format-icon">⏱️</span>
                            <span className="format-text">{t('infoExamFormatDuration')}</span>
                        </div>
                        <div className="format-item">
                            <span className="format-icon">✅</span>
                            <span className="format-text">{t('infoExamFormatPassing')}</span>
                        </div>
                    </div>
                </div>

                <div className="info-block">
                    <h3>{t('infoExamLocationsTitle')}</h3>
                    <p>{t('infoExamLocationsIntro')}</p>

                    <div className="info-sub-block exam-location-card">
                        <div className="location-icon">🏢</div>
                        <div className="location-content">
                            <h4>{t('infoCcipTitle')}</h4>
                            <p>
                                {t('infoCcipText')}
                            </p>
                            <a
                                href="https://francais.cci-paris-idf.fr/candidat?produit=21"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="info-link"
                            >
                                {t('infoCcipLink')}
                            </a>
                            <div className="iframe-container">
                                <iframe
                                    src="https://francais.cci-paris-idf.fr/candidat?produit=21"
                                    title="Inscription CCIP - Examen civique"
                                    width="100%"
                                    height="600"
                                    style={{ border: 'none', borderRadius: '8px' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="info-sub-block exam-location-card">
                        <div className="location-icon">🎓</div>
                        <div className="location-content">
                            <h4>{t('infoFeiTitle')}</h4>
                            <p>
                                {t('infoFeiText')}
                            </p>
                            <a
                                href="https://www.france-education-international.fr/centres-d-examen/carte?type-centre=examen_civique"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="info-link"
                            >
                                {t('infoFeiLink')}
                            </a>
                            <p style={{ marginTop: '1rem' }}>
                                {t('infoFeiRegisterText')}
                            </p>
                            <a
                                href="https://test-civique.fr/inscription"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="info-link"
                            >
                                {t('infoFeiRegisterLink')}
                            </a>
                        </div>
                    </div>

                    <div className="info-sub-block">
                        <h4>{t('infoNaturalisationTitle')}</h4>
                        <p>
                            {t('infoNaturalisationText')}
                        </p>
                        <a
                            href="https://www.immigration.interieur.gouv.fr/Integration-et-Acces-a-la-nationalite/La-nationalite-francaise/Les-procedures-d-acces-a-la-nationalite-francaise"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="info-link"
                        >
                            {t('infoNaturalisationLink')}
                        </a>
                    </div>
                </div>

                <div className="info-block">
                    <h3>{t('infoFaqTitle')}</h3>

                    <div className="faq-item">
                        <h4>{t('infoFaqDocTitle')}</h4>
                        <p>{t('infoFaqDocContent')}</p>
                    </div>

                    <div className="faq-item">
                        <h4>{t('infoFaqCostTitle')}</h4>
                        <p>{t('infoFaqCostContent')}</p>
                    </div>

                    <div className="faq-item">
                        <h4>{t('infoFaqResultTitle')}</h4>
                        <p>{t('infoFaqResultContent')}</p>
                    </div>

                    <div className="faq-item">
                        <h4>{t('infoFaqValidityTitle')}</h4>
                        <p>{t('infoFaqValidityContent')}</p>
                    </div>

                    <div className="faq-item">
                        <h4>{t('infoFaqRetakeTitle')}</h4>
                        <p>{t('infoFaqRetakeContent')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
