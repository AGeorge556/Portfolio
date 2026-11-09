import "./certificatesRoom.css";
import { useCallback, useRef, useState } from "react";
import Lightbox from "./Lightbox";
import Room from "./Room";
import Wall, { type WallHandle } from "./Wall";
import { certificates, type RoomCertificate } from "./roomData";
import { useLightbox } from "./useLightbox";

/** Fisher–Yates shuffle into a new array. */
function shuffled(items: readonly RoomCertificate[]): RoomCertificate[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Certificates Room: every certificate on one wall, hung in a fresh random order
 * on each visit. Certificates come from `certifications` in src/data.ts.
 */
export default function CertificatesRoom() {
  const [hung] = useState(() => shuffled(certificates));
  const { index, open, close, go, registerFrame, getFrame } = useLightbox(hung.length);
  const wallRef = useRef<WallHandle>(null);

  const getSourceImage = useCallback(
    (i: number) => {
      wallRef.current?.reveal(i);
      return getFrame(i)?.querySelector("img") ?? null;
    },
    [getFrame],
  );

  const handleClosed = useCallback(
    (i: number) => {
      close();
      getFrame(i)?.focus({ preventScroll: true });
    },
    [close, getFrame],
  );

  return (
    <div className="cr">
      <Room>
        <Wall ref={wallRef} certificates={hung} activeIndex={index} onOpen={open} registerFrame={registerFrame} />
      </Room>

      <p className="cr-help">
        <span className="cr-help-wide">Click a certificate to see it full size.</span>
        <span className="cr-help-narrow">Swipe along the wall, tap a certificate to enlarge it.</span>
      </p>

      {index !== null && (
        <Lightbox
          items={hung}
          index={index}
          getSourceImage={getSourceImage}
          onNavigate={go}
          onClosed={handleClosed}
        />
      )}
    </div>
  );
}
