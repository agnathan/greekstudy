
import React from 'react';
import { UserProgress } from '../types';
import { GREEK_VOCABULARY } from '../constants';

interface StatsProps {
  progress: UserProgress[];
}

const Stats: React.FC<StatsProps> = ({ progress }) => {
  const wordsSeen = progress.length;
  const totalCorrect = progress.reduce((acc, p) => acc + p.correctCount, 0);
  const totalIncorrect = progress.reduce((acc, p) => acc + p.incorrectCount, 0);
  const accuracy = wordsSeen > 0 ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100) : 0;
  
  const masteredCount = progress.filter(p => p.level >= 3).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatBox label="Words Seen" value={wordsSeen} subValue={`of ${GREEK_VOCABULARY.length}`} icon="📖" />
      <StatBox label="Accuracy" value={`${accuracy}%`} subValue="Overall" icon="🎯" color="text-indigo-600" />
      <StatBox label="Mastered" value={masteredCount} subValue="Level 3+" icon="⭐" color="text-amber-500" />
      <StatBox label="Total Correct" value={totalCorrect} subValue="Lifetime" icon="✅" color="text-emerald-500" />
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string | number; subValue: string; icon: string; color?: string }> = ({ label, value, subValue, icon, color = 'text-slate-800' }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
    </div>
    <div className={`text-3xl font-bold ${color}`}>{value}</div>
    <div className="text-slate-400 text-xs mt-1">{subValue}</div>
  </div>
);

export default Stats;
