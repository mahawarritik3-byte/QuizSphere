import type { CategoryId, Difficulty, HighScore, Question } from "./types";

const HIGH_SCORE_KEY = "apex.highscores.v1";

export async function loadQuestions(category: CategoryId, difficulty: Difficulty): Promise<Question[]> {
  const url = `${import.meta.env.BASE_URL}data/${category}_${difficulty}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${category}/${difficulty}`);
  const data = (await res.json()) as Question[];
  // dedupe by id just in case
  const seen = new Set<string>();
  return data.filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getHighScores(): HighScore[] {
  try {
    return JSON.parse(localStorage.getItem(HIGH_SCORE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveHighScore(h: HighScore) {
  const all = getHighScores();
  all.push(h);
  all.sort((a, b) => b.percent - a.percent);
  localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(all.slice(0, 50)));
}

export function getBest(category: CategoryId, difficulty: Difficulty): HighScore | null {
  return (
    getHighScores()
      .filter((s) => s.category === category && s.difficulty === difficulty)
      .sort((a, b) => b.percent - a.percent)[0] || null
  );
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
