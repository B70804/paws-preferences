export default function Result({ liked, onRestart, isRestarting }) {
  return (
    <div className="mt-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        You liked {liked.length} cats!
      </h2>

      <div className="flex flex-wrap justify-center gap-3">
        {liked.map((cat) => (
          <img
            key={cat}
            src={cat}
            className="w-50 h-50 object-cover rounded-lg shadow-md"
          />
        ))}
      </div>

      <button
        onClick={onRestart}
        disabled={isRestarting}
        className="mt-6 px-6 py-2 rounded-lg bg-indigo-600 disabled:opacity-50"
      >
        {isRestarting ? "Loading…" : "Start Again"}
      </button>
    </div>
  );
}
