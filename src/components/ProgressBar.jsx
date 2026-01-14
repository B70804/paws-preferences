export default function ProgressBar({ current, total }) {
  const percent = total ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-neutral-500 mb-2">
        <span>{current} / {total}</span>
        <span>{percent}%</span>
      </div>

      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-neutral-900 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
