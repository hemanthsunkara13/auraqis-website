"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useMedia";
import type { Film } from "@/lib/media";
import { cn } from "@/lib/utils";

type Props = {
  film: Film;
  label: string;
  className?: string;
  videoClassName?: string;
  /** Start loading immediately (above-the-fold films). */
  priority?: boolean;
  loop?: boolean;
  /** Called once the first frame is decoded and playing. */
  onReady?: () => void;
};

/**
 * Full-bleed cinematic film: picks the 1080p or 720p encode for the viewport, loads near the
 * viewport, plays muted/inline while visible, and cross-fades in over its poster once playing.
 */
export function CinemaVideo({ film, label, className, videoClassName, priority, loop = true, onReady }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [src, setSrc] = useState<string | undefined>();
  const [ready, setReady] = useState(false);
  const visible = useRef(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const pick = () => (film.mobile && Math.min(window.innerWidth, window.innerHeight * 1.78) < 900 ? film.mobile : film.src);
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setSrc((s) => s ?? pick()), { rootMargin: "80% 0px" });
    const seen = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        const v = video.current;
        if (!v) return;
        if (e.isIntersecting && !reduced) v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.05 },
    );
    near.observe(el);
    seen.observe(el);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, [film, reduced]);

  return (
    <div ref={wrap} className={cn("relative overflow-hidden bg-charcoal", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={film.poster} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" fetchPriority={priority ? "high" : "auto"} loading={priority ? "eager" : "lazy"} />
      <video
        ref={video}
        className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-[1.4s] ease-(--ease-out-soft)", ready ? "opacity-100" : "opacity-0", videoClassName)}
        src={src}
        muted
        loop={loop}
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-label={label}
        onCanPlay={(e) => {
          if (visible.current && !reduced) e.currentTarget.play().catch(() => undefined);
        }}
        onPlaying={() => {
          if (!ready) {
            setReady(true);
            onReady?.();
          }
        }}
      />
    </div>
  );
}
