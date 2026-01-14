export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="w-80 mt-6">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>
          {current} / {total}
        </span>
        <span>{percent}%</span>
      </div>

      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
