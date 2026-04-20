import { useEffect, useMemo, useRef, useState } from "react";
import type { AnswerRecord, CategoryId, Difficulty, Question } from "./types";
import { CATEGORIES, DIFFICULTIES } from "./types";
import { formatTime } from "./storage";

interface Props {
  category: CategoryId;
  difficulty: Difficulty;
  seconds: number;
  questions: Question[];
  onFinish: (answers: AnswerRecord[], timeUsed: number) => void;
  onAbort: () => void;
}

export const QuizScreen = ({ category, difficulty, seconds, questions, onFinish, onAbort }: Props) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [remaining, setRemaining] = useState(seconds);
  const [paused, setPaused] = useState(false);
  const [shaken, setShaken] = useState(false);
  const finishedRef = useRef(false);

  const cat = useMemo(() => CATEGORIES.find((c) => c.id === category)!, [category]);
  const diff = useMemo(() => DIFFICULTIES.find((d) => d.id === difficulty)!, [difficulty]);
  const q = questions[current];

  const handleFinish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const records: AnswerRecord[] = questions.map((qq) => {
      const selected = answers[qq.id] ?? null;
      return { questionId: qq.id, selected, correct: selected === qq.answer };
    });
    onFinish(records, seconds - remaining);
  };

  // Timer
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setTimeout(handleFinish, 0);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  useEffect(() => {
    if (remaining === 30) setShaken(true);
  }, [remaining]);

  const select = (opt: string) => {
    if (paused) return;
    setAnswers((a) => ({ ...a, [q.id]: opt }));
  };

  const attempted = Object.values(answers).filter(Boolean).length;
  const progress = ((current + 1) / questions.length) * 100;
  const lowTime = remaining <= 30;

  return (
    <main className="flex-1 flex flex-col lg:flex-row gap-8 mt-8 animate-slide-up">
      {/* MAIN PANEL */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Status bar */}
        <div className="flex flex-wrap gap-4 items-center justify-between font-mono text-xs">
          <div className="flex gap-3 items-center">
            <span className="text-voltage uppercase tracking-widest">[{cat.tag}]</span>
            <span className="text-steel uppercase">/</span>
            <span className={`uppercase tracking-widest ${difficulty === "hard" ? "text-laser" : "text-white"}`}>
              {diff.tier} // {diff.label}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-steel uppercase tracking-widest">
              Q <span className="text-white tabular-nums">{current + 1}</span> / {questions.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-white/10 overflow-hidden relative">
          <div
            className="h-full bg-voltage underglow-voltage transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className={`bg-keycap border border-white/10 rounded-sm p-6 md:p-10 flex flex-col gap-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex-1 ${shaken && lowTime ? "animate-shake" : ""}`}>
          <div className="font-mono text-[10px] text-steel uppercase tracking-[0.25em]">
            // QUERY {String(current + 1).padStart(3, "0")}
          </div>
          <h2 className="text-xl md:text-3xl font-bold tracking-tight leading-tight">{q.question}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === opt;
              const letter = String.fromCharCode(65 + i);
              return (
                <button
                  key={opt}
                  onClick={() => select(opt)}
                  disabled={paused}
                  className={`group relative text-left p-4 border font-mono text-sm transition-all flex items-center gap-4
                    ${selected
                      ? "border-voltage bg-voltage/10 text-voltage"
                      : "border-white/10 hover:border-white/30 hover:bg-keycap-hover"}`}
                >
                  <span className={`shrink-0 size-8 border flex items-center justify-center font-bold tabular-nums
                    ${selected ? "border-voltage bg-voltage text-voltage-foreground" : "border-white/20 text-steel group-hover:text-white"}`}>
                    {letter}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Nav */}
          <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/10">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="font-mono text-xs uppercase tracking-widest text-steel hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2 border border-white/10 hover:border-white/30"
            >
              ← Prev
            </button>
            {current === questions.length - 1 ? (
              <button
                onClick={handleFinish}
                className="font-mono text-sm uppercase tracking-widest bg-voltage text-voltage-foreground font-bold px-6 py-3 hover:bg-white transition-colors"
              >
                [ Submit ]
              </button>
            ) : (
              <button
                onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                className="font-mono text-xs uppercase tracking-widest text-white hover:text-voltage px-4 py-2 border border-white/20 hover:border-voltage transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SIDE PANEL */}
      <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
        {/* Timer */}
        <div className={`bg-keycap border rounded-sm p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors
          ${lowTime ? "border-laser glow-laser" : "border-white/10"}`}>
          <div className="text-steel text-[10px] uppercase tracking-[0.25em] font-bold mb-2">Time Remaining</div>
          <div className={`font-mono text-5xl font-bold tabular-nums ${lowTime ? "text-laser animate-pulse" : "text-voltage"}`}>
            {formatTime(remaining)}
          </div>
          {lowTime && (
            <div className="text-laser font-mono text-[10px] uppercase tracking-widest mt-2 animate-blink">
              ⚠ CRITICAL // SUBMIT NOW
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="bg-keycap border border-white/10 rounded-sm p-6 grid grid-cols-2 gap-4 font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div>
            <div className="text-steel text-[10px] uppercase mb-1">Attempted</div>
            <div className="text-2xl text-voltage font-bold tabular-nums">{attempted}</div>
          </div>
          <div>
            <div className="text-steel text-[10px] uppercase mb-1">Skipped</div>
            <div className="text-2xl text-steel font-bold tabular-nums">{questions.length - attempted}</div>
          </div>
        </div>

        {/* Question grid */}
        <div className="bg-keycap border border-white/10 rounded-sm p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="text-steel text-[10px] uppercase tracking-[0.25em] font-bold mb-3">Navigation</div>
          <div className="grid grid-cols-6 gap-1.5">
            {questions.map((qq, i) => {
              const isAnswered = !!answers[qq.id];
              const isCurrent = i === current;
              return (
                <button
                  key={qq.id}
                  onClick={() => setCurrent(i)}
                  className={`aspect-square text-xs font-mono font-bold border transition-colors tabular-nums
                    ${isCurrent
                      ? "border-voltage bg-voltage text-voltage-foreground"
                      : isAnswered
                      ? "border-voltage/40 bg-voltage/10 text-voltage"
                      : "border-white/10 text-steel hover:border-white/30"}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <button
            onClick={() => setPaused((p) => !p)}
            className="border border-white/10 hover:border-voltage hover:text-voltage py-3 uppercase tracking-widest transition-colors"
          >
            {paused ? "▶ Resume" : "❚❚ Pause"}
          </button>
          <button
            onClick={onAbort}
            className="border border-white/10 hover:border-laser hover:text-laser py-3 uppercase tracking-widest transition-colors"
          >
            ✕ Abort
          </button>
        </div>
      </aside>

      {/* Pause overlay */}
      {paused && (
        <div className="fixed inset-0 bg-void/90 backdrop-blur-sm z-50 flex items-center justify-center scanline">
          <div className="text-center">
            <div className="text-voltage font-mono text-xs uppercase tracking-[0.3em] mb-4 animate-blink">// SESSION PAUSED</div>
            <div className="text-6xl md:text-8xl font-bold uppercase tracking-tighter mb-8">Standby</div>
            <button
              onClick={() => setPaused(false)}
              className="bg-voltage text-voltage-foreground font-bold uppercase px-8 py-4 hover:bg-white transition-colors"
            >
              [ Resume Match ]
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
