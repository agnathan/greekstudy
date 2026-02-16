
import React, { useState, useEffect, useMemo } from 'react';
import { GreekWord, UserProgress, QuizMode } from './types';
import { GREEK_VOCABULARY } from './constants';
import QuizCard from './components/QuizCard';
import Stats from './components/Stats';
import VocabularyList from './components/VocabularyList';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'quiz' | 'settings' | 'vocabulary'>('home');
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [quizMode, setQuizMode] = useState<QuizMode>('GREEK_TO_ENGLISH');
  const [currentQuizWords, setCurrentQuizWords] = useState<GreekWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('logos_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  // Save progress
  const saveProgress = (newProgress: UserProgress[]) => {
    setProgress(newProgress);
    localStorage.setItem('logos_progress', JSON.stringify(newProgress));
  };

  const startQuiz = () => {
    // Select 10 random words or words the user is struggling with
    const shuffled = [...GREEK_VOCABULARY].sort(() => 0.5 - Math.random());
    setCurrentQuizWords(shuffled.slice(0, 10));
    setCurrentWordIndex(0);
    setQuizScore(0);
    setActiveTab('quiz');
  };

  const handleAnswer = (correct: boolean) => {
    const word = currentQuizWords[currentWordIndex];
    
    const newProgress = [...progress];
    const existingIndex = newProgress.findIndex(p => p.wordId === word.id);
    
    if (existingIndex > -1) {
      if (correct) {
        newProgress[existingIndex].correctCount++;
        newProgress[existingIndex].level = Math.min(5, newProgress[existingIndex].level + 0.5);
      } else {
        newProgress[existingIndex].incorrectCount++;
        newProgress[existingIndex].level = Math.max(0, newProgress[existingIndex].level - 1);
      }
      newProgress[existingIndex].lastTested = Date.now();
    } else {
      newProgress.push({
        wordId: word.id,
        correctCount: correct ? 1 : 0,
        incorrectCount: correct ? 0 : 1,
        lastTested: Date.now(),
        level: correct ? 1 : 0
      });
    }

    saveProgress(newProgress);
    if (correct) setQuizScore(prev => prev + 1);

    if (currentWordIndex < currentQuizWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Quiz finished - wait a bit then go home
      setTimeout(() => {
        setActiveTab('home');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              Λ
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Logos</h1>
          </div>
          
          <nav className="flex gap-1">
            <NavButton 
              active={activeTab === 'home'} 
              onClick={() => setActiveTab('home')} 
              icon={<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
              label="Learn"
            />
            <NavButton 
              active={activeTab === 'vocabulary'} 
              onClick={() => setActiveTab('vocabulary')} 
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
              label="Lexicon"
            />
            <NavButton 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
              icon={<path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
              label="Config"
            />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Shalom, Learner!</h2>
                <p className="text-slate-500">Ready to master some Koine Greek today?</p>
              </div>
              <button 
                onClick={startQuiz}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Start New Session
              </button>
            </div>

            <Stats progress={progress} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">🏆</span> Mastery Progress
                </h3>
                <div className="space-y-3">
                  {GREEK_VOCABULARY.slice(0, 5).map(word => {
                    const prog = progress.find(p => p.wordId === word.id);
                    const mastery = prog ? (prog.level / 5) * 100 : 0;
                    return (
                      <div key={word.id} className="group cursor-default">
                        <div className="flex justify-between items-center mb-1">
                          <span className="greek-text font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{word.word}</span>
                          <span className="text-xs text-slate-400 font-medium uppercase tracking-tighter">{word.definition.split(',')[0]}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 transition-all duration-1000" 
                            style={{ width: `${mastery}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button 
                  onClick={() => setActiveTab('vocabulary')}
                  className="w-full mt-6 text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition-colors"
                >
                  View All Vocabulary →
                </button>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Word of the Day</h3>
                  <div className="my-8">
                    <span className="greek-text text-6xl block mb-2">{GREEK_VOCABULARY[10].word}</span>
                    <span className="text-indigo-200 text-lg uppercase tracking-widest">{GREEK_VOCABULARY[10].transliteration}</span>
                  </div>
                  <p className="text-indigo-100 italic text-lg mb-6">"In the beginning was the Word (logos)..."</p>
                  <p className="text-xl font-medium">{GREEK_VOCABULARY[10].definition}</p>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full -ml-12 -mb-12 blur-2xl" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vocabulary' && (
          <VocabularyList />
        )}

        {activeTab === 'quiz' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto pt-10">
            <div className="mb-8 flex items-center justify-between text-slate-500 font-medium">
              <button 
                onClick={() => setActiveTab('home')}
                className="hover:text-slate-800 flex items-center gap-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Exit Session
              </button>
              <div className="flex items-center gap-4">
                <span>{currentWordIndex + 1} / {currentQuizWords.length}</span>
                <div className="h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${((currentWordIndex + 1) / currentQuizWords.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <QuizCard 
              word={currentQuizWords[currentWordIndex]} 
              onAnswer={handleAnswer} 
              mode={quizMode} 
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100 animate-in fade-in">
            <h2 className="text-2xl font-bold mb-8">Settings & Configuration</h2>
            
            <div className="space-y-8">
              <section>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Quiz Preferences</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <div className="font-bold text-slate-800">Quiz Mode</div>
                      <div className="text-sm text-slate-500">Choose your testing direction</div>
                    </div>
                    <select 
                      value={quizMode}
                      onChange={(e) => setQuizMode(e.target.value as QuizMode)}
                      className="bg-white border border-slate-200 rounded-lg px-3 py-1 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="GREEK_TO_ENGLISH">Greek → English</option>
                      <option value="ENGLISH_TO_GREEK">English → Greek</option>
                    </select>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Account & Data</h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      if(confirm("Reset all learning progress? This cannot be undone.")) {
                        saveProgress([]);
                        alert("Progress reset successfully.");
                      }
                    }}
                    className="w-full text-left p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold">Reset All Data</div>
                      <div className="text-xs text-rose-400">Permanently clear your mastery progress</div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </section>

              <div className="pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
                Logos Biblical Greek Quizzer • AI Powered Pronunciation
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
      active 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
    }`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icon}
    </svg>
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default App;
