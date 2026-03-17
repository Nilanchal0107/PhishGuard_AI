import { useState } from "react";

interface Props { message: string; }

export default function ErrorBanner({ message }: Props) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="error-banner" role="alert">
      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>⚠️</span>
      <span style={{ flex: 1, color: "var(--text-primary)", fontWeight: 500 }}>{message}</span>
      <button
        className="error-banner-close"
        onClick={() => setVisible(false)}
        aria-label="Dismiss error"
      >
        ✕
      </button>
    </div>
  );
}
