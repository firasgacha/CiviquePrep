import { useState, useEffect, useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

// Store for standalone mode that can be accessed during render
const standaloneStore = {
    getSnapshot: () => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(display-mode: standalone)').matches;
    },
    getServerSnapshot: () => false,
    subscribe: (callback: () => void) => {
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        mediaQuery.addEventListener('change', callback);
        return () => mediaQuery.removeEventListener('change', callback);
    },
};

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const isStandalone = useSyncExternalStore(
        standaloneStore.subscribe,
        standaloneStore.getSnapshot,
        standaloneStore.getServerSnapshot
    );

    useEffect(() => {
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
        await deferredPrompt.userChoice;

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
    if (isStandalone || !showPrompt || sessionStorage.getItem('installPromptDismissed') === 'true') {
        return null;
    }

    return (
        <div className="install-prompt">
            <p>Installez l'application sur votre appareil pour un accès rapide !</p>
            <div className="install-prompt-buttons">
                <button onClick={handleInstall}>Installer</button>
                <button onClick={handleDismiss}>Plus tard</button>
            </div>
        </div>
    );
}
