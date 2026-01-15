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

    if (direction === "right") {
      setLiked((p) => [...p, cat]);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 600);
    }

    setCardsLeft((p) => p - 1);
  };

  const undo = async () => {
    const last = history.pop();
    if (!last) return;

    setCardsLeft((p) => p + 1);
    if (last.direction === "right") setLiked((p) => p.slice(0, -1));

    const ref = childRefs.current[last.index];
    if (!ref?.current) return;

    await ref.current.restoreCard();
  };

  const done = !isLoading && cardsLeft === 0;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 overflow-hidden">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-neutral-900 text-white grid place-items-center font-semibold">
              P
            </div>
            <div>
              <div className="text-xl font-semibold leading-tight">
                Paws & Preferences
              </div>
            </div>
          </div>
        </div>
      </header>

      {showHeart && <SwipeEffect />}

      {/* Page content */}
      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-8">
        {/* Main column */}
        <section>
          <div className="mb-6">
            <h1 className="text-3xl text-center font-semibold tracking-tight">
              Find Your Favourite Cat
            </h1>
            <p className="mt-2 text-center text-neutral-600">
              Like it? Swipe right. Not feeling it? Swipe left. You can always undo.
            </p>
          </div>

          <div>
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <LoadingCard />
              </div>
            )}

            {!isLoading && cardsLeft > 0 && (
              <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
                {/* Card */}
                <div className="w-full flex justify-center mb-4">
                  <CardStack
                    cats={cats}
                    onSwipe={swiped}
                    refs={childRefs.current}
                  />
                </div>

                {/* Progress bar */}
                <ProgressBar
                  current={cats.length - cardsLeft}
                  total={cats.length}
                />

                {/* Buttons */}
                <Controls
                  onUndo={undo}
                  onRestart={() => loadCats(true)}
                  canUndo={history.canUndo}
                />
              </div>
            )}

            {done && (
              <Result
                liked={liked}
                isRestarting={isRestarting}
                onRestart={() => loadCats(true)}
              />
            )}
          </div>
        </section>
      </div>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-600 flex flex-col sm:flex-row sm:justify-between gap-2">
          <span>© {new Date().getFullYear()} Paws & Preferences</span>
          <span>Built with React & Tailwind CSS.</span>
        </div>
      </footer>
    </div>
  );
}
