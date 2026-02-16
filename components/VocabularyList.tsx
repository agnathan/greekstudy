
import React, { useState } from 'react';
import { GREEK_VOCABULARY } from '../constants';
import { speakGreekWord } from '../services/geminiService';

const VocabularyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const filteredVocabulary = GREEK_VOCABULARY.filter(word => 
    word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.transliteration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSpeak = async (word: string, id: string) => {
    if (speakingId) return;
    setSpeakingId(id);
    await speakGreekWord(word);
    setSpeakingId(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Lexicon</h2>
        <p className="text-slate-500">Explore the most frequent words in the Greek New Testament.</p>
      </div>

      <div className="sticky top-20 z-20 mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Search by Greek, English, or transliteration..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocabulary.map((word) => (
          <div key={word.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="greek-text text-2xl font-bold text-slate-900">{word.word}</span>
                <span className="ml-2 text-xs text-slate-400 font-medium uppercase tracking-widest">{word.transliteration}</span>
              </div>
              <button 
                onClick={() => handleSpeak(word.word, word.id)}
                disabled={speakingId === word.id}
                className={`p-2 rounded-full hover:bg-indigo-50 text-indigo-600 transition-colors ${speakingId === word.id ? 'opacity-50 animate-pulse' : 'opacity-0 group-hover:opacity-100'}`}
                title="Listen to pronunciation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
            </div>
            <p className="text-slate-600 font-medium">{word.definition}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded-md">
                {word.partOfSpeech}
              </span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                Freq: {word.frequency}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredVocabulary.length === 0 && (
        <div className="text-center py-20 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-lg">No words found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default VocabularyList;
