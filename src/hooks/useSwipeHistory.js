import { useRef, useState } from "react";

export default function useSwipeHistory() {
  const ref = useRef([]);
  const [canUndo, setCanUndo] = useState(false);

  const push = (entry) => {
    ref.current.push(entry);
    setCanUndo(true);
  };

  const pop = () => {
    const item = ref.current.pop();
    setCanUndo(ref.current.length > 0);
    return item;
  };

  const clear = () => {
    ref.current = [];
    setCanUndo(false);
  };

  return { push, pop, clear, canUndo };
}
