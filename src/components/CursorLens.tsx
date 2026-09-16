import * as React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import BlobBackground from "./BlobBackground";

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
  const isHoveringRef = React.useRef(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

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
        isHoveringRef.current = true;
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

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    setIsHovering(false);
    mouseXRatio.set(0);
    mouseYRatio.set(0);
  };

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
  const sat1X = useMotionValue(0);
  const sat1Y = useMotionValue(0);
  const sat2X = useMotionValue(0);
  const sat2Y = useMotionValue(0);

  useAnimationFrame((t) => {
    if (!isHoveringRef.current) return;
    const hx = head.x.get();
    const hy = head.y.get();
    sat1X.set(hx + Math.sin(t * 0.002) * complexityRadius);
    sat1Y.set(hy + Math.cos(t * 0.002) * complexityRadius);
    sat2X.set(hx + Math.cos(t * 0.004) * complexityRadius * 0.8);
    sat2Y.set(hy + Math.sin(t * 0.004) * complexityRadius * 0.8);
  });

  const cursorFilterId = React.useId();
  const maskId = React.useId();

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
        <BlobBackground
          backgroundColor={backgroundColor}
          blobColor={blobOutlineColor}
          blobCount={bgBlobCount}
          blobSize={bgBlobSize}
          blobComplexity={bgBlobComplexity}
          blobSpeed={bgBlobSpeed}
          strokeWidth={blobStrokeWidth}
          strokeOpacity={0.5}
        />
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
            <feGaussianBlur in="distorted" stdDeviation="8" result="blur" />
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
  baseImage = "",
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
  const image = baseImage || revealImage;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor }}>
      {showBackground && (
        <BlobBackground
          backgroundColor={backgroundColor}
          blobColor={blobOutlineColor}
          blobCount={bgBlobCount}
          blobSize={bgBlobSize}
          blobComplexity={bgBlobComplexity}
          blobSpeed={bgBlobSpeed}
          strokeWidth={blobStrokeWidth}
          strokeOpacity={0.5}
        />
      )}
      {image && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${image})`,
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
