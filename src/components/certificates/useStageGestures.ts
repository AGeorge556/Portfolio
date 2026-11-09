import { useLayoutEffect, useRef, useState, type PointerEvent, type RefObject } from "react";

/** A rectangle in viewport pixels. */
export type Box = { left: number; top: number; width: number; height: number };

type Options = {
  imgRef: RefObject<HTMLImageElement | null>;
  backdropRef: RefObject<HTMLElement | null>;
  /** The image's resting box (no gesture transform applied), in viewport pixels. */
  getBox: () => Box | null;
  canSwipe: boolean;
  disabled: boolean;
  onSwipe: (delta: 1 | -1) => void;
  onDismiss: () => void;
  onZoomChange: (zoomed: boolean) => void;
};

type Point = { x: number; y: number };
type Mode = "idle" | "pending" | "swipe" | "dismiss" | "pan" | "pinch" | "ignore";

const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const DOUBLE_TAP_MS = 300;
const DRAG_SLOP = 10;
const SETTLE_TRANSFORM = "transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1)";
const SETTLE_OPACITY = "opacity 240ms ease";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a: Point, b: Point) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/**
 * Touch and mouse gestures for the lightbox stage, driven by pointer events:
 * swipe left/right to change certificate, drag down to close (the backdrop fades
 * as you drag), pinch or double-tap to zoom, pan while zoomed, and tap outside
 * the image to close. The image transform is written straight to the element
 * (no React state per frame) with transform-origin 0 0: translate(x, y) scale(s).
 */
export function useStageGestures(options: Options) {
  const opts = useRef(options);
  useLayoutEffect(() => {
    opts.current = options;
  });
  const [controller] = useState(() => createController(opts));
  return controller;
}

function createController(opts: RefObject<Options>) {
  const view = { x: 0, y: 0, scale: 1 };
  const pointers = new Map<number, Point>();
  const gesture = { mode: "idle" as Mode, start: { x: 0, y: 0 }, startTime: 0, origin: { x: 0, y: 0 }, startDist: 1, startScale: 1, anchor: { x: 0, y: 0 } };
  const lastTap = { time: 0, x: 0, y: 0 };

  const writeTransform = (x: number, y: number, scale: number, transition: string) => {
    const img = opts.current.imgRef.current;
    Object.assign(view, { x, y, scale });
    if (!img) return;
    img.style.transition = transition;
    img.style.transform = x === 0 && y === 0 && scale === 1 ? "" : `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };
  /** Follow the finger exactly. */
  const paint = (x: number, y: number, scale: number) => writeTransform(x, y, scale, "");
  /** Ease to a resting position. */
  const settle = (x: number, y: number, scale: number) => writeTransform(x, y, scale, SETTLE_TRANSFORM);

  const dimBackdrop = (opacity: number) => {
    const el = opts.current.backdropRef.current;
    if (!el) return;
    el.style.transition = "";
    el.style.opacity = String(opacity);
  };
  const restoreBackdrop = () => {
    const el = opts.current.backdropRef.current;
    if (!el) return;
    el.style.transition = SETTLE_OPACITY;
    el.style.opacity = "";
  };

  /** Keep a zoomed image covering at least its own resting box. */
  const clampPan = (x: number, y: number, scale: number, box: Box) => ({
    x: clamp(x, box.width * (1 - scale), 0),
    y: clamp(y, box.height * (1 - scale), 0),
  });

  const local = (p: Point, box: Box) => ({ x: p.x - box.left, y: p.y - box.top });

  const settleZoom = () => {
    if (view.scale < 1.05) {
      settle(0, 0, 1);
      opts.current.onZoomChange(false);
    } else {
      opts.current.onZoomChange(true);
    }
  };

  const startSingle = (p: Point) => {
    Object.assign(gesture, {
      mode: view.scale > 1.01 ? "pan" : "pending",
      start: p,
      startTime: performance.now(),
      origin: { x: view.x, y: view.y },
    });
  };

  const startPinch = () => {
    const box = opts.current.getBox();
    if (!box) return;
    const [a, b] = [...pointers.values()];
    const mid = local(midpoint(a, b), box);
    Object.assign(gesture, {
      mode: "pinch",
      startDist: distance(a, b) || 1,
      startScale: view.scale,
      // The image point under the fingers' midpoint; it stays under them while pinching.
      anchor: { x: (mid.x - view.x) / view.scale, y: (mid.y - view.y) / view.scale },
    });
  };

  const toggleZoom = (p: Point, box: Box) => {
    if (view.scale > 1.01) {
      settle(0, 0, 1);
      opts.current.onZoomChange(false);
      return;
    }
    const tap = local(p, box);
    const offset = clampPan(tap.x - DOUBLE_TAP_SCALE * tap.x, tap.y - DOUBLE_TAP_SCALE * tap.y, DOUBLE_TAP_SCALE, box);
    settle(offset.x, offset.y, DOUBLE_TAP_SCALE);
    opts.current.onZoomChange(true);
  };

  const onTap = (p: Point, box: Box) => {
    const r = opts.current.imgRef.current?.getBoundingClientRect();
    const onImage = r && p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom;
    if (!onImage) {
      opts.current.onDismiss();
      return;
    }
    const now = performance.now();
    if (now - lastTap.time < DOUBLE_TAP_MS && Math.hypot(p.x - lastTap.x, p.y - lastTap.y) < 30) {
      lastTap.time = 0;
      toggleZoom(p, box);
    } else {
      Object.assign(lastTap, { time: now, ...p });
    }
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (opts.current.disabled || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) startPinch();
    else if (pointers.size === 1) startSingle({ x: e.clientX, y: e.clientY });
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!pointers.has(e.pointerId)) return;
    const p = { x: e.clientX, y: e.clientY };
    pointers.set(e.pointerId, p);
    const box = opts.current.getBox();
    if (!box) return;
    const dx = p.x - gesture.start.x;
    const dy = p.y - gesture.start.y;

    switch (gesture.mode) {
      case "pinch": {
        const [a, b] = [...pointers.values()];
        const scale = clamp((gesture.startScale * distance(a, b)) / gesture.startDist, 1, MAX_SCALE);
        const mid = local(midpoint(a, b), box);
        const offset = clampPan(mid.x - scale * gesture.anchor.x, mid.y - scale * gesture.anchor.y, scale, box);
        paint(offset.x, offset.y, scale);
        return;
      }
      case "pan": {
        const offset = clampPan(gesture.origin.x + dx, gesture.origin.y + dy, view.scale, box);
        paint(offset.x, offset.y, view.scale);
        return;
      }
      case "pending":
        if (Math.hypot(dx, dy) < DRAG_SLOP) return;
        if (Math.abs(dx) > Math.abs(dy)) gesture.mode = opts.current.canSwipe ? "swipe" : "ignore";
        else gesture.mode = dy > 0 ? "dismiss" : "ignore";
        return;
      case "swipe":
        paint(dx, 0, 1);
        return;
      case "dismiss": {
        // The image follows the finger and shrinks a little; the backdrop fades.
        const down = Math.max(0, dy);
        const shrink = 1 - Math.min(down / box.height, 1) * 0.3;
        paint(dx * 0.35 + (box.width * (1 - shrink)) / 2, down + (box.height * (1 - shrink)) / 2, shrink);
        dimBackdrop(1 - Math.min(down / 320, 1) * 0.9);
        return;
      }
    }
  };

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    const box = opts.current.getBox();
    if (!box) return;
    const p = { x: e.clientX, y: e.clientY };
    const dx = p.x - gesture.start.x;
    const dy = p.y - gesture.start.y;
    const ms = Math.max(1, performance.now() - gesture.startTime);

    switch (gesture.mode) {
      case "pinch": {
        settleZoom();
        const [rest] = [...pointers.values()];
        if (rest) {
          startSingle(rest);
          // Lifting one finger of a pinch must never turn into a swipe or a dismiss.
          if (view.scale <= 1.01) gesture.mode = "ignore";
        }
        break;
      }
      case "swipe":
        if (Math.abs(dx) > box.width * 0.18 || Math.abs(dx) / ms > 0.45) opts.current.onSwipe(dx < 0 ? 1 : -1);
        else settle(0, 0, 1);
        break;
      case "dismiss":
        if (dy > 110 || dy / ms > 0.5) {
          opts.current.onDismiss();
        } else {
          settle(0, 0, 1);
          restoreBackdrop();
        }
        break;
      case "pending":
        onTap(p, box);
        break;
    }
    if (pointers.size === 0) gesture.mode = "idle";
  };

  const onPointerCancel = (e: PointerEvent<HTMLElement>) => {
    pointers.delete(e.pointerId);
    if (pointers.size > 0) {
      if (gesture.mode === "pinch") gesture.mode = "ignore"; // a pinch needs both fingers
      return;
    }
    gesture.mode = "idle";
    if (view.scale <= 1.01) settle(0, 0, 1);
    restoreBackdrop();
  };

  /** Back to the resting state (new certificate, resize, rotation). */
  const reset = () => {
    pointers.clear();
    gesture.mode = "idle";
    paint(0, 0, 1);
    restoreBackdrop();
    opts.current.onZoomChange(false);
  };

  return { reset, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel } };
}
