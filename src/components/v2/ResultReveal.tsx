"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CinemaVideo } from "@/components/media/CinemaVideo";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { CONCEPT_LABEL, films } from "@/lib/media";

/** The finished architecture: a framed film that opens to full bleed as you scroll. */
export function ResultReveal({ number = "04" }: { number?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const inset = useTransform(scrollYProgress, [0, 0.55], [14, 0]);
  const radius = useTransform(scrollYProgress, [0, 0.55], [18, 0]);
  const clip = useTransform([inset, radius], ([i, r]: number[]) => `inset(${i}% ${i * 1.4}% ${i}% ${i * 1.4}% round ${r}px)`);
  const scale = useTransform(scrollYProgress, [0, 0.55], [1.2, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.55], ["0%", "-60%"]);
  const titleOpacity = useTransform(scrollYProgress, [0.35, 0.55], [1, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0.58, 0.72], [0, 1]);
  const copyY = useTransform(scrollYProgress, [0.58, 0.72], [30, 0]);

  return (
    <section ref={ref} aria-labelledby="result-title" className="on-dark relative h-[260svh] bg-[#0f110e] text-ivory">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          <motion.div className="absolute inset-0" style={{ scale }}>
            <CinemaVideo film={films.result} label="The completed concept residence in daylight, garden and pool" className="h-full w-full" />
          </motion.div>
          <div aria-hidden className="film-vignette absolute inset-0" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,11,9,0.8)_0%,rgba(10,11,9,0)_55%)]" />
        </motion.div>

        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <h2 id="result-title" className="display fs-giant text-center mix-blend-difference">
            The <span className="serif-accent">result.</span>
          </h2>
        </motion.div>

        <motion.div style={{ opacity: copyOpacity, y: copyY }} className="shell absolute inset-x-0 bottom-0 pb-16 md:pb-20">
          <div className="grid-arch items-end gap-y-6">
            <div className="col-span-12 md:col-span-6">
              <SectionMarker number={number} label="Completed architecture" className="text-sage-light" />
              <p className="display fs-display-lg mt-6">
                Designed as <span className="serif-accent">one.</span>
              </p>
            </div>
            <p className="col-span-12 max-w-md text-base leading-relaxed font-light text-ivory/80 md:col-span-4 md:col-start-9">
              Structure, facade, landscape and light, resolved together — stone at the base, timber above and glass that opens every room to the garden.
            </p>
          </div>
          <p className="label mt-10 text-ivory/50">{CONCEPT_LABEL}</p>
        </motion.div>
      </div>
    </section>
  );
}
