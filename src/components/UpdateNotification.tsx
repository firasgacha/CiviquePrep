import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function UpdateNotification() {
    const { t } = useTranslation();
    const [showUpdate, setShowUpdate] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            // Check for waiting service worker on mount
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration?.waiting) {
                    // There's a waiting SW, show update button
                    setShowUpdate(true);
                }
            });

            // Listen for new service worker messages
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'SW_ACTIVATED') {
                    setShowUpdate(true);
                }
            });

            // Check for updates on mount
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration) {
                    registration.update();
                }
            });
        }
    }, []);

    const handleUpdate = () => {
        navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration?.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            window.location.reload();
        });
    };

    if (!showUpdate) {
        return null;
    }

    return (
        <div className="update-notification">
            <span>🔄 {t('updateAvailable')} </span>
            <button onClick={handleUpdate} className="update-btn">
                {t('updateNow')}
            </button>
        </div>
    );
}
