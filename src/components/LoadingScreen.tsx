import * as React from "react";
import { motion } from "framer-motion";
import { useScrollLock } from "../hooks/useScrollLock";
import "../loader.css";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = React.useState(0);

  useScrollLock(true);

  React.useEffect(() => {
    let dead = false;
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(p + (Math.random() * 6 + 2), 88);
      setProgress(p);
    }, 80);

    const ready = Promise.all([
      document.fonts.ready,
      new Promise<void>((r) => {
        if (document.readyState === "complete") {
          r();
          return;
        }
        window.addEventListener("load", () => r(), { once: true });
      }),
    ]);

    // Never hang on a slow font or asset: give up waiting after 2.5s.
    Promise.race([ready, new Promise((r) => setTimeout(r, 2500))]).then(() => {
      clearInterval(tick);
      if (dead) return;
      setProgress(100);
      onDone();
    });

    return () => {
      dead = true;
      clearInterval(tick);
    };
  }, [onDone]);

  return (
    <motion.div
      className="loader-root"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="loader-bar-wrap">
        <motion.div
          className="loader-bar-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      <div className="loader-label">Initializing</div>
    </motion.div>
  );
}
