import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-semibold">PhishGuard AI</h1>
        <p className="mt-2 text-sm text-gray-700">
          Paste a message or upload audio to detect phishing tactics.
        </p>
        <div className="mt-6">
          <Home />
        </div>
      </div>
    </div>
  );
}