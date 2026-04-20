import { ThemeToggle } from "./ThemeToggle";

interface Props {
  rank?: string;
  network?: string;
  status?: string;
  rightSlot?: React.ReactNode;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const HudHeader = ({
  rank = "#8,492",
  network = "14ms",
  status = "System Online",
  rightSlot,
  isDark,
  onToggleTheme,
}: Props) => {
  return (
    <header className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between md:items-start border-b border-white/10 pb-6">
      <div className="flex flex-col gap-1">
        <div className="text-voltage font-mono text-[10px] tracking-[0.25em] uppercase font-bold flex items-center gap-2">
          <span className="size-1.5 bg-voltage rounded-full animate-pulse-voltage inline-block" />
          {status}
        </div>
        <div className="text-2xl md:text-3xl font-bold tracking-tight uppercase">
          QuizSphere<span className="text-voltage">.</span>Protocol
        </div>
      </div>
      <div className="flex flex-wrap gap-6 md:gap-8 font-mono text-sm md:text-right items-center">
        {rightSlot}
        <div className="flex flex-col">
          <span className="text-steel text-[10px] uppercase tracking-widest">Rank</span>
          <span className="font-bold tabular-nums">{rank}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-steel text-[10px] uppercase tracking-widest">Network</span>
          <span className="text-voltage font-bold tabular-nums">{network}</span>
        </div>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </header>
  );
};
