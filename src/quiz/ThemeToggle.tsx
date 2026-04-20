import { useEffect, useState } from "react";

interface Props {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle = ({ isDark, onToggle }: Props) => {
  return (
    <button
      onClick={onToggle}
      className="font-mono text-[10px] uppercase tracking-widest text-steel hover:text-voltage border border-white/10 hover:border-voltage px-3 py-1.5 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? "[ DARK_MODE ]" : "[ LIGHT_MODE ]"}
    </button>
  );
};

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("apex.theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDark);
    localStorage.setItem("apex.theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((v) => !v) };
}
