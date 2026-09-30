"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import Image from "next/image";
import { useCallback, useRef } from "react";
import { CinemaVideo } from "@/components/media/CinemaVideo";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { v2Rooms } from "@/content/v2";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { useIsMobile, useReducedMotion } from "@/hooks/useMedia";
import { CONCEPT_LABEL, films, type Film } from "@/lib/media";
import { cn } from "@/lib/utils";

const roomFilms: Partial<Record<(typeof v2Rooms)[number]["id"], Film>> = { kitchen: films.kitchen, master: films.bedroom };

/** A pinned, horizontally scrolling walk through every room; kitchen and bedroom play as film. */
export function RoomsGallery({ number = "02" }: { number?: string }) {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const horizontal = !mobile && !reduced;
  const progress = useMotionValue(0);
  const onProgress = useCallback((p: number) => progress.set(p), [progress]);
  const height = useHorizontalScroll(wrap, track, horizontal, onProgress);
  const bar = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section
      id="rooms"
      ref={wrap}
      aria-labelledby="rooms-title"
      className="on-dark relative bg-[#0f110e] text-ivory"
      style={horizontal && height ? { height } : undefined}
    >
      <div className={horizontal ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden" : "py-24"}>
        <div
          ref={track}
          className={
            horizontal
              ? "flex h-[76svh] items-stretch gap-6 pr-[8vw] pl-[max(1.25rem,4vw)] will-change-transform short:h-[80svh]"
              : "flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none]"
          }
        >
          <div className={horizontal ? "flex w-[34vw] shrink-0 flex-col justify-between py-2 pr-10" : "w-[82vw] shrink-0 snap-start pr-4"}>
            <div>
              <SectionMarker number={number} label="Room by room" className="text-sage-light" />
              <h2 id="rooms-title" className="display fs-display-xl mt-8">
                Every room, <span className="serif-accent">considered.</span>
              </h2>
              <p className="mt-8 max-w-sm text-base leading-relaxed font-light text-ivory/70">
                Eight spaces of one concept residence — materials, light and proportion designed to belong together.
              </p>
            </div>
            <div>
              <div className="relative h-px w-full bg-ivory/15" aria-hidden>
                <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-sage-light" />
              </div>
              <p className="label mt-4 text-ivory/45">{CONCEPT_LABEL}</p>
            </div>
          </div>

          {v2Rooms.map((room, i) => {
            const film = roomFilms[room.id];
            return (
              <figure
                key={room.id}
                data-cursor={film ? "Film" : "View"}
                className={cn(
                  "group relative shrink-0 overflow-hidden",
                  horizontal ? (i % 3 === 0 ? "h-full w-[min(64vw,1100px)]" : "h-full w-[min(46vw,780px)]") : "aspect-[4/5] w-[78vw] snap-start",
                )}
              >
                {film ? (
                  <CinemaVideo film={film} label={`${room.name} — ${room.body}`} className="absolute inset-0 h-full w-full" videoClassName="transition-transform duration-[1.8s] ease-(--ease-out-soft) group-hover:scale-[1.04]" />
                ) : (
                  <Image
                    src={room.image}
                    alt={`${room.name} — ${room.body}`}
                    fill
                    sizes="(min-width: 768px) 60vw, 80vw"
                    className="object-cover transition-transform duration-[1.8s] ease-(--ease-out-soft) group-hover:scale-[1.05]"
                  />
                )}
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,11,9,0.78)_0%,rgba(10,11,9,0)_45%)]" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-8">
                  <div>
                    <p className="label text-sage-light tabular-nums">{String(i + 1).padStart(2, "0")}{film ? " · Film" : ""}</p>
                    <p className="mt-2 text-2xl font-light tracking-tight md:text-3xl">{room.name}</p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-ivory/75 md:opacity-0 md:transition-opacity md:duration-700 md:group-hover:opacity-100">{room.body}</p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
