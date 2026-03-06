import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Training } from './components/Training';
import { Exam } from './components/Exam';
import { Resume } from './components/Resume';
import { Notes } from './components/Notes';
import { Bookmarks } from './components/Bookmarks';
import { Info } from './components/Info';
import { LanguageSelector } from './components/LanguageSelector';
import { ThemeToggle } from './components/ThemeToggle';
import { ScrollToTop } from './components/ScrollToTop';
import { InstallPrompt } from './components/InstallPrompt';
import { UpdateNotification } from './components/UpdateNotification';
import { ThemeProvider } from './contexts/ThemeContext';
import { allQuestions } from './data/questions';
import type { Tab } from './types';
import './i18n';
import './App.css';

function AppContent() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('info');

  // Set direction based on language (Arabic is RTL)
  const isRTL = i18n.language === 'ar';

  return (
    <div className="container" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Controls */}
      <div className="header-controls">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <h1>{t('title')}</h1>
      <div style={{ marginBottom: '1rem' }}>{t('subtitle')}</div>

      <div className="nav-tabs">
        <div
          className={`nav-tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          {t('info')}
        </div>
        <div
          className={`nav-tab ${activeTab === 'train' ? 'active' : ''}`}
          onClick={() => setActiveTab('train')}
        >
          {t('training')}
        </div>
        <div
          className={`nav-tab ${activeTab === 'exam' ? 'active' : ''}`}
          onClick={() => setActiveTab('exam')}
        >
          {t('exam')}
        </div>
        <div
          className={`nav-tab ${activeTab === 'bookmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          {t('bookmarks')}
        </div>
        <div
          className={`nav-tab ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          {t('resume')}
        </div>
        <div
          className={`nav-tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          {t('notes')}
        </div>
      </div>

      {activeTab === 'info' ? (
        <Info />
      ) : activeTab === 'train' ? (
        <Training questions={allQuestions} />
      ) : activeTab === 'exam' ? (
        <Exam questions={allQuestions} />
      ) : activeTab === 'bookmarks' ? (
        <Bookmarks questions={allQuestions} />
      ) : activeTab === 'resume' ? (
        <Resume questions={allQuestions} />
      ) : (
        <Notes />
      )}
      <ScrollToTop />
      <footer className="app-footer">
        {t('copyright')} © {new Date().getFullYear()} {t('allRightsReserved')} 🦦
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
      <InstallPrompt />
      <UpdateNotification />
    </ThemeProvider>
  );
}

export default App;
