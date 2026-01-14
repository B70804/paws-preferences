export default function Controls({ onUndo, onRestart, canUndo }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="px-3 py-2 rounded-md border border-neutral-300 bg-white text-sm
                   hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-white"
      >
        Undo
      </button>

      <button
        onClick={onRestart}
        className="px-3 py-2 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-800"
      >
        Restart
      </button>
    </div>
  );
}
