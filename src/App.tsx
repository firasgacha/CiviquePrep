import { useState } from 'react';
import { Training } from './components/Training';
import { Exam } from './components/Exam';
import { allQuestions, corrigesParTheme } from './data/questions';
import type { Tab } from './types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('train');

  return (
    <div className="container">
      <h1>🇫🇷 Parcours citoyen</h1>
      <div style={{ marginBottom: '1rem' }}>190 questions réelles – entraînement + examen blanc</div>

      <div className="nav-tabs">
        <div
          className={`nav-tab ${activeTab === 'train' ? 'active' : ''}`}
          onClick={() => setActiveTab('train')}
        >
          📘 Entraînement
        </div>
        <div
          className={`nav-tab ${activeTab === 'exam' ? 'active' : ''}`}
          onClick={() => setActiveTab('exam')}
        >
          📝 Examen blanc
        </div>
      </div>

      {activeTab === 'train' ? (
        <Training questions={allQuestions} />
      ) : (
        <Exam questions={allQuestions} />
      )}

      <hr />
      <div className="corriges-box">
        <div style={{ fontWeight: 700, marginBottom: '0.6rem' }}>📋 Corrigés intégraux par thème</div>
        <div className="corriges-grid">
          <div>
            <span className="corriges-tag">Thème 1</span> {corrigesParTheme[1]}
          </div>
          <div>
            <span className="corriges-tag">Thème 2</span> {corrigesParTheme[2]}
          </div>
          <div>
            <span className="corriges-tag">Thème 3</span> {corrigesParTheme[3]}
          </div>
          <div>
            <span className="corriges-tag">Thème 4</span> {corrigesParTheme[4]}
          </div>
          <div>
            <span className="corriges-tag">Thème 5</span> {corrigesParTheme[5]}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
