"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer } from "@/hooks/useMedia";

/**
 * Soft ring cursor for fine pointers. Elements with `data-cursor="Label"` expand it and show the label.
 */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 38, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 420, damping: 38, mass: 0.6 });
  const [label, setLabel] = useState<string | null>(null);
  const enabled = useFinePointer();

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(t ? t.getAttribute("data-cursor") : null);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-[150] mix-blend-difference" style={{ x: sx, y: sy }}>
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white text-white"
        animate={label ? { width: 96, height: 96, backgroundColor: "rgba(255,255,255,1)" } : { width: 28, height: 28, backgroundColor: "rgba(255,255,255,0)" }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        {label && <span className="label text-[0.6rem] text-black">{label}</span>}
      </motion.div>
    </motion.div>
  );
}
