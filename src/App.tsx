import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Training } from './components/Training';
import { Exam } from './components/Exam';
import { LanguageSelector } from './components/LanguageSelector';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { allQuestions, corrigesParTheme } from './data/questions';
import type { Tab } from './types';
import './i18n';
import './App.css';

function AppContent() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('train');

  return (
    <div className="container">
      {/* Header Controls */}
      <div className="header-controls">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <h1>{t('title')}</h1>
      <div style={{ marginBottom: '1rem' }}>{t('subtitle')}</div>

      <div className="nav-tabs">
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
      </div>

      {activeTab === 'train' ? (
        <Training questions={allQuestions} />
      ) : (
        <Exam questions={allQuestions} />
      )}

      <hr />
      <div className="corriges-box">
        <div style={{ fontWeight: 700, marginBottom: '0.6rem' }}>{t('corrections')}</div>
        <div className="corriges-grid">
          <div>
            <span className="corriges-tag">{t('theme')} 1</span> {corrigesParTheme[1]}
          </div>
          <div>
            <span className="corriges-tag">{t('theme')} 2</span> {corrigesParTheme[2]}
          </div>
          <div>
            <span className="corriges-tag">{t('theme')} 3</span> {corrigesParTheme[3]}
          </div>
          <div>
            <span className="corriges-tag">{t('theme')} 4</span> {corrigesParTheme[4]}
          </div>
          <div>
            <span className="corriges-tag">{t('theme')} 5</span> {corrigesParTheme[5]}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
