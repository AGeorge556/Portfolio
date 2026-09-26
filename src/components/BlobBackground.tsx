import * as React from "react";

type BlobBackgroundProps = {
  backgroundColor: string;
  blobColor: string;
  blobCount?: number;
  blobSize?: number;
  blobComplexity?: number;
  blobSpeed?: number;
  strokeWidth?: number;
  strokeOpacity?: number;
};

const seededValue = (seed: number, min: number, max: number) => {
  const raw = Math.sin(seed * 9999.91) * 10000;
  return (raw - Math.floor(raw)) * (max - min) + min;
};

/**
 * Warped outline circles that wander between three seeded points and slowly turn.
 * Each outline is its own small SVG whose displacement filter is rasterised once;
 * the movement is a Web Animations transform, so it runs on the compositor instead
 * of re-running the filter every frame (that cost ~10x more and dropped frames).
 */
export default function BlobBackground({
  backgroundColor,
  blobColor,
  blobCount = 10,
  blobSize = 280,
  blobComplexity = 160,
  blobSpeed = 0.7,
  strokeWidth = 1.5,
  strokeOpacity = 0.45,
}: BlobBackgroundProps) {
  const idPrefix = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const blobRefs = React.useRef<(SVGSVGElement | null)[]>([]);

  const blobs = React.useMemo(() => {
    // Displacement can push the outline up to half the scale outward; keep it inside the box.
    const margin = blobComplexity / 2 + strokeWidth;
    return [...Array(blobCount)].map((_, i) => {
      const r = seededValue(i * 7.1 + 7, 0.5, 1.5) * blobSize;
      return {
        x: [1, 2, 3].map((k) => seededValue(i * 7.1 + k, -20, 110) / 100),
        y: [4, 5, 6].map((k) => seededValue(i * 7.1 + k, -20, 110) / 100),
        r,
        box: 2 * (r + margin),
        duration: (seededValue(i * 7.1 + 8, 25, 50) / blobSpeed) * 1000,
        turn: seededValue(i * 7.1 + 9, -50, 50),
      };
    });
  }, [blobCount, blobSize, blobComplexity, blobSpeed, strokeWidth]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animations: Animation[] = [];
    let onScreen = true;

    // Offsets are in px from the first waypoint (where the blob is laid out), so they
    // are rebuilt whenever the container resizes.
    const animate = () => {
      animations.forEach((animation) => animation.cancel());
      const { width, height } = root.getBoundingClientRect();
      animations = blobs.map((blob, i) =>
        blobRefs.current[i]!.animate(
          blob.x.map((x, k) => ({
            transform: `translate(${(x - blob.x[0]) * width}px, ${(blob.y[k] - blob.y[0]) * height}px) rotate(${blob.turn * k}deg)`,
            easing: "ease-in-out",
          })),
          { duration: blob.duration, iterations: Infinity, direction: "alternate" },
        ),
      );
      if (!onScreen) animations.forEach((animation) => animation.pause());
    };

    const resizeObserver = new ResizeObserver(animate);
    resizeObserver.observe(root);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      animations.forEach((animation) => (onScreen ? animation.play() : animation.pause()));
    });
    visibilityObserver.observe(root);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [blobs]);

  return (
    <div
      ref={rootRef}
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {blobs.map((blob, i) => {
        const filterId = `${idPrefix}-${i}`;
        return (
          <svg
            key={i}
            ref={(el) => {
              blobRefs.current[i] = el;
            }}
            width={blob.box}
            height={blob.box}
            style={{
              position: "absolute",
              left: `${blob.x[0] * 100}%`,
              top: `${blob.y[0] * 100}%`,
              margin: -blob.box / 2,
            }}
          >
            <filter id={filterId} filterUnits="userSpaceOnUse" x="0" y="0" width={blob.box} height={blob.box}>
              {/* A seed per blob, since each samples the noise in its own local coordinates */}
              <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" seed={i} result="noise" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={blobComplexity}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <circle
              cx={blob.box / 2}
              cy={blob.box / 2}
              r={blob.r}
              filter={`url(#${filterId})`}
              fill="none"
              stroke={blobColor}
              strokeWidth={strokeWidth}
              strokeOpacity={strokeOpacity}
            />
          </svg>
        );
      })}
    </div>
  );
}
