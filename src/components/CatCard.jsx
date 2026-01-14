export default function CatCard({ src, offset }) {
  return (
    <div
      className="relative w-full h-full rounded-2xl shadow-xl bg-gray-800 overflow-hidden"
      style={{
        transform: `
          scale(${1 - offset * 0.04})
          translateY(${offset * 10}px)
        `,
        opacity: offset > 3 ? 0 : 1,
        pointerEvents: offset === 0 ? "auto" : "none",
      }}
    >
      <img
        src={src}
        draggable={false}
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>
  );
}
