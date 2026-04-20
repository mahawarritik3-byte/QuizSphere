import { useState } from "react";
import { CATEGORIES, DIFFICULTIES, TIME_OPTIONS, type CategoryId, type Difficulty } from "./types";
import { getBest, formatTime } from "./storage";

interface Props {
  onStart: (config: { category: CategoryId; difficulty: Difficulty; seconds: number; shuffle: boolean }) => void;
}

export const SetupScreen = ({ onStart }: Props) => {
  const [category, setCategory] = useState<CategoryId>("coding");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [seconds, setSeconds] = useState<number>(10 * 60);
  const [customMin, setCustomMin] = useState<string>("");
  const [shouldShuffle, setShouldShuffle] = useState(true);

  const handleCustom = (v: string) => {
    setCustomMin(v);
    const n = Math.max(1, Math.min(120, parseInt(v) || 0));
    if (n > 0) setSeconds(n * 60);
  };

  return (
    <main className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-10 mt-8 md:mt-10 animate-slide-up">
      {/* LEFT: Category grid */}
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase flex items-center gap-3">
          <span className="text-voltage">//</span> Select Arena
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.id;
            const best = getBest(cat.id, difficulty);
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`text-left bg-keycap border rounded-sm p-6 flex flex-col gap-6 cursor-pointer transition-all relative overflow-hidden
                  ${isActive
                    ? "border-voltage glow-voltage"
                    : "border-white/5 hover:bg-keycap-hover hover:border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"}`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-voltage underglow-voltage" />
                )}
                <div className="flex justify-between items-start">
                  <h2 className={`text-xl font-bold tracking-tight uppercase ${isActive ? "text-voltage" : ""}`}>
                    {cat.label}
                  </h2>
                  <span
                    className={`font-mono text-[10px] tracking-widest border px-2 py-1 rounded-sm
                      ${isActive ? "border-voltage/40 bg-voltage/10 text-voltage" : "text-steel border-white/10"}`}
                  >
                    [{cat.tag}]
                  </span>
                </div>
                <p className="font-mono text-xs text-steel leading-relaxed">{cat.description}</p>
                <div className="grid grid-cols-2 gap-4 font-mono text-sm mt-auto">
                  <div>
                    <div className="text-steel text-[10px] uppercase mb-1">Personal Best</div>
                    <div className={`tabular-nums ${best ? "" : "text-steel"}`}>
                      {best ? `${best.percent}%` : "--.-%"}
                    </div>
                  </div>
                  <div>
                    <div className="text-steel text-[10px] uppercase mb-1">Sessions</div>
                    <div className="tabular-nums">{best ? "logged" : "—"}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Loadout */}
      <div className="w-full lg:w-[400px] shrink-0">
        <div className="bg-keycap border border-white/10 rounded-sm p-6 md:p-8 flex flex-col h-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="mb-8">
            <h3 className="text-steel text-xs uppercase tracking-[0.25em] font-bold mb-4">Target Parameter</h3>
            <div className="font-mono text-2xl text-voltage mb-2 uppercase">
              {CATEGORIES.find((c) => c.id === category)?.label}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-steel text-xs uppercase tracking-[0.25em] font-bold mb-4">Difficulty Class</h3>
            <div className="flex flex-col gap-2 font-mono">
              {DIFFICULTIES.map((d) => {
                const active = difficulty === d.id;
                const isLethal = d.id === "hard" && active;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`flex justify-between items-center p-3 border text-left transition-colors relative overflow-hidden
                      ${isLethal
                        ? "border-laser bg-laser/5 text-laser font-bold"
                        : active
                        ? "border-voltage bg-voltage/5 text-voltage"
                        : "border-white/10 text-steel hover:border-white/30 hover:text-white"}`}
                  >
                    <span>{d.tier} // {d.label}</span>
                    <span className="text-xs">{d.multiplier}</span>
                    {active && (
                      <div
                        className={`absolute right-0 top-0 h-full w-1 ${isLethal ? "bg-laser glow-laser" : "bg-voltage underglow-voltage"}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-steel text-xs uppercase tracking-[0.25em] font-bold mb-4">Test Duration</h3>
            <div className="grid grid-cols-4 gap-2 font-mono mb-2">
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t.seconds}
                  onClick={() => {
                    setSeconds(t.seconds);
                    setCustomMin("");
                  }}
                  className={`p-2 border text-xs transition-colors
                    ${seconds === t.seconds && !customMin
                      ? "border-voltage bg-voltage/10 text-voltage"
                      : "border-white/10 text-steel hover:border-white/30"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-[10px] text-steel uppercase">Custom</span>
              <input
                type="number"
                min={1}
                max={120}
                value={customMin}
                onChange={(e) => handleCustom(e.target.value)}
                placeholder="MM"
                className="flex-1 bg-void border border-white/10 px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-voltage tabular-nums"
              />
              <span className="text-[10px] text-steel uppercase">min</span>
            </div>
          </div>

          <label className="flex items-center gap-3 mb-6 cursor-pointer font-mono text-xs text-steel">
            <input
              type="checkbox"
              checked={shouldShuffle}
              onChange={(e) => setShouldShuffle(e.target.checked)}
              className="size-4 accent-voltage"
            />
            <span className="uppercase tracking-widest">Randomize sequence</span>
          </label>

          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="flex justify-between items-end mb-4 font-mono">
              <div className="text-steel text-[10px] uppercase tracking-widest">Allotted Time</div>
              <div className="text-white tabular-nums">{formatTime(seconds)}</div>
            </div>
            <button
              onClick={() => onStart({ category, difficulty, seconds, shuffle: shouldShuffle })}
              className="w-full bg-voltage text-voltage-foreground font-bold text-lg uppercase tracking-tight py-5 hover:bg-white transition-colors relative group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                [ Initialize Match ]
              </span>
              <div className="absolute inset-0 border border-voltage opacity-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
