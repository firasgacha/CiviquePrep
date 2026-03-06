import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'it', flag: '🇮🇹', name: 'Italiano' },
    { code: 'uk', flag: '🇺🇦', name: 'Українська' },
    { code: 'ar', flag: '🇸🇦', name: 'العربية' }
];

export function LanguageSelector() {
    const { i18n, t } = useTranslation();

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
    };

    return (
        <div className="language-selector">
            <span className="language-label">{t('language')}:</span>
            <div className="language-buttons">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        className={`language-btn ${i18n.language === lang.code ? 'active' : ''}`}
                        onClick={() => changeLanguage(lang.code)}
                        title={lang.name}
                    >
                        <span className="language-flag">{lang.flag}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
