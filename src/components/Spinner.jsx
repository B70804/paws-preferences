export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin" />
      <span className="text-gray-400 text-sm">Loading cats…</span>
    </div>
  );
}
