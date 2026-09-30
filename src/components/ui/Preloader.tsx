"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getLenis } from "@/components/motion/SmoothScroll";

const MIN_MS = 1700;
const MAX_MS = 4200;

/** First-load curtain: brand mark and a count-up while the hero film and fonts arrive. */
export function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = "hidden";
    getLenis()?.stop();
    const t0 = performance.now();
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);
    let raf = 0;
    const tick = () => {
      const t = performance.now() - t0;
      const cap = loaded || t > MAX_MS ? 1 : 0.9;
      const eased = 1 - Math.pow(1 - Math.min(1, t / MIN_MS), 3);
      const v = Math.min(cap, eased);
      setPct(Math.round(v * 100));
      if (v >= 1) {
        setDone(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(() => {
      document.documentElement.style.overflow = "";
      getLenis()?.start();
    }, 700);
    return () => window.clearTimeout(id);
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          role="status"
          aria-label={`Loading ${pct}%`}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#10120f] text-ivory"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <Image src="/brand/mark-ivory.png" alt="" width={112} height={112} priority unoptimized className="h-20 w-20 md:h-24 md:w-24" />
          </motion.div>
          <p className="font-brand mt-8 text-sm font-semibold tracking-[0.55em] text-ivory/90">AURAQIS</p>
          <p className="label mt-3 text-ivory/45">Constructions · Interiors</p>
          <div className="absolute inset-x-[max(1.25rem,4vw)] bottom-10 flex items-end justify-between">
            <p className="label text-ivory/45">Where vision meets craftsmanship</p>
            <p className="font-sans text-5xl font-extralight tabular-nums md:text-7xl">{pct}</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-ivory/10">
            <div className="h-full bg-sage-light transition-[width] duration-150" style={{ width: `${pct}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
