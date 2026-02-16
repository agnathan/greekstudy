
export interface GreekWord {
  id: string;
  word: string; // Greek text
  transliteration: string;
  definition: string;
  partOfSpeech: string;
  frequency: number; // Frequency in GNT (New Testament)
  example?: string;
}

export interface UserProgress {
  wordId: string;
  correctCount: number;
  incorrectCount: number;
  lastTested: number;
  level: number; // 0-5 master level
}

export interface QuizState {
  currentWordIndex: number;
  score: number;
  startTime: number;
  isFinished: boolean;
  history: {
    wordId: string;
    correct: boolean;
  }[];
}

export type QuizMode = 'GREEK_TO_ENGLISH' | 'ENGLISH_TO_GREEK';
