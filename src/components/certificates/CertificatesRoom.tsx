import "./certificatesRoom.css";
import { useCallback, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import Lightbox from "./Lightbox";
import Room from "./Room";
import Wall, { type WallHandle } from "./Wall";
import { walls } from "./roomData";
import { useLightbox } from "./useLightbox";

/**
 * Certificates Room: one wall per program, picked with the buttons above the room.
 * Certificates come from `certifications` in src/data.ts.
 */
export default function CertificatesRoom() {
  const [wallId, setWallId] = useState(walls[0].id);
  const wall = walls.find((w) => w.id === wallId) ?? walls[0];
  const { index, open, close, go, registerFrame, getFrame } = useLightbox(wall.certificates.length);
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
      <div className="cr-walls" role="group" aria-label="Certificate walls">
        {walls.map((w) => (
          <button
            key={w.id}
            type="button"
            className="cr-wall-tab"
            aria-pressed={w.id === wallId}
            onClick={() => setWallId(w.id)}
          >
            {w.label}
            <span className="cr-wall-count">{w.certificates.length}</span>
          </button>
        ))}
      </div>

      <p className="cr-wall-caption">
        {wall.program} · {wall.issuer}
        {wall.credentialUrl && (
          <a href={wall.credentialUrl} target="_blank" rel="noopener noreferrer">
            Verify credential <ExternalLink size={13} aria-hidden="true" />
          </a>
        )}
      </p>

      <Room>
        <Wall
          key={wall.id}
          ref={wallRef}
          wall={wall}
          activeIndex={index}
          onOpen={open}
          registerFrame={registerFrame}
        />
      </Room>

      <p className="cr-help">
        <span className="cr-help-wide">Click a certificate to see it full size.</span>
        <span className="cr-help-narrow">Swipe along the wall, tap a certificate to enlarge it.</span>
      </p>

      {index !== null && (
        <Lightbox
          items={wall.certificates}
          index={index}
          getSourceImage={getSourceImage}
          onNavigate={go}
          onClosed={handleClosed}
        />
      )}
    </div>
  );
}
