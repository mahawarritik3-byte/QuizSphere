import { useState } from "react";
import { HudHeader } from "@/quiz/HudHeader";
import { SetupScreen } from "@/quiz/SetupScreen";
import { QuizScreen } from "@/quiz/QuizScreen";
import { ResultScreen } from "@/quiz/ResultScreen";
import { useTheme } from "@/quiz/ThemeToggle";
import { loadQuestions, saveHighScore, shuffle } from "@/quiz/storage";
import type { AnswerRecord, CategoryId, Difficulty, Question } from "@/quiz/types";

type Phase =
  | { kind: "setup" }
  | { kind: "loading" }
  | { kind: "playing"; category: CategoryId; difficulty: Difficulty; seconds: number; questions: Question[] }
  | {
      kind: "result";
      category: CategoryId;
      difficulty: Difficulty;
      questions: Question[];
      answers: AnswerRecord[];
      timeUsed: number;
    };

const Index = () => {
  const { isDark, toggle } = useTheme();
  const [phase, setPhase] = useState<Phase>({ kind: "setup" });
  const [error, setError] = useState<string | null>(null);

  const handleStart = async (cfg: {
    category: CategoryId;
    difficulty: Difficulty;
    seconds: number;
    shuffle: boolean;
  }) => {
    setPhase({ kind: "loading" });
    setError(null);
    try {
      const data = await loadQuestions(cfg.category, cfg.difficulty);
      const questions = cfg.shuffle ? shuffle(data) : data;
      setPhase({
        kind: "playing",
        category: cfg.category,
        difficulty: cfg.difficulty,
        seconds: cfg.seconds,
        questions,
      });
    } catch (e) {
      setError((e as Error).message);
      setPhase({ kind: "setup" });
    }
  };

  const handleFinish = (answers: AnswerRecord[], timeUsed: number) => {
    if (phase.kind !== "playing") return;
    const correct = answers.filter((a) => a.correct).length;
    const total = phase.questions.length;
    const percent = Math.round((correct / total) * 100);
    saveHighScore({
      category: phase.category,
      difficulty: phase.difficulty,
      score: correct,
      total,
      percent,
      date: new Date().toISOString(),
    });
    setPhase({
      kind: "result",
      category: phase.category,
      difficulty: phase.difficulty,
      questions: phase.questions,
      answers,
      timeUsed,
    });
  };

  return (
    <div className="min-h-dvh bg-background text-foreground p-5 md:p-10 flex flex-col scanline">
      <HudHeader isDark={isDark} onToggleTheme={toggle} />

      {error && (
        <div className="mt-6 p-4 border border-laser bg-laser/10 text-laser font-mono text-xs uppercase tracking-widest">
          ⚠ ERROR // {error}
        </div>
      )}

      {phase.kind === "setup" && <SetupScreen onStart={handleStart} />}

      {phase.kind === "loading" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="font-mono text-voltage uppercase tracking-[0.3em] animate-blink">
            // Loading_module...
          </div>
        </div>
      )}

      {phase.kind === "playing" && (
        <QuizScreen
          category={phase.category}
          difficulty={phase.difficulty}
          seconds={phase.seconds}
          questions={phase.questions}
          onFinish={handleFinish}
          onAbort={() => setPhase({ kind: "setup" })}
        />
      )}

      {phase.kind === "result" && (
        <ResultScreen
          category={phase.category}
          difficulty={phase.difficulty}
          questions={phase.questions}
          answers={phase.answers}
          timeUsed={phase.timeUsed}
          onRestart={() =>
            handleStart({
              category: phase.category,
              difficulty: phase.difficulty,
              seconds: 10 * 60,
              shuffle: true,
            })
          }
          onHome={() => setPhase({ kind: "setup" })}
        />
      )}

      <footer className="mt-10 pt-6 border-t border-white/10 font-mono text-[10px] text-steel uppercase tracking-widest flex flex-wrap justify-between gap-2">
        <span>// APEX.PROTOCOL v1.0.0 — Cognitive Performance Suite</span>
        <span>MADE BY RITIK : 
          <a href="https://ritikportfolio-beta.vercel.app/" rel="noopener noreferrer" 
           style={{ backgroundColor: "", color: "red", padding: "5px" }}
          > VISIT PORTFOLIO</a>
        </span>
        <span>NODE: US-WEST-01 / SECURE</span>
      </footer>
    </div>
  );
};

export default Index;
