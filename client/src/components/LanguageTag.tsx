// Optional native-script preview next to the language name
const SCRIPT_PREVIEW: Record<string, string> = {
  Hindi:   "हिन्दी",
  Marathi: "मराठी",
  Tamil:   "தமிழ்",
  English: "Eng",
};

export default function LanguageTag({ language }: { language: string }) {
  const preview = SCRIPT_PREVIEW[language];
  return (
    <span className="lang-tag">
      <span style={{ fontSize: "0.9rem" }}>🌐</span>
      {preview && (
        <span style={{ fontWeight: 800, color: "var(--accent-cyan)", fontSize: "0.82rem" }}>
          {preview}
        </span>
      )}
      <span>{language}</span>
    </span>
  );
}
