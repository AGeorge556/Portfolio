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
 * Static filtered circles rasterised once, then drifted with a CSS transform so
 * the turbulence/displacement output stays a cached compositor layer.
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
  const filterId = React.useId();

  const blobs = React.useMemo(
    () =>
      [...Array(blobCount)].map((_, i) => ({
        cx: seededValue(i * 7.1 + 1, -20, 110) + "%",
        cy: seededValue(i * 7.1 + 4, -20, 110) + "%",
        r: seededValue(i * 7.1 + 7, 0.5, 1.5) * blobSize,
      })),
    [blobCount, blobSize],
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={blobComplexity}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="blob-drift"
        style={{
          position: "absolute",
          inset: "-10%",
          animationDuration: `${60 / blobSpeed}s`,
        }}
      >
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          <g filter={`url(#${filterId})`}>
            {blobs.map((blob, i) => (
              <circle
                key={i}
                cx={blob.cx}
                cy={blob.cy}
                r={blob.r}
                fill="none"
                stroke={blobColor}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
