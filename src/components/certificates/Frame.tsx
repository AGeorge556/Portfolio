import type { CSSProperties } from "react";
import { Maximize2 } from "lucide-react";
import { certificateAlt, type RoomCertificate } from "./roomData";

export type FrameSize = "lg" | "md" | "sm";

type FrameProps = {
  cert: RoomCertificate;
  /** Position in the wall's certificate list (lightbox order, phone-gallery order). */
  index: number;
  size: FrameSize;
  /** True while this certificate is shown in the lightbox: its slot on the wall is left empty. */
  active: boolean;
  onOpen: (index: number) => void;
  registerFrame: (index: number, el: HTMLButtonElement | null) => void;
};

/** A framed certificate: moulding, white mat, bevelled opening and a brass name plate. */
export default function Frame({ cert, index, size, active, onOpen, registerFrame }: FrameProps) {
  return (
    <button
      ref={(el) => registerFrame(index, el)}
      type="button"
      className="cr-piece"
      data-size={size}
      data-index={index}
      data-active={active || undefined}
      style={{ "--i": index } as CSSProperties}
      aria-label={`Open certificate: ${cert.title}, ${cert.issuer}`}
      onClick={() => onOpen(index)}
    >
      <span className="cr-frame">
        <span className="cr-mat">
          <span className="cr-bevel">
            <img
              src={cert.thumb}
              srcSet={`${cert.thumbSmall} 400w, ${cert.thumb} 800w`}
              sizes="(max-width: 767px) 60vw, 22vw"
              alt={certificateAlt(cert)}
              loading="lazy"
              decoding="async"
              width="800"
              height="618"
            />
          </span>
        </span>
      </span>
      <span className="cr-plate" aria-hidden="true">
        <span className="cr-plate-title">{cert.title}</span>
        <span className="cr-plate-issuer">
          {cert.issuer}
          {cert.honors && " · Honors"}
        </span>
      </span>
      <span className="cr-hint" aria-hidden="true">
        <Maximize2 size={13} /> View
      </span>
    </button>
  );
}
