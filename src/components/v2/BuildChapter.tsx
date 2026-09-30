"use client";

import { AnimatePresence, motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { getLenis } from "@/components/motion/SmoothScroll";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { ScrollSequence } from "@/components/media/ScrollSequence";
import { CONCEPT_LABEL, sequences } from "@/lib/media";
import { cn } from "@/lib/utils";

export type Chapter = { at: number; label: string; title: string; body: string };

function chapterAt(chapters: readonly Chapter[], p: number) {
  let i = 0;
  for (let k = 0; k < chapters.length; k++) if (p >= chapters[k].at) i = k;
  return i;
}

/** Overlay for scrubbed films: intro heading, the active chapter, and a clickable progress rail. */
export function ChapterOverlay({
  progress,
  chapters,
  number,
  eyebrow,
  heading,
  sectionId,
}: {
  progress: MotionValue<number>;
  chapters: readonly Chapter[];
  number: string;
  eyebrow: string;
  heading: React.ReactNode;
  sectionId: string;
}) {
  const [active, setActive] = useState(0);
  const pct = useRef<HTMLSpanElement>(null);
  const introOpacity = useTransform(progress, [0, 0.06, 0.1], [1, 1, 0]);
  const introY = useTransform(progress, [0, 0.1], [0, -24]);
  const bar = useTransform(progress, [0, 1], [0, 1]);

  useMotionValueEvent(progress, "change", (p) => {
    const i = chapterAt(chapters, p);
    if (i !== active) setActive(i);
    if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(2, "0");
  });

  const jump = (at: number) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + (at + 0.015) * (el.offsetHeight - window.innerHeight);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const c = chapters[active];
  return (
    <div className="on-dark pointer-events-none absolute inset-0 text-ivory">
      <div aria-hidden className="absolute inset-y-0 left-0 w-[62%] bg-[linear-gradient(90deg,rgba(10,11,9,0.72),rgba(10,11,9,0.35)_55%,transparent)] max-md:w-full max-md:bg-[linear-gradient(0deg,rgba(10,11,9,0.85),rgba(10,11,9,0.2)_55%,transparent)]" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0a0b09]/70 to-transparent" />
      <div aria-hidden className="film-vignette absolute inset-0" />

      <div className="shell relative flex h-full flex-col justify-between pt-24 pb-6 md:pt-32 md:pb-8 short:pt-20 short:pb-4">
        <div className="flex items-start justify-between gap-6">
          <motion.div style={{ opacity: introOpacity, y: introY }}>
            <SectionMarker number={number} label={eyebrow} className="text-sage-light" />
            <h2 className="display fs-display-md mt-5 max-w-[17ch]">{heading}</h2>
          </motion.div>
          <p className="label hidden max-w-[15rem] text-right text-ivory/55 md:block">{CONCEPT_LABEL}</p>
        </div>

        <div className="flex flex-col gap-8 short:gap-4">
          <div className="min-h-[9rem] max-w-md short:min-h-[7rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={c.label} initial={{ opacity: 0, y: 22, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -14, filter: "blur(4px)" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <p className="label tabular-nums text-sage-light">
                  {String(active + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")} — {c.label}
                </p>
                <p className="serif-accent fs-stage mt-3 leading-tight">{c.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/80 md:text-base short:text-sm">{c.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pointer-events-auto">
            <div className="relative h-px w-full bg-ivory/20">
              <motion.span className="absolute inset-0 origin-left bg-ivory" style={{ scaleX: bar }} />
              {chapters.map((ch) => (
                <span key={ch.label} aria-hidden className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-ivory/60" style={{ left: `${ch.at * 100}%` }} />
              ))}
            </div>
            <div className="mt-4 flex items-start justify-between gap-6">
              <ol className="hidden flex-1 md:flex">
                {chapters.map((ch, i) => (
                  <li key={ch.label} className="flex-1">
                    <button
                      type="button"
                      data-cursor="Go"
                      onClick={() => jump(ch.at)}
                      aria-label={`Go to ${ch.label}`}
                      aria-current={i === active ? "step" : undefined}
                      className={cn("label text-left transition-opacity duration-500", i === active ? "opacity-100" : "opacity-40 hover:opacity-80")}
                    >
                      {ch.label}
                    </button>
                  </li>
                ))}
              </ol>
              <p className="label tabular-nums text-ivory/60">
                <span className="max-md:hidden">Scroll to continue · </span>
                <span ref={pct}>00</span>%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuildChapter({ number = "03", chapters }: { number?: string; chapters: readonly Chapter[] }) {
  return (
    <ScrollSequence id="blueprint" set={sequences.build} length={5.2} focusX={0.56} label="Construction sequence of the concept residence, from blueprint to completed home at dusk">
      {(p) => (
        <ChapterOverlay
          progress={p}
          chapters={chapters}
          number={number}
          eyebrow="Blueprint → Reality"
          sectionId="blueprint"
          heading={
            <>
              From a single line to a <span className="serif-accent">finished</span> home.
            </>
          }
        />
      )}
    </ScrollSequence>
  );
}
