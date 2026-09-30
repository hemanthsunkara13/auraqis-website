"use client";

import { useRef } from "react";
import { footage } from "@/content/footage";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { useIsMobile, useReducedMotion } from "@/hooks/useMedia";

/**
 * Real construction footage as the authenticity layer between the concept film and the finished result.
 * Desktop: sticky horizontal reel driven by scroll. Mobile / reduced motion: native swipe with snap.
 */
export function FootageSection({ number = "04" }: { number?: string }) {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const horizontal = !mobile && !reduced;
  const height = useHorizontalScroll(wrap, track, horizontal);

  return (
    <section
      id="footage"
      ref={wrap}
      aria-labelledby="footage-title"
      className="on-dark relative bg-charcoal text-ivory"
      style={horizontal && height ? { height } : undefined}
    >
      <div className={horizontal ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden" : "py-24"}>
        <div
          ref={track}
          className={
            horizontal
              ? "flex h-[78svh] items-stretch gap-6 pr-[8vw] pl-[max(1.25rem,4vw)] will-change-transform short:mt-12 short:h-[80svh]"
              : "flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none]"
          }
        >
          <div className={horizontal ? "flex w-[38vw] shrink-0 flex-col justify-between py-4 pr-10" : "w-[82vw] shrink-0 snap-start pr-4"}>
            <div>
              <SectionMarker number={number} label="Construction Experience" className="text-sage-light" />
              <LineReveal
                as="h2"
                id="footage-title"
                className="display mt-8 fs-display-lg"
                lines={["Real sites.", "Real hands.", <span key="c" className="serif-accent">Real craftsmanship.</span>]}
              />
              <Reveal delay={0.2}>
                <p className="mt-8 max-w-md text-base leading-relaxed font-light text-ivory/75">
                  The film above is our vision. This is what it takes on the ground — unedited footage from active construction sites:
                  stone laid by hand, steel raised into place, brick arches built within the scaffold.
                </p>
              </Reveal>
            </div>
            <ol className="mt-10 flex items-center gap-3 text-ivory/60" aria-label="From vision to result">
              <li className="label">The Vision</li>
              <li aria-hidden className="h-px w-8 bg-current" />
              <li className="label text-ivory">Real Construction</li>
              <li aria-hidden className="h-px w-8 bg-current" />
              <li className="label">Architectural Result</li>
            </ol>
          </div>

          {footage.map((clip, i) => (
            <figure
              key={clip.id}
              className={
                horizontal
                  ? `group relative flex h-full shrink-0 flex-col ${i % 3 === 1 ? "pt-[8svh]" : i % 3 === 2 ? "pb-[6svh]" : ""}`
                  : "relative w-[70vw] shrink-0 snap-start"
              }
            >
              <LazyVideo
                src={clip.src}
                poster={clip.poster}
                alt={`${clip.title} — ${clip.caption}`}
                className={horizontal ? "aspect-[9/16] h-[calc(100%-7rem)] w-auto" : "aspect-[9/16] w-full"}
                videoClassName="transition-transform duration-[1.6s] ease-(--ease-out-soft) group-hover:scale-[1.03]"
              />
              <figcaption className="mt-4 max-w-[18rem]">
                <p className="label text-sage-light">
                  {String(i + 1).padStart(2, "0")} — {clip.phase}
                </p>
                <p className="mt-2 text-lg font-light">{clip.title}</p>
                <p className="mt-1 text-sm text-ivory/60">{clip.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
