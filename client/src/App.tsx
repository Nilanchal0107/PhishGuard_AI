import { useEffect, useState } from "react";
import Home from "./pages/Home";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("pg-theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pg-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Subtle background decoration */}
      <div className="bg-decoration" />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <header className="site-header">
          <div className="logo-mark">
            {/* Shield SVG icon */}
            <svg className="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M20 3L5 9v10c0 9.5 6.4 18.4 15 21 8.6-2.6 15-11.5 15-21V9L20 3z" fill="url(#shield-grad)" />
              <path d="M14 20l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="shield-grad" x1="5" y1="3" x2="35" y2="37" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </svg>

            <div>
              <div className="logo-name">
                Phish<span>Guard</span>
              </div>
              <div className="logo-tagline">AI Phishing Shield for Indian Languages</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div className="status-pill">
              <span className="status-dot" />
              AI Online
            </div>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* ── Main content ── */}
        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.25rem 4rem" }}>
          <Home />
        </main>
      </div>
    </div>
  );
}
