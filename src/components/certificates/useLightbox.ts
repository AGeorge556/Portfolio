import { useCallback, useRef, useState } from "react";

/**
 * Lightbox state for one wall: which certificate is open, plus a registry of the
 * frame buttons so the lightbox can fly in from (and back into) the right slot
 * and return focus there on close.
 */
export function useLightbox(count: number) {
  const [index, setIndex] = useState<number | null>(null);
  const frames = useRef(new Map<number, HTMLButtonElement>());

  const registerFrame = useCallback((i: number, el: HTMLButtonElement | null) => {
    if (el) frames.current.set(i, el);
    else frames.current.delete(i);
  }, []);

  const getFrame = useCallback((i: number) => frames.current.get(i) ?? null, []);

  const open = useCallback((i: number) => setIndex(i), []);

  /** Call once the close animation has finished. */
  const close = useCallback(() => setIndex(null), []);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + count) % count)),
    [count],
  );

  return { index, open, close, go, registerFrame, getFrame };
}
