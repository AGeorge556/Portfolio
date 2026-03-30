import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTime,
  useTransform,
} from "framer-motion";

let _cachedClientX = -1;
let _cachedClientY = -1;
if (typeof window !== "undefined") {
  window.addEventListener(
    "mousemove",
    (e) => {
      _cachedClientX = e.clientX;
      _cachedClientY = e.clientY;
    },
    { passive: true },
  );
}

type CursorLensProps = {
  baseImage?: string;
  revealImage?: string;
  objectFit?: "cover" | "contain";
  backgroundPosition?: string;
  backgroundColor?: string;
  blobOutlineColor?: string;
  parallaxStrength?: number;
  showBackground?: boolean;
  bgBlobCount?: number;
  bgBlobSize?: number;
  bgBlobComplexity?: number;
  bgBlobSpeed?: number;
  blobStrokeWidth?: number;
  blobSize?: number;
  shapeComplexity?: number;
  roughness?: number;
  speed?: number;
  viscosity?: number;
};

function CursorLensInteractive({
  baseImage = "",
  revealImage = "",
  objectFit = "cover",
  backgroundPosition = "center",
  backgroundColor = "#1a1a2e",
  blobOutlineColor = "#4a4e69",
  parallaxStrength = 4,
  showBackground = true,
  bgBlobCount = 15,
  bgBlobSize = 80,
  bgBlobComplexity = 60,
  bgBlobSpeed = 1,
  blobStrokeWidth = 1,
  blobSize = 120,
  shapeComplexity = 0.8,
  roughness = 0,
  speed = 250,
  viscosity = 1,
}: CursorLensProps) {
  const [isHovering, setIsHovering] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const backgroundBlobs = React.useMemo(() => {
    return [...Array(bgBlobCount)].map(() => ({
      x: [
        random(-20, 110) + "%",
        random(-20, 110) + "%",
        random(-20, 110) + "%",
      ],
      y: [
        random(-20, 110) + "%",
        random(-20, 110) + "%",
        random(-20, 110) + "%",
      ],
      sizeFactor: random(0.5, 1.5),
      duration: random(25, 50) / bgBlobSpeed,
    }));
  }, [bgBlobCount, bgBlobSpeed]);

  const bgFilterId = React.useId();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXRatio = useMotionValue(0);
  const mouseYRatio = useMotionValue(0);

  const smoothOptions = { damping: 50, stiffness: 400 };
  const smoothX = useSpring(mouseXRatio, smoothOptions);
  const smoothY = useSpring(mouseYRatio, smoothOptions);

  const baseX = useTransform(
    smoothX,
    [-1, 1],
    [parallaxStrength, -parallaxStrength],
  );
  const baseY = useTransform(
    smoothY,
    [-1, 1],
    [parallaxStrength, -parallaxStrength],
  );
  const revealX = useTransform(
    smoothX,
    [-1, 1],
    [parallaxStrength * 2.5, -parallaxStrength * 2.5],
  );
  const revealY = useTransform(
    smoothY,
    [-1, 1],
    [parallaxStrength * 2.5, -parallaxStrength * 2.5],
  );

  React.useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const touch = "touches" in e ? e.touches[0] : null;
      const clientX = touch ? touch.clientX : (e as MouseEvent).clientX;
      const clientY = touch ? touch.clientY : (e as MouseEvent).clientY;

      const isInside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (isInside) {
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        mouseX.set(x);
        mouseY.set(y);
        mouseXRatio.set((x / rect.width) * 2 - 1);
        mouseYRatio.set((y / rect.height) * 2 - 1);
      } else {
        mouseXRatio.set(0);
        mouseYRatio.set(0);
      }
    };

    window.addEventListener("mousemove", handleGlobalMove);
    window.addEventListener("touchstart", handleGlobalMove);
    window.addEventListener("touchmove", handleGlobalMove);

    const handlePrime = () => {
      if (_cachedClientX < 0 || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = _cachedClientX;
      const cy = _cachedClientY;
      const inside =
        cx >= rect.left &&
        cx <= rect.right &&
        cy >= rect.top &&
        cy <= rect.bottom;
      if (inside) {
        mouseX.set(cx - rect.left);
        mouseY.set(cy - rect.top);
        mouseXRatio.set(((cx - rect.left) / rect.width) * 2 - 1);
        mouseYRatio.set(((cy - rect.top) / rect.height) * 2 - 1);
        setIsHovering(true);
      }
    };
    window.addEventListener("cursor-prime", handlePrime);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMove);
      window.removeEventListener("touchstart", handleGlobalMove);
      window.removeEventListener("touchmove", handleGlobalMove);
      window.removeEventListener("cursor-prime", handlePrime);
    };
  }, [mouseX, mouseY, mouseXRatio, mouseYRatio]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseXRatio.set(0);
    mouseYRatio.set(0);
  };

  const time = useTime();

  const useWake = (index: number) => {
    const stiffness = speed * (1 - index * 0.15);
    const damping = 20 + viscosity * index * 5;
    const mass = 0.1 + index * 0.1;
    return {
      x: useSpring(mouseX, { stiffness, damping, mass }),
      y: useSpring(mouseY, { stiffness, damping, mass }),
    };
  };

  const head = useWake(0);
  const body1 = useWake(1);
  const body2 = useWake(2);
  const tail = useWake(4);

  const complexityRadius = blobSize * shapeComplexity * 0.6;
  const sat1X = useTransform(
    time,
    (t) => head.x.get() + Math.sin(t * 0.002) * complexityRadius,
  );
  const sat1Y = useTransform(
    time,
    (t) => head.y.get() + Math.cos(t * 0.002) * complexityRadius,
  );
  const sat2X = useTransform(
    time,
    (t) => head.x.get() + Math.cos(t * 0.004) * (complexityRadius * 0.8),
  );
  const sat2Y = useTransform(
    time,
    (t) => head.y.get() + Math.sin(t * 0.004) * (complexityRadius * 0.8),
  );

  const cursorFilterId = React.useId();
  const maskId = React.useId();
  const greyBlobFilterId = React.useId();

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor,
  };

  const layerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  };

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundPosition: backgroundPosition,
    backgroundRepeat: "no-repeat",
    willChange: "transform",
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={containerStyle}
    >
      {showBackground && (
        <>
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <filter id={bgFilterId}>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.008"
                  numOctaves="3"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale={bgBlobComplexity}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
          </svg>

          <svg
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 0,
              overflow: "visible",
            }}
          >
            <g filter={`url(#${bgFilterId})`}>
              {backgroundBlobs.map((blob, i) => (
                <motion.circle
                  key={i}
                  initial={{ cx: blob.x[0], cy: blob.y[0] }}
                  animate={{ cx: blob.x, cy: blob.y }}
                  transition={{
                    duration: blob.duration,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                  r={blob.sizeFactor * bgBlobSize}
                  fill="none"
                  stroke={blobOutlineColor}
                  strokeWidth={blobStrokeWidth}
                  strokeOpacity={0.5}
                />
              ))}
            </g>
          </svg>
        </>
      )}

      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={cursorFilterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={roughness}
              xChannelSelector="R"
              yChannelSelector="G"
              result="distorted"
            />
            <feGaussianBlur in="distorted" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <defs>
          <mask id={maskId}>
            <g filter={`url(#${cursorFilterId})`}>
              <motion.g
                animate={{
                  opacity: isHovering ? 1 : 0,
                  scale: isHovering ? 1 : 0.6,
                }}
                transition={{
                  opacity: {
                    duration: isHovering ? 0.35 : 0.55,
                    ease: isHovering ? "easeOut" : "easeIn",
                  },
                  scale: {
                    duration: isHovering ? 0.4 : 0.6,
                    ease: isHovering ? "easeOut" : "easeIn",
                  },
                }}
                style={{ transformOrigin: "center" }}
              >
                <motion.circle cx={sat1X} cy={sat1Y} r={blobSize * 0.6} fill="white" />
                <motion.circle cx={sat2X} cy={sat2Y} r={blobSize * 0.5} fill="white" />
                <motion.circle cx={head.x} cy={head.y} r={blobSize * 0.7} fill="white" />
                <motion.circle cx={body1.x} cy={body1.y} r={blobSize * 0.6} fill="white" />
                <motion.circle cx={body2.x} cy={body2.y} r={blobSize * 0.5} fill="white" />
                <motion.circle cx={tail.x} cy={tail.y} r={blobSize * 0.3} fill="white" />
              </motion.g>
            </g>
          </mask>
        </defs>
      </svg>

      {baseImage && (
        <div style={{ ...layerStyle, zIndex: 10 }}>
          <motion.div
            style={{
              ...imgStyle,
              backgroundImage: `url(${baseImage})`,
              backgroundSize: objectFit,
              x: baseX,
              y: baseY,
              scale: 1.1,
            }}
          />
        </div>
      )}

      <motion.svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 15,
        }}
        animate={{ opacity: isHovering ? 0.12 : 0 }}
        transition={{ duration: isHovering ? 0.35 : 0.55 }}
      >
        <defs>
          <filter id={greyBlobFilterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={roughness} xChannelSelector="R" yChannelSelector="G" result="distorted" />
            <feGaussianBlur in="distorted" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
        <g filter={`url(#${greyBlobFilterId})`}>
          <motion.g
            animate={{ scale: isHovering ? 1 : 0.6 }}
            transition={{ scale: { duration: isHovering ? 0.4 : 0.6, ease: isHovering ? "easeOut" : "easeIn" } }}
            style={{ transformOrigin: "center" }}
          >
            <motion.circle cx={sat1X} cy={sat1Y} r={blobSize * 0.6} fill="black" />
            <motion.circle cx={sat2X} cy={sat2Y} r={blobSize * 0.5} fill="black" />
            <motion.circle cx={head.x} cy={head.y} r={blobSize * 0.7} fill="black" />
            <motion.circle cx={body1.x} cy={body1.y} r={blobSize * 0.6} fill="black" />
            <motion.circle cx={body2.x} cy={body2.y} r={blobSize * 0.5} fill="black" />
            <motion.circle cx={tail.x} cy={tail.y} r={blobSize * 0.3} fill="black" />
          </motion.g>
        </g>
      </motion.svg>

      {revealImage && (
        <motion.div
          style={{
            ...layerStyle,
            mask: `url(#${maskId})`,
            WebkitMask: `url(#${maskId})`,
            zIndex: 20,
          }}
        >
          <motion.div
            style={{
              ...imgStyle,
              backgroundImage: `url(${revealImage})`,
              backgroundSize: objectFit,
              x: revealX,
              y: revealY,
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// Lightweight hero for touch devices — shows profile directly, no cursor springs
function CursorLensMobile({
  revealImage = "",
  objectFit = "cover" as const,
  backgroundPosition = "center",
  backgroundColor = "#1a1a2e",
  blobOutlineColor = "#4a4e69",
  showBackground = true,
  bgBlobCount = 6,
  bgBlobSize = 80,
  bgBlobComplexity = 60,
  bgBlobSpeed = 1,
  blobStrokeWidth = 1,
}: CursorLensProps) {
  const filterId = React.useId();

  const blobs = React.useMemo(() => {
    const sv = (seed: number, min: number, max: number) => {
      const raw = Math.sin(seed * 9999.91) * 10000;
      return (raw - Math.floor(raw)) * (max - min) + min;
    };
    return [...Array(bgBlobCount)].map((_, i) => ({
      x: [sv(i * 7.1 + 1, -20, 110) + "%", sv(i * 7.1 + 2, -20, 110) + "%", sv(i * 7.1 + 3, -20, 110) + "%"],
      y: [sv(i * 7.1 + 4, -20, 110) + "%", sv(i * 7.1 + 5, -20, 110) + "%", sv(i * 7.1 + 6, -20, 110) + "%"],
      sizeFactor: sv(i * 7.1 + 7, 0.5, 1.5),
      duration: sv(i * 7.1 + 8, 25, 50) / bgBlobSpeed,
    }));
  }, [bgBlobCount, bgBlobSpeed]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor }}>
      {showBackground && (
        <>
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <filter id={filterId}>
                <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale={bgBlobComplexity} xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>
          <svg style={{ position: "absolute", width: "100%", height: "100%", zIndex: 0, overflow: "visible" }}>
            <g filter={`url(#${filterId})`}>
              {blobs.map((blob, i) => (
                <motion.circle
                  key={i}
                  initial={{ cx: blob.x[0], cy: blob.y[0] }}
                  animate={{ cx: blob.x, cy: blob.y }}
                  transition={{ duration: blob.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                  r={blob.sizeFactor * bgBlobSize}
                  fill="none"
                  stroke={blobOutlineColor}
                  strokeWidth={blobStrokeWidth}
                  strokeOpacity={0.5}
                />
              ))}
            </g>
          </svg>
        </>
      )}
      {revealImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${revealImage})`,
            backgroundSize: objectFit,
            backgroundPosition,
            backgroundRepeat: "no-repeat",
            zIndex: 20,
          }}
        />
      )}
    </div>
  );
}

export default function CursorLens(props: CursorLensProps) {
  const isTouchDevice = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches,
    [],
  );
  return isTouchDevice ? <CursorLensMobile {...props} /> : <CursorLensInteractive {...props} />;
}
