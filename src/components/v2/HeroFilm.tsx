"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CinemaVideo } from "@/components/media/CinemaVideo";
import { ButtonLink } from "@/components/ui/Button";
import { CONCEPT_LABEL, films } from "@/lib/media";

const ease = [0.22, 1, 0.36, 1] as const;
// The preloader covers the first visit; later client-side visits start immediately.
let firstVisit = true;

function Chars({ text, delay, className }: { text: string; delay: number; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.06em] ${className ?? ""}`} aria-hidden>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={{ y: "115%", rotate: 4 }}
          animate={{ y: "0%", rotate: 0 }}
          transition={{ duration: 1.25, delay: delay + i * 0.028, ease }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export function HeroFilm() {
  const ref = useRef<HTMLElement>(null);
  const [start] = useState(() => (firstVisit ? 1.9 : 0.2));
  useEffect(() => {
    firstVisit = false;
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const dim = useTransform(scrollYProgress, [0, 0.8], [0, 0.75]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="on-dark relative h-svh min-h-[560px] overflow-hidden bg-[#10120f] text-ivory">
      <motion.div className="absolute inset-0" style={{ scale }}>
        <CinemaVideo film={films.hero} label="The concept residence at dusk, lit from within" priority className="h-full w-full" />
      </motion.div>
      <div aria-hidden className="film-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(12,13,11,0.78)_0%,rgba(12,13,11,0.35)_45%,rgba(12,13,11,0)_75%)] max-md:bg-[linear-gradient(180deg,rgba(12,13,11,0.1)_20%,rgba(12,13,11,0.85)_75%)]" />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-[#0b0c0a]" style={{ opacity: dim }} />

      {/* cinematic letterbox opening */}
      <motion.div aria-hidden className="absolute inset-x-0 top-0 z-10 bg-[#0b0c0a]" initial={{ height: "14svh" }} animate={{ height: "0svh" }} transition={{ duration: 1.8, delay: start + 0.2, ease: [0.76, 0, 0.24, 1] }} />
      <motion.div aria-hidden className="absolute inset-x-0 bottom-0 z-10 bg-[#0b0c0a]" initial={{ height: "14svh" }} animate={{ height: "0svh" }} transition={{ duration: 1.8, delay: start + 0.2, ease: [0.76, 0, 0.24, 1] }} />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="shell relative z-[5] flex h-full flex-col justify-end pb-28 md:pb-32 lg:justify-center lg:pt-16 lg:pb-0">
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: start, ease }} className="label mb-7 flex items-center gap-4 text-sage-light short:mb-5">
          <span aria-hidden className="h-px w-10 bg-current" />
          Constructions · Interiors
        </motion.p>
        <h1 id="hero-title" className="display fs-hero max-w-[14ch] uppercase">
          <span className="sr-only">Where vision meets craftsmanship</span>
          <Chars text="Where vision" delay={start + 0.15} />
          <Chars text="meets" delay={start + 0.4} />
          <Chars text="Craftsmanship" delay={start + 0.6} className="serif-accent text-[1.06em] leading-[0.92] normal-case" />
        </h1>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: start + 1.1, ease }} className="mt-9 flex max-w-xl flex-col gap-8 short:mt-6 short:gap-6">
          <p className="text-base leading-relaxed font-light text-ivory/80 md:text-lg">
            Design and build under one roof — constructions, interiors, product supply and project management, from the first line on paper to the final finish.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/projects" tone="light">Explore Our Work</ButtonLink>
            <ButtonLink href="#step-inside" variant="outline" tone="light">Step Inside</ButtonLink>
          </div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: start + 1.5 }} className="shell pointer-events-none absolute inset-x-0 bottom-6 z-[5] flex items-end justify-between text-ivory/60 short:bottom-4">
        <p className="label hidden md:block">01 — Vision</p>
        <div className="flex flex-col items-center gap-3 short:hidden" aria-hidden>
          <span className="label">Scroll</span>
          <span className="block h-12 w-px bg-ivory/20">
            <span className="block h-full w-px animate-scroll-cue bg-ivory" />
          </span>
        </div>
        <p className="label hidden max-w-[16rem] text-right md:block">{CONCEPT_LABEL}</p>
      </motion.div>
    </section>
  );
}
