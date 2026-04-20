import type { AnswerRecord, CategoryId, Difficulty, Question } from "./types";
import { CATEGORIES, DIFFICULTIES } from "./types";
import { formatTime, getHighScores } from "./storage";

interface Props {
  category: CategoryId;
  difficulty: Difficulty;
  questions: Question[];
  answers: AnswerRecord[];
  timeUsed: number;
  onRestart: () => void;
  onHome: () => void;
}

export const ResultScreen = ({ category, difficulty, questions, answers, timeUsed, onRestart, onHome }: Props) => {
  const correct = answers.filter((a) => a.correct).length;
  const total = questions.length;
  const percent = Math.round((correct / total) * 100);
  const incorrect = answers.filter((a) => a.selected !== null && !a.correct).length;
  const skipped = answers.filter((a) => a.selected === null).length;

  const cat = CATEGORIES.find((c) => c.id === category)!;
  const diff = DIFFICULTIES.find((d) => d.id === difficulty)!;
  const grade = percent >= 90 ? "S" : percent >= 75 ? "A" : percent >= 60 ? "B" : percent >= 40 ? "C" : "D";
  const passed = percent >= 60;

  const allScores = getHighScores().filter((s) => s.category === category && s.difficulty === difficulty);
  const isNewBest = allScores.length > 0 && percent === allScores[0].percent && allScores.length <= 1;

  return (
    <main className="flex-1 mt-8 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Big result card */}
        <div className="lg:col-span-2 bg-keycap border border-white/10 rounded-sm p-8 md:p-12 relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className={`absolute top-0 left-0 w-full h-1 ${passed ? "bg-voltage underglow-voltage" : "bg-laser glow-laser"}`} />
          <div className="font-mono text-[10px] text-steel uppercase tracking-[0.25em] mb-2">// MATCH COMPLETE</div>
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
            <div>
              <div className={`text-7xl md:text-9xl font-bold tabular-nums leading-none ${passed ? "text-voltage" : "text-laser"}`}>
                {percent}<span className="text-3xl md:text-5xl">%</span>
              </div>
              <div className="font-mono text-xs text-steel uppercase tracking-widest mt-2">
                Final Yield
              </div>
            </div>
            <div className="md:ml-auto text-right">
              <div className={`text-7xl font-bold leading-none ${passed ? "text-white" : "text-laser"}`}>{grade}</div>
              <div className="font-mono text-xs text-steel uppercase tracking-widest mt-2">Grade</div>
            </div>
          </div>
          {isNewBest && (
            <div className="bg-voltage/10 border border-voltage/40 px-4 py-3 mb-6">
              <div className="font-mono text-xs text-voltage uppercase tracking-widest animate-pulse">
                ★ NEW PERSONAL RECORD LOGGED
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4 font-mono">
            <button
              onClick={onRestart}
              className="bg-voltage text-voltage-foreground font-bold uppercase px-6 py-3 hover:bg-white transition-colors text-sm tracking-widest"
            >
              [ Run Again ]
            </button>
            <button
              onClick={onHome}
              className="border border-white/20 hover:border-voltage hover:text-voltage uppercase px-6 py-3 transition-colors text-sm tracking-widest"
            >
              ← New Setup
            </button>
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-keycap border border-white/10 rounded-sm p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="font-mono text-[10px] text-steel uppercase tracking-[0.25em] mb-4">Session Telemetry</div>
            <div className="grid grid-cols-2 gap-4 font-mono text-sm">
              <div>
                <div className="text-steel text-[10px] uppercase mb-1">Correct</div>
                <div className="text-voltage text-2xl font-bold tabular-nums">{correct}</div>
              </div>
              <div>
                <div className="text-steel text-[10px] uppercase mb-1">Wrong</div>
                <div className="text-laser text-2xl font-bold tabular-nums">{incorrect}</div>
              </div>
              <div>
                <div className="text-steel text-[10px] uppercase mb-1">Skipped</div>
                <div className="text-steel text-2xl font-bold tabular-nums">{skipped}</div>
              </div>
              <div>
                <div className="text-steel text-[10px] uppercase mb-1">Time</div>
                <div className="text-white text-2xl font-bold tabular-nums">{formatTime(timeUsed)}</div>
              </div>
            </div>
          </div>

          <div className="bg-keycap border border-white/10 rounded-sm p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="font-mono text-[10px] text-steel uppercase tracking-[0.25em] mb-2">Loadout</div>
            <div className="font-mono text-sm">
              <div className="text-voltage uppercase">{cat.label}</div>
              <div className={`uppercase ${difficulty === "hard" ? "text-laser" : "text-steel"}`}>
                {diff.tier} // {diff.label}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answer breakdown */}
      <section>
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 flex items-center gap-3">
          <span className="text-voltage">//</span> Answer Breakdown
        </h2>
        <div className="flex flex-col gap-3">
          {questions.map((q, i) => {
            const a = answers[i];
            const isCorrect = a.correct;
            const isSkipped = a.selected === null;
            return (
              <div
                key={q.id}
                className={`bg-keycap border rounded-sm p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                  ${isCorrect ? "border-voltage/30" : isSkipped ? "border-white/10" : "border-laser/30"}`}
              >
                <div className="flex items-start gap-4">
                  <span className={`shrink-0 size-8 border flex items-center justify-center font-mono font-bold text-xs tabular-nums
                    ${isCorrect ? "border-voltage bg-voltage/10 text-voltage" : isSkipped ? "border-white/20 text-steel" : "border-laser bg-laser/10 text-laser"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-3">{q.question}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
                      {q.options.map((opt) => {
                        const isAnswer = opt === q.answer;
                        const isPicked = opt === a.selected;
                        return (
                          <div
                            key={opt}
                            className={`px-3 py-2 border flex items-center justify-between
                              ${isAnswer
                                ? "border-voltage bg-voltage/10 text-voltage"
                                : isPicked
                                ? "border-laser bg-laser/10 text-laser"
                                : "border-white/5 text-steel"}`}
                          >
                            <span>{opt}</span>
                            {isAnswer && <span>✓</span>}
                            {isPicked && !isAnswer && <span>✕</span>}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div className="mt-3 font-mono text-xs text-steel border-l-2 border-white/10 pl-3">
                        <span className="text-voltage">EXPL //</span> {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
