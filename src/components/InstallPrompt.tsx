import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Listen for the beforeinstallprompt event
        const handler = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Store the event for later use
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Show our custom prompt after a short delay
            setTimeout(() => setShowPrompt(true), 2000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Also listen for appinstalled event
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowPrompt(false);
        };

        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user to respond
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        }

        // Clear the stored event
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Store that user dismissed to not show again in this session
        sessionStorage.setItem('installPromptDismissed', 'true');
    };

    // Don't show if already installed or dismissed
    if (isInstalled || !showPrompt || sessionStorage.getItem('installPromptDismissed') === 'true') {
        return null;
    }

    return (
        <div className="install-prompt">
            <div className="install-prompt-content">
                <div className="install-prompt-icon">📲</div>
                <div className="install-prompt-text">
                    <strong>Installer QCM Civique</strong>
                    <p>Accédez rapidement à vos révisions depuis l'écran d'accueil</p>
                </div>
                <div className="install-prompt-buttons">
                    <button className="install-button" onClick={handleInstall}>
                        Installer
                    </button>
                    <button className="dismiss-button" onClick={handleDismiss}>
                        Plus tard
                    </button>
                </div>
            </div>
        </div>
    );
}
