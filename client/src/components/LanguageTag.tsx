export default function LanguageTag({ language }: { language: string }) {
  return (
    <span className="inline-flex items-center rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-900">
      {language}
    </span>
  );
}