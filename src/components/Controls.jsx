export default function Controls({ onUndo, onRestart, canUndo }) {
  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="px-4 py-2 rounded-lg bg-gray-700 disabled:opacity-40"
      >
        Undo
      </button>

      <button
        onClick={onRestart}
        className="px-4 py-2 rounded-lg bg-indigo-600"
      >
        Restart
      </button>
    </div>
  );
}
