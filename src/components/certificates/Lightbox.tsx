import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useScrollLock } from "../../hooks/useScrollLock";
import { CERT_ASPECT, certificateAlt, type RoomCertificate } from "./roomData";
import { useStageGestures, type Box } from "./useStageGestures";

type Phase = "opening" | "open" | "closing";

type LightboxProps = {
  items: RoomCertificate[];
  index: number;
  /** The certificate's image on the wall (revealed first if the phone gallery has it off-screen). */
  getSourceImage: (index: number) => HTMLImageElement | null;
  onNavigate: (delta: number) => void;
  /** Called once the close animation has finished. */
  onClosed: (index: number) => void;
};

const FLIGHT: KeyframeAnimationOptions = { duration: 460, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" };
const FADE: KeyframeAnimationOptions = { duration: 220, easing: "ease-out" };
/** Above this many device pixels across, the 800px thumbnail gives way to the 1600px image. */
const THUMB_WIDTH = 800;

/** FLIP: the transform that puts an image resting at `to` exactly over `from`. */
const flipFrom = (from: DOMRect, to: Box) =>
  `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;

const visibleRect = (el: Element | null) => {
  const r = el?.getBoundingClientRect();
  return r && r.width > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth ? r : null;
};

function trapFocus(e: KeyboardEvent, root: HTMLElement | null) {
  const focusable = root ? [...root.querySelectorAll<HTMLElement>("button, a[href]")] : [];
  if (!root || focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!root.contains(document.activeElement)) {
    e.preventDefault();
    first.focus();
  } else if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/**
 * Full-screen certificate viewer. Opening flies the certificate out of its frame
 * (FLIP) to the largest size that fits; closing flies it back into the frame of
 * whichever certificate is showing. Reduced motion swaps the flight for a fade.
 */
export default function Lightbox({ items, index, getSourceImage, onNavigate, onClosed }: LightboxProps) {
  const item = items[index];
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fitRef = useRef<Box | null>(null);
  const phaseRef = useRef<Phase>("opening");
  const indexRef = useRef(index);
  const navDirection = useRef(0);
  const [fit, setFit] = useState<Box | null>(null);
  const [phase, setPhase] = useState<Phase>("opening");
  const [zoomed, setZoomed] = useState(false);
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set());

  useScrollLock(true);

  const changePhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  /** Where the image rests (before any gesture), in viewport pixels. */
  const restingBox = useCallback((): Box | null => {
    const stage = stageRef.current?.getBoundingClientRect();
    const f = fitRef.current;
    return stage && f ? { left: stage.left + f.left, top: stage.top + f.top, width: f.width, height: f.height } : null;
  }, []);

  const requestClose = useCallback(() => {
    const img = imgRef.current;
    const backdrop = backdropRef.current;
    if (phaseRef.current === "closing" || !img || !backdrop) return;
    changePhase("closing");

    const shown = indexRef.current;
    const from = getComputedStyle(img).transform;
    const fromOpacity = getComputedStyle(backdrop).opacity;
    img.getAnimations().forEach((a) => a.cancel());
    img.style.transition = "";
    img.style.willChange = "transform, opacity";

    const source = visibleRect(getSourceImage(shown));
    const box = restingBox();
    const flight =
      source && box && !reducedMotion
        ? img.animate([{ transform: from }, { transform: flipFrom(source, box) }], { ...FLIGHT, duration: 380, fill: "forwards" })
        : img.animate([{ opacity: 1 }, { opacity: 0 }], { ...FADE, fill: "forwards" });
    backdrop.animate([{ opacity: fromOpacity }, { opacity: 0 }], { duration: 300, easing: "ease-in", fill: "forwards" });
    flight.finished.then(
      () => onClosed(shown),
      () => onClosed(shown),
    );
  }, [changePhase, getSourceImage, onClosed, reducedMotion, restingBox]);

  const navigate = useCallback(
    (delta: number) => {
      if (phaseRef.current === "closing") return;
      navDirection.current = delta;
      onNavigate(delta);
    },
    [onNavigate],
  );

  const gestures = useStageGestures({
    imgRef,
    backdropRef,
    getBox: restingBox,
    canSwipe: items.length > 1,
    disabled: phase !== "open",
    onSwipe: navigate,
    onDismiss: requestClose,
    onZoomChange: setZoomed,
  });

  // Contain-fit the certificate in the stage; refit on resize and rotation.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const { width, height } = stage.getBoundingClientRect();
      const w = Math.max(0, Math.min(width, height * CERT_ASPECT));
      const h = w / CERT_ASPECT;
      fitRef.current = { left: (width - w) / 2, top: (height - h) / 2, width: w, height: h };
      setFit(fitRef.current);
    };
    measure();
    const observer = new ResizeObserver(() => {
      measure();
      gestures.reset();
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [gestures]);

  // Fly in from the frame once the resting box is known.
  const flewIn = useRef(false);
  useLayoutEffect(() => {
    const img = imgRef.current;
    const backdrop = backdropRef.current;
    const box = restingBox();
    if (flewIn.current || !fit || !img || !backdrop || !box) return;
    flewIn.current = true;

    const source = visibleRect(getSourceImage(index));
    img.style.willChange = "transform, opacity";
    const flight =
      source && !reducedMotion
        ? img.animate([{ transform: flipFrom(source, box) }, { transform: "none" }], FLIGHT)
        : img.animate([{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }], FADE);
    backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out" });
    flight.finished.then(
      () => {
        img.style.willChange = "";
        if (phaseRef.current === "opening") changePhase("open");
      },
      () => {}, // AbortError only: closing started mid-flight and requestClose took over the image
    );
  }, [changePhase, fit, getSourceImage, index, reducedMotion, restingBox]);

  // A new certificate slides in from the side it came from.
  useLayoutEffect(() => {
    if (indexRef.current === index) return;
    indexRef.current = index;
    gestures.reset();
    const img = imgRef.current;
    if (!img || reducedMotion) return;
    img.animate(
      [
        { opacity: 0, transform: `translateX(${navDirection.current * 56}px)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: 260, easing: FLIGHT.easing },
    );
  }, [gestures, index, reducedMotion]);

  // Small screens keep the 800px image until the visitor zooms in.
  const wantsFullRes = zoomed || (fit !== null && fit.width * window.devicePixelRatio > THUMB_WIDTH);
  useEffect(() => {
    if (!wantsFullRes || loaded.has(item.image)) return;
    let alive = true;
    const full = new Image();
    full.src = item.image;
    full.decode().then(
      () => alive && setLoaded((s) => new Set(s).add(item.image)),
      () => {}, // decode failed: the 800px thumbnail stays on screen
    );
    return () => {
      alive = false;
    };
  }, [item.image, loaded, wantsFullRes]);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      } else if (e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "ArrowRight") navigate(1);
      else if (e.key === "Tab") trapFocus(e, rootRef.current);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate, requestClose]);

  return createPortal(
    <div ref={rootRef} className="cr-lb" role="dialog" aria-modal="true" aria-labelledby={titleId} data-phase={phase}>
      <div ref={backdropRef} className="cr-lb-backdrop" onClick={requestClose} />

      <div ref={stageRef} className="cr-lb-stage" {...gestures.handlers}>
        {fit && (
          <img
            ref={imgRef}
            className="cr-lb-img"
            src={loaded.has(item.image) ? item.image : item.thumb}
            alt={certificateAlt(item)}
            draggable={false}
            style={{ left: fit.left, top: fit.top, width: fit.width, height: fit.height }}
          />
        )}
      </div>

      <p className="cr-lb-counter cr-lb-ui">
        {index + 1} / {items.length}
      </p>
      <button ref={closeRef} type="button" className="cr-lb-btn cr-lb-close cr-lb-ui" onClick={requestClose} aria-label="Close certificate">
        <X size={22} aria-hidden="true" />
      </button>
      {items.length > 1 && (
        <>
          <button type="button" className="cr-lb-btn cr-lb-nav cr-lb-prev cr-lb-ui" onClick={() => navigate(-1)} aria-label="Previous certificate">
            <ChevronLeft size={26} aria-hidden="true" />
          </button>
          <button type="button" className="cr-lb-btn cr-lb-nav cr-lb-next cr-lb-ui" onClick={() => navigate(1)} aria-label="Next certificate">
            <ChevronRight size={26} aria-hidden="true" />
          </button>
        </>
      )}

      <div className="cr-lb-caption cr-lb-ui">
        <h2 id={titleId} className="cr-lb-title">
          {item.title}
        </h2>
        <p className="cr-lb-meta">
          {item.issuer} · {item.date}
          {item.honors && " · Honors"}
        </p>
        {item.credentialUrl && (
          <a className="cr-lb-verify" href={item.credentialUrl} target="_blank" rel="noopener noreferrer">
            Verify credential <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}
      </div>
    </div>,
    document.body,
  );
}
