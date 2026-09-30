"use client";

import { RefObject, useEffect, useState } from "react";
import { getGsap } from "@/lib/gsap";

/**
 * Sticky horizontal scroll: returns the section height needed so vertical scroll maps onto the
 * track’s horizontal overflow, and scrubs the track with GSAP ScrollTrigger.
 */
export function useHorizontalScroll(
  wrap: RefObject<HTMLElement | null>,
  track: RefObject<HTMLElement | null>,
  enabled: boolean,
  onProgress?: (p: number) => void,
) {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const measure = () => {
      const t = track.current;
      if (t) setHeight(t.scrollWidth - window.innerWidth + window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [enabled, track]);

  useEffect(() => {
    if (!enabled || height === null || !track.current) return;
    const { gsap, ScrollTrigger } = getGsap();
    const t = track.current;
    ScrollTrigger.refresh();
    const tw = gsap.to(t, {
      x: () => -(t.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: wrap.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => onProgress?.(self.progress),
      },
    });
    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
      gsap.set(t, { x: 0 });
    };
  }, [enabled, height, wrap, track, onProgress]);

  return enabled ? height : null;
}
