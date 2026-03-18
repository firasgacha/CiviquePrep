import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const TARGET_EMAIL = import.meta.env.VITE_TARGET_EMAIL || '';

export function Suggestions() {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !suggestion.trim()) {
            setStatus('error');
            setErrorMessage(t('suggestionsFillAllFields'));
            return;
        }

        setStatus('sending');

        try {
            const templateParams = {
                name: name,
                email: email,
                reply_to: email,
                message: suggestion,
                title: `CiviquePrep-Suggestion from ${name}`,
                time: new Date().toLocaleString(),
            };

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            setStatus('success');
            setName('');
            setEmail('');
            setSuggestion('');
        } catch (error) {
            console.error('EmailJS error:', error);
            setStatus('error');
            setErrorMessage(t('suggestionsError'));
        }
    };

    return (
        <div className="tab-content suggestions-section">
            <h2>💡 {t('suggestionsTitle')}</h2>

            <div className="suggestions-intro">
                <p>{t('suggestionsIntro')}</p>
            </div>

            {status === 'success' ? (
                <div className="suggestions-success">
                    <div className="success-icon">✅</div>
                    <h3>{t('suggestionsSuccessTitle')}</h3>
                    <p>{t('suggestionsSuccessMessage')}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setStatus('idle')}
                    >
                        {t('suggestionsSendAnother')}
                    </button>
                </div>
            ) : (
                <form className="suggestions-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="suggestion-name">{t('suggestionsNameLabel')}</label>
                        <input
                            type="text"
                            id="suggestion-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('suggestionsNamePlaceholder')}
                            disabled={status === 'sending'}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="suggestion-email">{t('suggestionsEmailLabel')}</label>
                        <input
                            type="email"
                            id="suggestion-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('suggestionsEmailPlaceholder')}
                            disabled={status === 'sending'}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="suggestion-message">{t('suggestionsMessageLabel')}</label>
                        <textarea
                            id="suggestion-message"
                            value={suggestion}
                            onChange={(e) => setSuggestion(e.target.value)}
                            placeholder={t('suggestionsMessagePlaceholder')}
                            rows={5}
                            disabled={status === 'sending'}
                        />
                    </div>

                    {status === 'error' && (
                        <div className="suggestions-error">
                            <span>⚠️</span> {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary suggestions-submit"
                        disabled={status === 'sending'}
                    >
                        {status === 'sending' ? (
                            <>
                                <span className="spinner"></span>
                                {t('suggestionsSending')}
                            </>
                        ) : (
                            t('suggestionsSubmit')
                        )}
                    </button>
                </form>
            )}

            <div className="suggestions-privacy">
                <p>{t('suggestionsPrivacy')}</p>
            </div>
        </div>
    );
}
