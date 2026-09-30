"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import { useCallback, useRef } from "react";
import { journey } from "@/content/process";
import { journeyDrawings } from "@/components/ui/Drawings";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { useIsMobile, useReducedMotion } from "@/hooks/useMedia";

function Step({ step, i, horizontal }: { step: (typeof journey)[number]; i: number; horizontal: boolean }) {
  const Drawing = journeyDrawings[step.visual];
  return (
    <article
      className={
        horizontal
          ? "relative flex h-full w-[min(72vw,980px)] shrink-0 items-center gap-12 border-l border-charcoal/15 pr-16 pl-12"
          : "relative border-t border-charcoal/15 py-14"
      }
      aria-labelledby={`step-${step.number}`}
    >
      <div className={horizontal ? "flex w-1/2 flex-col" : ""}>
        <p className="font-sans fs-numeral leading-none font-extralight tracking-tighter text-sage/70 tabular-nums">{step.number}</p>
        <h3 id={`step-${step.number}`} className="display mt-6 fs-display-md short:mt-3">
          {step.title[0]} <span className="serif-accent text-sage">&amp;</span> {step.title[1]}
        </h3>
        <p className="mt-6 text-lg font-light text-charcoal short:mt-3 short:text-base">{step.lead}</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal/70 md:text-base">{step.body}</p>
      </div>
      <div className={horizontal ? "w-1/2 max-w-[min(100%,52svh)] text-forest" : "mt-10 max-w-sm text-forest"}>
        <Drawing className="w-full" delay={horizontal ? 0.1 : 0} />
      </div>
      {horizontal && <span className="label absolute top-10 left-12 text-charcoal/50 short:top-2">Step {i + 1} of {journey.length}</span>}
    </article>
  );
}

/** 09 — Customer journey: a scroll-driven horizontal timeline (vertical on mobile). */
export function JourneySection({ number = "09" }: { number?: string }) {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const horizontal = !mobile && !reduced;
  const progress = useMotionValue(0);
  const onProgress = useCallback((p: number) => progress.set(p), [progress]);
  const height = useHorizontalScroll(wrap, track, horizontal, onProgress);
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section
      id="journey"
      ref={wrap}
      aria-labelledby="journey-title"
      className="relative bg-paper text-charcoal"
      style={horizontal && height ? { height } : undefined}
    >
      <div className={horizontal ? "sticky top-0 flex h-svh flex-col overflow-hidden" : "shell py-24"}>
        {horizontal && (
          <div className="shell flex items-end justify-between pt-28 short:pt-20">
            <SectionMarker number={number} label="Customer Journey" className="text-forest" />
            <div className="relative h-px w-1/3 bg-charcoal/15" aria-hidden>
              <motion.span style={{ scaleX }} className="absolute inset-0 origin-left bg-sage" />
            </div>
          </div>
        )}
        <div
          ref={track}
          className={horizontal ? "flex flex-1 items-stretch py-12 pl-[max(1.25rem,4vw)] will-change-transform short:py-6" : ""}
        >
          <div className={horizontal ? "flex w-[min(42vw,620px)] shrink-0 flex-col justify-center pr-16" : "mb-6"}>
            {!horizontal && <SectionMarker number={number} label="Customer Journey" className="text-forest" />}
            <LineReveal
              as="h2"
              id="journey-title"
              className="display mt-8 fs-display-xl"
              lines={["Journey to your", <span key="d" className="serif-accent">dream spaces.</span>]}
            />
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-sm text-base leading-relaxed text-charcoal/70">
                Five considered steps — from the first conversation to the day you walk in.
              </p>
            </Reveal>
          </div>
          {journey.map((s, i) => (
            <Step key={s.number} step={s} i={i} horizontal={horizontal} />
          ))}
        </div>
      </div>
    </section>
  );
}
