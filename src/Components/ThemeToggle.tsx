import React, { useState, useEffect } from "react";

const ThemeToggle = React.memo(() => {
  // 1. Storage Check: Browser ki memory se theme setting check karein
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme === "dark";
    } catch {
      return false;
    }
  });

  // 2. Tailwind v4 Variant Link: HTML root class ko automatic handle karein
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      type="button"
      aria-label="Toggle display theme layout mode"
      className="absolute top-4 right-4 text-xl p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
});

ThemeToggle.displayName = "ThemeToggle";
export default ThemeToggle;
