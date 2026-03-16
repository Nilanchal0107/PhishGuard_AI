export default function LoadingSpinner() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />
      <span>Analyzing…</span>
    </div>
  );
}