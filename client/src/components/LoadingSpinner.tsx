<<<<<<< HEAD
export default function LoadingSpinner() {
  return (
    <div style={{ animation: "fadeSlideUp 0.25s ease", marginTop: "1.5rem" }}>
      {/* Primary result row skeleton */}
      <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-badge" style={{ marginBottom: "1rem" }} />
            <div className="skeleton skeleton-text" style={{ width: "80%" }} />
            <div className="skeleton skeleton-text" style={{ width: "55%" }} />
          </div>
          {/* Ring placeholder */}
          <div className="skeleton" style={{ width: 100, height: 100, borderRadius: "50%", flexShrink: 0 }} />
        </div>
      </div>

      {/* Tactics row */}
      <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <div className="skeleton skeleton-text" style={{ width: "30%", marginBottom: "0.85rem" }} />
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {[90, 120, 75, 110].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: "1.75rem", width: w, borderRadius: "999px" }} />
          ))}
        </div>
      </div>

      {/* Message block */}
      <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <div className="skeleton skeleton-text" style={{ width: "25%", marginBottom: "0.85rem" }} />
        <div className="skeleton skeleton-block" />
      </div>

      {/* Flagged phrases */}
      <div className="glass-card" style={{ padding: "1.25rem" }}>
        <div className="skeleton skeleton-text" style={{ width: "40%", marginBottom: "0.85rem" }} />
        {[1, 2].map(i => (
          <div key={i} className="skeleton" style={{ height: "3rem", marginBottom: "0.5rem", borderRadius: "0.65rem" }} />
        ))}
      </div>
    </div>
  );
=======
export default function LoadingSpinner() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />
      <span>Analyzing…</span>
    </div>
  );
>>>>>>> 60e30398828e4645438e4781d4c5132c751f3dd6
}