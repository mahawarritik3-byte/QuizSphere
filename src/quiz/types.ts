export type Difficulty = "easy" | "medium" | "hard";
export type CategoryId = "math" | "gk" | "coding";

export interface Category {
  id: CategoryId;
  label: string;
  tag: string;
  description: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface AnswerRecord {
  questionId: string;
  selected: string | null;
  correct: boolean;
}

export interface HighScore {
  category: CategoryId;
  difficulty: Difficulty;
  score: number;
  total: number;
  percent: number;
  date: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "math",
    label: "Logic & Computation",
    tag: "MATH",
    description: "Arithmetic, algebra, and quantitative reasoning under temporal stress.",
  },
  {
    id: "gk",
    label: "Global Archives",
    tag: "TRIVIA",
    description: "Historical chronologies, geography, and cultural intel from across the database.",
  },
  {
    id: "coding",
    label: "Syntax & Systems",
    tag: "CODE",
    description: "Algorithms, data structures, and language-level system architecture.",
  },
];

export const DIFFICULTIES: { id: Difficulty; tier: string; label: string; multiplier: string }[] = [
  { id: "easy", tier: "T1", label: "Standard", multiplier: "1.0x" },
  { id: "medium", tier: "T2", label: "Ranked", multiplier: "1.5x" },
  { id: "hard", tier: "T3", label: "Lethal", multiplier: "3.0x" },
];

export const TIME_OPTIONS: { label: string; seconds: number }[] = [
  { label: "5 MIN", seconds: 5 * 60 },
  { label: "10 MIN", seconds: 10 * 60 },
  { label: "15 MIN", seconds: 15 * 60 },
  { label: "30 MIN", seconds: 30 * 60 },
];
