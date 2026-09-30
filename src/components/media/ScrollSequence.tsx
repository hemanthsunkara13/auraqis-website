"use client";

import { useMotionValueEvent, useScroll, type MotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FrameSet } from "@/lib/media";
import { cn } from "@/lib/utils";

type Props = {
  set: FrameSet;
  label: string;
  /** Scroll length of the pinned section, in viewport heights. */
  length: number;
  /** Horizontal focal point (0–1) kept in frame when the viewport is narrower than the film. */
  focusX?: number;
  id?: string;
  className?: string;
  children?: (progress: MotionValue<number>) => React.ReactNode;
};

const STRIDES = [24, 12, 6, 3, 1];

/**
 * Scroll-scrubbed film: a pinned canvas that draws pre-extracted WebP frames for the current scroll
 * position. Frames stream in coarse-to-fine so scrubbing works early and sharpens as they arrive.
 */
export function ScrollSequence({ set, label, length, focusX = 0.5, id, className, children }: Props) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const drawn = useRef(-1);
  const target = useRef(0);
  const raf = useRef(0);
  const [loadedPct, setLoadedPct] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  const draw = useCallback(
    (force = false) => {
      const c = canvas.current;
      const list = frames.current;
      if (!c || !list.length) return;
      const want = target.current;
      let idx = -1;
      for (let d = 0; d < list.length; d++) {
        if (list[want - d]) {
          idx = want - d;
          break;
        }
        if (list[want + d]) {
          idx = want + d;
          break;
        }
      }
      if (idx < 0 || (idx === drawn.current && !force)) return;
      const img = list[idx]!;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const { width: cw, height: ch } = c;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      const x = Math.min(0, Math.max(cw - w, cw / 2 - w * focusX));
      ctx.drawImage(img, x, (ch - h) / 2, w, h);
      drawn.current = idx;
    },
    [focusX],
  );

  const schedule = useCallback(
    (force = false) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => draw(force));
    },
    [draw],
  );

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    target.current = Math.round(Math.min(1, Math.max(0, p)) * (set.count - 1));
    schedule();
  });

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      schedule(true);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    return () => ro.disconnect();
  }, [schedule]);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let cancelled = false;
    let started = false;
    frames.current = new Array(set.count).fill(null);

    const start = async () => {
      started = true;
      const dense = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2) >= 1100;
      const dir = `${set.base}/${dense ? "d" : "m"}`;
      const order: number[] = [];
      const seen = new Set<number>();
      for (const s of STRIDES)
        for (let i = 0; i < set.count; i += s)
          if (!seen.has(i)) {
            seen.add(i);
            order.push(i);
          }
      if (!seen.has(set.count - 1)) order.splice(1, 0, set.count - 1);
      let done = 0;
      const worker = async () => {
        while (order.length && !cancelled) {
          const i = order.shift()!;
          const img = new Image();
          img.decoding = "async";
          img.src = `${dir}/${String(i + 1).padStart(4, "0")}.webp`;
          try {
            await img.decode();
          } catch {
            continue;
          }
          if (cancelled) return;
          frames.current[i] = img;
          done++;
          if (done % 12 === 0 || done === set.count) setLoadedPct(Math.round((done / set.count) * 100));
          if (Math.abs(i - target.current) <= 24 || done < 4) schedule(true);
        }
      };
      await Promise.all(Array.from({ length: 6 }, worker));
    };

    const io = new IntersectionObserver(([e]) => e.isIntersecting && !started && start(), { rootMargin: "150% 0px" });
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [set, schedule]);

  return (
    <section ref={section} id={id} aria-label={label} className={cn("relative", className)} style={{ height: `${length * 100}svh` }}>
      <div className="sticky top-0 h-svh overflow-hidden bg-charcoal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${set.base}/d/0001.webp`} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: `${focusX * 100}% 50%` }} />
        <canvas ref={canvas} role="img" aria-label={label} className="absolute inset-0 h-full w-full" />
        {loadedPct < 100 && loadedPct > 0 && (
          <p className="label pointer-events-none absolute right-6 bottom-6 z-10 text-ivory/50 tabular-nums">Loading film · {loadedPct}%</p>
        )}
        {children?.(scrollYProgress)}
      </div>
    </section>
  );
}
