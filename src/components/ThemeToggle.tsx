import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();

    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? t('darkMode') : t('lightMode')}
        </button>
    );
}
