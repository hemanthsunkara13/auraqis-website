"use client";

import { useCallback, useSyncExternalStore } from "react";

const noopSubscribe = () => () => undefined;

function useMediaQuery(query: string, initial = false) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => initial,
  );
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

export function useFinePointer() {
  return useMediaQuery("(pointer: fine) and (prefers-reduced-motion: no-preference)");
}

export type DeviceTier = "high" | "low";

let lowCaps: boolean | undefined;
function hasLowCaps() {
  if (lowCaps === undefined) {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowCpu = (nav.hardwareConcurrency ?? 8) <= 4;
    const lowMem = (nav.deviceMemory ?? 8) <= 4;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    lowCaps = coarse || lowCpu || lowMem;
  }
  return lowCaps;
}

/** Coarse GPU/CPU tier used to scale 3D quality (shadows, post-processing, DPR). */
export function useDeviceTier(): DeviceTier {
  const mobile = useIsMobile();
  const low = useSyncExternalStore(noopSubscribe, hasLowCaps, () => false);
  return mobile || low ? "low" : "high";
}

let webgl: boolean | undefined;
function detectWebGL() {
  if (webgl === undefined) {
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

export function useWebGLAvailable(): boolean | null {
  return useSyncExternalStore(noopSubscribe, detectWebGL, () => null);
}
