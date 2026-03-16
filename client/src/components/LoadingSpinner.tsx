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
}