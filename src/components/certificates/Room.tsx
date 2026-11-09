import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/** Mouse parallax only where there is a mouse, room to tilt, and no reduced-motion request. */
const PARALLAX_QUERY =
  "(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)";
/** Share of the remaining distance covered each frame (lerp factor). */
const EASE = 0.08;

const clampUnit = (n: number) => Math.max(-1, Math.min(1, n));

/**
 * A room seen from its doorway, built from five CSS-3D planes. `children` hang on
 * the back wall. Wall colours, depth and parallax strength are CSS variables at the
 * top of certificatesRoom.css.
 */
export default function Room({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  useRoomParallax(viewportRef, roomRef, useMediaQuery(PARALLAX_QUERY));

  return (
    <div ref={viewportRef} className="cr-viewport">
      <div ref={roomRef} className="cr-room">
        <div className="cr-plane cr-ceiling" aria-hidden="true">
          <span className="cr-lamp" />
        </div>
        <div className="cr-plane cr-floor" aria-hidden="true" />
        <div className="cr-plane cr-side cr-side-left" aria-hidden="true" />
        <div className="cr-plane cr-side cr-side-right" aria-hidden="true" />
        <div className="cr-plane cr-back">{children}</div>
      </div>
      <div className="cr-vignette" aria-hidden="true" />
    </div>
  );
}

/**
 * Tilts the room up to ±--cr-parallax degrees toward the cursor, eased with
 * requestAnimationFrame + lerp. The loop stops once settled, and only runs while
 * the room is on screen.
 */
function useRoomParallax(
  viewportRef: RefObject<HTMLDivElement | null>,
  roomRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const viewport = viewportRef.current;
    const room = roomRef.current;
    if (!enabled || !viewport || !room) return;

    const max = parseFloat(getComputedStyle(viewport).getPropertyValue("--cr-parallax")) || 4;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;
    let inView = false;

    const tick = () => {
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      const settled = Math.abs(target.x - current.x) < 0.005 && Math.abs(target.y - current.y) < 0.005;
      if (settled) Object.assign(current, target);
      room.style.setProperty("--rx", `${current.x.toFixed(3)}deg`);
      room.style.setProperty("--ry", `${current.y.toFixed(3)}deg`);
      room.style.willChange = settled ? "" : "transform";
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (!inView || e.pointerType !== "mouse") return;
      const r = viewport.getBoundingClientRect();
      const nx = clampUnit(((e.clientX - r.left) / r.width) * 2 - 1);
      const ny = clampUnit(((e.clientY - r.top) / r.height) * 2 - 1);
      target.x = ny * max;
      target.y = -nx * max;
      kick();
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) {
        target.x = 0;
        target.y = 0;
        kick();
      }
    });
    observer.observe(viewport);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      room.style.removeProperty("--rx");
      room.style.removeProperty("--ry");
      room.style.willChange = "";
    };
  }, [enabled, viewportRef, roomRef]);
}
