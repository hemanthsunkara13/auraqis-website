"use client";

import { MotionConfig } from "motion/react";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { Preloader } from "@/components/ui/Preloader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <Preloader />
      {children}
      <Cursor />
      <div aria-hidden className="film-grain" />
    </MotionConfig>
  );
}
