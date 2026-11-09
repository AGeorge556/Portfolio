import { useEffect, useImperativeHandle, useMemo, useRef, useState, type Ref } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import Frame, { type FrameSize } from "./Frame";
import type { RoomCertificate } from "./roomData";

export type WallHandle = {
  /** Phone gallery only: scroll so certificate `index` sits centred on the wall. */
  reveal: (index: number) => void;
};

type Hung = { cert: RoomCertificate; index: number; size: FrameSize };

const MAX_PER_ROW = 8;
const GALLERY_QUERY = "(max-width: 767px)";

/**
 * Salon hang for the desktop wall, in the order given: balanced rows of up to
 * MAX_PER_ROW, program certificates large, course certificates alternating
 * between two sizes in a checkerboard so neighbouring rows don't line up.
 */
function hangRows(certs: RoomCertificate[]): Hung[][] {
  const rowCount = Math.max(1, Math.ceil(certs.length / MAX_PER_ROW));
  const perRow = Math.ceil(certs.length / rowCount);
  return Array.from({ length: rowCount }, (_, r) =>
    certs.slice(r * perRow, (r + 1) * perRow).map((cert, i) => {
      const index = r * perRow + i;
      const size: FrameSize = cert.featured ? "lg" : (i + r) % 2 === 0 ? "md" : "sm";
      return { cert, index, size };
    }),
  );
}

type WallProps = {
  certificates: RoomCertificate[];
  activeIndex: number | null;
  onOpen: (index: number) => void;
  registerFrame: (index: number, el: HTMLButtonElement | null) => void;
  ref?: Ref<WallHandle>;
};

/**
 * The frames on the back wall. Desktop: salon rows. Phones: the same frames in one
 * swipeable scroll-snap row (rows become `display: contents` in CSS), where frames
 * away from the centre turn, shrink and dim as if hung further along the wall.
 */
export default function Wall({ certificates, activeIndex, onOpen, registerFrame, ref }: WallProps) {
  const rows = useMemo(() => hangRows(certificates), [certificates]);
  const galleryRef = useRef<HTMLDivElement>(null);
  const isGallery = useMediaQuery(GALLERY_QUERY);
  const [current, setCurrent] = useState(0);
  const updateGallery = useRef<() => void>(() => {});

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!isGallery || !gallery) return;
    const pieces = () => gallery.querySelectorAll<HTMLElement>(".cr-piece");

    let raf = 0;
    // Each frame gets --d: its offset from the gallery centre in frame widths, clamped to ±1.
    const update = () => {
      raf = 0;
      const centre = gallery.scrollLeft + gallery.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      for (const el of pieces()) {
        const offset = (el.offsetLeft + el.offsetWidth / 2 - centre) / el.offsetWidth;
        const d = Math.max(-1, Math.min(1, offset));
        el.style.setProperty("--d", d.toFixed(3));
        el.style.setProperty("--ad", Math.abs(d).toFixed(3));
        if (Math.abs(offset) < best) {
          best = Math.abs(offset);
          nearest = Number(el.dataset.index);
        }
      }
      setCurrent(nearest);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    updateGallery.current = update;
    update();
    gallery.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      gallery.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      updateGallery.current = () => {};
      for (const el of pieces()) {
        el.style.removeProperty("--d");
        el.style.removeProperty("--ad");
      }
    };
  }, [isGallery]);

  useImperativeHandle(
    ref,
    () => ({
      reveal(index) {
        const gallery = galleryRef.current;
        const el = gallery?.querySelector<HTMLElement>(`[data-index="${index}"]`);
        if (!isGallery || !gallery || !el) return;
        gallery.scrollTo({ left: el.offsetLeft - (gallery.clientWidth - el.offsetWidth) / 2, behavior: "instant" });
        updateGallery.current();
      },
    }),
    [isGallery],
  );

  return (
    <>
      <div ref={galleryRef} className="cr-hang">
        {rows.map((row, r) => (
          <div className="cr-row" key={r}>
            {row.map(({ cert, index, size }) => (
              <Frame
                key={cert.id}
                cert={cert}
                index={index}
                size={size}
                active={activeIndex === index}
                onOpen={onOpen}
                registerFrame={registerFrame}
              />
            ))}
          </div>
        ))}
      </div>
      {isGallery && certificates.length > 1 && (
        <div className="cr-dots" aria-hidden="true">
          {certificates.map((cert, i) => (
            <span key={cert.id} className="cr-dot" data-on={i === current || undefined} />
          ))}
        </div>
      )}
    </>
  );
}
