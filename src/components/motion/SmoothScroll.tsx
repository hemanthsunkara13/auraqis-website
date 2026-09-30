"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getGsap } from "@/lib/gsap";

let instance: Lenis | null = null;
export const getLenis = () => instance;

/** Inertial smooth scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { gsap, ScrollTrigger } = getGsap();
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, anchors: { offset: -72 }, autoRaf: false });
    instance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) instance?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
