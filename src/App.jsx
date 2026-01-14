import { useEffect, useState, useRef, createRef } from "react";

import SwipeEffect from "./components/SwipeEffect";
import ProgressBar from "./components/ProgressBar";
import Controls from "./components/Controls";
import LoadingCard from "./components/LoadingCard";
import CardStack from "./components/CardStack";
import Result from "./components/Result";

import useSwipeHistory from "./hooks/useSwipeHistory";
import { createRandomCat, TOTAL_CATS } from "./utils/catApi";

export default function App() {
  const [cats, setCats] = useState([]);
  const [liked, setLiked] = useState([]);
  const [cardsLeft, setCardsLeft] = useState(0);

  const [showHeart, setShowHeart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestarting, setIsRestarting] = useState(false);

  const childRefs = useRef([]);
  const gone = useRef(new Set());

  const history = useSwipeHistory();

  const loadCats = async (isRestart = false) => {
    if (isRestart) setIsRestarting(true);
    setIsLoading(true);

    cats.forEach(URL.revokeObjectURL);

    const urls = await Promise.all(
      Array.from({ length: TOTAL_CATS }, createRandomCat)
    );

    setCats(urls);
    setCardsLeft(urls.length);
    setLiked([]);
    history.clear();
    setShowHeart(false);

    setIsLoading(false);
    setIsRestarting(false);
  };

  useEffect(() => {
    childRefs.current = cats.map((_, i) => childRefs.current[i] || createRef());
  }, [cats]);

  useEffect(() => {
    loadCats();
    return () => cats.forEach(URL.revokeObjectURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const swiped = (direction, cat, index) => {
    history.push({ cat, direction, index });
    gone.current.add(index);

    if (direction === "right") {
      setLiked((p) => [...p, cat]);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 700);
    }

    setCardsLeft((p) => p - 1);
  };

  const undo = async () => {
    const last = history.pop();
    if (!last) return;

    // update counts/liked
    setCardsLeft((p) => p + 1);
    if (last.direction === "right") setLiked((p) => p.slice(0, -1));

    // mark as not gone anymore
    gone.current.delete(last.index);

    const ref = childRefs.current[last.index];
    if (!ref?.current) return;

    // fly-back animation
    await ref.current.restoreCard();
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-900 text-white p-4 overflow-hidden">
      <h1 className="text-3xl font-bold mb-6">Paws & Preferences</h1>

      {showHeart && <SwipeEffect />}

      {isLoading && <LoadingCard />}

      {!isLoading && cardsLeft > 0 && (
        <>
          <CardStack
            cats={cats}
            onSwipe={swiped}
            refs={childRefs.current}
          />

          <ProgressBar current={cats.length - cardsLeft} total={cats.length} />
          <Controls
            onUndo={undo}
            onRestart={() => loadCats(true)}
            canUndo={history.canUndo}
          />
        </>
      )}

      {!isLoading && cardsLeft === 0 && (
        <Result
          liked={liked}
          isRestarting={isRestarting}
          onRestart={() => loadCats(true)}
        />
      )}
    </div>
  );
}
