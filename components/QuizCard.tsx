
import React, { useState, useEffect } from 'react';
import { GreekWord } from '../types';
import { speakGreekWord } from '../services/geminiService';

interface QuizCardProps {
  word: GreekWord;
  onAnswer: (correct: boolean) => void;
  mode: 'GREEK_TO_ENGLISH' | 'ENGLISH_TO_GREEK';
}

const QuizCard: React.FC<QuizCardProps> = ({ word, onAnswer, mode }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setShowAnswer(false);
    setUserGuess('');
    setResult(null);
  }, [word]);

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    await speakGreekWord(word.word);
    setIsSpeaking(false);
  };

  const checkAnswer = () => {
    const isCorrect = userGuess.trim().toLowerCase() === (mode === 'GREEK_TO_ENGLISH' ? word.definition.toLowerCase().split(',')[0].trim() : word.word.toLowerCase());
    setResult(isCorrect ? 'correct' : 'incorrect');
    setShowAnswer(true);
    
    // Auto-advance after delay
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto transition-all duration-300 transform">
      <div className="flex justify-between items-start mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Vocabulary Quiz
        </span>
        <button 
          onClick={handleSpeak}
          disabled={isSpeaking}
          className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${isSpeaking ? 'opacity-50' : 'opacity-100'}`}
          title="Listen to pronunciation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      </div>

      <div className="text-center py-12">
        <h2 className={`text-5xl font-bold mb-4 text-slate-900 ${mode === 'GREEK_TO_ENGLISH' ? 'greek-text' : ''}`}>
          {mode === 'GREEK_TO_ENGLISH' ? word.word : word.definition.split(',')[0]}
        </h2>
        {showAnswer && (
          <div className="animate-fade-in">
            <p className="text-lg text-slate-500 mb-2">{word.transliteration}</p>
            <p className="text-2xl font-medium text-indigo-600">
              {mode === 'GREEK_TO_ENGLISH' ? word.definition : word.word}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {!showAnswer ? (
          <>
            <input
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              autoFocus
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none transition-colors text-lg text-center"
              placeholder={mode === 'GREEK_TO_ENGLISH' ? "English translation..." : "Greek word..."}
            />
            <button
              onClick={checkAnswer}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
            >
              Check Answer
            </button>
          </>
        ) : (
          <div className={`w-full py-4 rounded-xl text-center font-bold text-lg shadow-inner ${
            result === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {result === 'correct' ? 'Correct! Well done.' : `Oops! It was ${mode === 'GREEK_TO_ENGLISH' ? word.definition : word.word}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
