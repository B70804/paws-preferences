import TinderCard from "react-tinder-card";
import CatCard from "./CatCard";

export default function CardStack({ cats, onSwipe, refs }) {
  return (
    <div className="relative w-[320px] h-[360px] sm:w-[360px] sm:h-[440px] lg:w-[420px] lg:h-[480px]">
      {cats.map((cat, index) => (
        <TinderCard
          key={cat}
          ref={refs[index]}
          onSwipe={(dir) => onSwipe(dir, cat, index)}
          preventSwipe={["up", "down"]}
          className="absolute inset-0"
        >
          <CatCard src={cat} offset={0} />
        </TinderCard>
      ))}
    </div>
  );
}

