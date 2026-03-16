<<<<<<< HEAD
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
=======
export default function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
      {message}
    </div>
  );
>>>>>>> 60e30398828e4645438e4781d4c5132c751f3dd6
}