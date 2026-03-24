import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../loader.css";

type Phase = "loading" | "ready" | "flash" | "exit";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = React.useState<Phase>("loading");
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  React.useEffect(() => {
    let dead = false;

    async function run() {
      let p = 0;
      const tick = setInterval(() => {
        if (dead) return;
        p = Math.min(p + (Math.random() * 6 + 2), 88);
        setProgress(p);
      }, 80);

      await Promise.all([
        document.fonts.ready,
        new Promise<void>((r) => {
          if (document.readyState === "complete") {
            r();
            return;
          }
          window.addEventListener("load", () => r(), { once: true });
        }),
      ]);

      clearInterval(tick);
      if (dead) return;

      setProgress(100);
      await new Promise((r) => setTimeout(r, 300));
      if (dead) return;

      setPhase("ready");
      await new Promise((r) => setTimeout(r, 220));
      if (dead) return;

      setPhase("flash");
      await new Promise((r) => setTimeout(r, 600));
      if (dead) return;

      setPhase("exit");
      await new Promise((r) => setTimeout(r, 600));
      if (dead) return;

      onDone();
    }

    run();
    return () => {
      dead = true;
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="loader"
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

          <div
            className={`loader-label${phase === "ready" || phase === "flash" ? " ready" : ""}`}
          >
            {phase === "ready" || phase === "flash" ? "Ready" : "Initializing"}
          </div>

          <motion.div
            className="loader-flash"
            animate={{ opacity: phase === "flash" ? 1 : 0 }}
            transition={{
              duration: phase === "flash" ? 0.08 : 0.55,
              ease: phase === "flash" ? "easeOut" : "easeIn",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
