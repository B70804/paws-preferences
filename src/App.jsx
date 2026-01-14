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

          {/* <nav className="hidden sm:flex items-center gap-6 text-sm text-neutral-600">
            <a className="hover:text-neutral-900" href="#deck">Deck</a>
            <a className="hover:text-neutral-900" href="#liked">Liked</a>
            <a className="hover:text-neutral-900" href="#about">About</a>
          </nav> */}
        </div>
      </header>

      {showHeart && <SwipeEffect />}

      {/* Page content */}
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-8">
        {/* Main column */}
        <section>
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">
              Find Your Favourite Cat
            </h1>
            <p className="mt-2 text-neutral-600 max-w-2xl">
              Swipe right to like. Swipe left to skip. Use undo if you changed
              your mind.
            </p>
          </div>

          <div>
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <LoadingCard />
              </div>
            )}

            {!isLoading && cardsLeft > 0 && (
              <div className="grid gap-6 lg:grid-cols-[460px_1fr] items-start">
                {/* LEFT: Deck */}
                <div className="lg:sticky lg:top-24">
                  <div className="flex justify-center lg:justify-start">
                    <CardStack
                      cats={cats}
                      onSwipe={swiped}
                      refs={childRefs.current}
                    />
                  </div>
                </div>

                {/* RIGHT: Panels */}
                <div className="space-y-4">
                  <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                    <div className="text-sm text-neutral-600">Progress</div>
                    <div className="mt-2">
                      <ProgressBar
                        current={cats.length - cardsLeft}
                        total={cats.length}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                    <div className="text-sm text-neutral-600">Actions</div>
                    <Controls
                      onUndo={undo}
                      onRestart={() => loadCats(true)}
                      canUndo={history.canUndo}
                    />
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                    <div className="text-sm font-medium">Liked so far</div>
                    <div className="mt-2 text-2xl font-semibold">
                      {liked.length}
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">
                      You'll see a gallery after all cats.
                    </div>
                  </div>
                </div>
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

        {/* Sidebar
        <aside className="space-y-6">
          <div id="liked" className="rounded-xl border border-neutral-200 bg-white shadow-sm p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">Liked</h2>
              <span className="text-xs text-neutral-500">{liked.length} total</span>
            </div>

            {liked.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-600">
                No likes yet — swipe right on a cat to add it here.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {liked.slice().reverse().slice(0, 9).map((cat) => (
                  <img
                    key={cat}
                    src={cat}
                    alt="Liked cat"
                    className="aspect-square w-full rounded-md object-cover border border-neutral-200"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>

          <div id="about" className="rounded-xl border border-neutral-200 bg-white shadow-sm p-5">
            <h2 className="font-semibold">About</h2>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
              This is a single-page web application built with React. It fetches random cat images
              and lets you like/skip with swipe gestures.
            </p>

            <ul className="mt-4 text-sm text-neutral-700 list-disc pl-5 space-y-1">
              <li>Swipe right = like</li>
              <li>Swipe left = skip</li>
              <li>Undo restores the last swiped card</li>
            </ul>

            <div className="mt-4 text-xs text-neutral-500">
              Images from Cataas.
            </div>
          </div>
        </aside> */}
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
