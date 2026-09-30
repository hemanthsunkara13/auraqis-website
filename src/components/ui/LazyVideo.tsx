"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  videoClassName?: string;
  /** Autoplay (muted, looped) when visible. Disabled automatically with reduced motion. */
  autoPlay?: boolean;
  controls?: boolean;
  priority?: boolean;
};

/**
 * Lazy, viewport-aware video: source is attached only when near the viewport,
 * playback pauses off-screen, and a poster frame is always shown first.
 */
export function LazyVideo({ src, poster, alt, className, videoClassName, autoPlay = true, controls = false, priority }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [load, setLoad] = useState(!!priority);
  const [playing, setPlaying] = useState(false);
  const visibleRef = useRef(false);
  const shouldAuto = autoPlay && !reduced;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: "60% 60% 60% 60%" });
    const visible = new IntersectionObserver(
      ([e]) => {
        visibleRef.current = e.isIntersecting;
        const v = video.current;
        if (!v) return;
        if (e.isIntersecting && shouldAuto && v.currentSrc) v.play().catch(() => undefined);
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.25 },
    );
    near.observe(el);
    visible.observe(el);
    return () => {
      near.disconnect();
      visible.disconnect();
    };
  }, [shouldAuto]);

  return (
    <div ref={wrap} className={cn("relative overflow-hidden bg-charcoal", className)}>
      <video
        ref={video}
        className={cn("h-full w-full object-cover", videoClassName)}
        poster={poster}
        muted
        loop
        playsInline
        preload={load ? "metadata" : "none"}
        controls={controls}
        aria-label={alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onCanPlay={(e) => {
          if (shouldAuto && visibleRef.current && e.currentTarget.paused) e.currentTarget.play().catch(() => undefined);
        }}
        src={load ? src : undefined}
      />
      {!shouldAuto && !controls && (
        <button
          type="button"
          onClick={() => {
            const v = video.current;
            if (!v) return;
            if (v.paused) v.play().catch(() => undefined);
            else v.pause();
          }}
          className="label absolute bottom-4 left-4 bg-charcoal/70 px-3 py-2 text-ivory backdrop-blur"
          aria-label={playing ? `Pause video: ${alt}` : `Play video: ${alt}`}
        >
          {playing ? "Pause" : "Play"}
        </button>
      )}
    </div>
  );
}
