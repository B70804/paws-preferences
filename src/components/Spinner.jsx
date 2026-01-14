export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
      <span className="text-neutral-500 text-sm">Loading cats…</span>
    </div>
  );
}
