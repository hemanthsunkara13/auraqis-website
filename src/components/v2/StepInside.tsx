"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { ScrollSequence } from "@/components/media/ScrollSequence";
import { ChapterOverlay } from "@/components/v2/BuildChapter";
import { enterChapters } from "@/content/v2";
import { sequences, still } from "@/lib/media";

/** Typographic mask: the entrance is seen through the words, which then open onto the full frame. */
function MaskIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.85], [1, 5.5]);
  const maskOpacity = useTransform(scrollYProgress, [0.35, 0.8], [1, 0]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const hint = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <div ref={ref} className="relative h-[200svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-[#0b0c0a]">
        <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
          <Image src={still("ext-10")} alt="The entrance of the concept residence at dusk" fill sizes="100vw" className="object-cover" />
        </motion.div>
        <motion.div aria-hidden className="absolute inset-0 flex items-center justify-center bg-[#0b0c0a] mix-blend-multiply" style={{ opacity: maskOpacity }}>
          <motion.p className="display text-center leading-[0.82] font-semibold tracking-[-0.05em] text-white uppercase" style={{ scale, fontSize: "clamp(4rem, min(20vw, 34svh), 22rem)" }}>
            Step
            <br />
            inside
          </motion.p>
        </motion.div>
        <motion.div style={{ opacity: hint }} className="on-dark pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <p className="label text-ivory/70">05 — Step inside · keep scrolling</p>
        </motion.div>
      </div>
    </div>
  );
}

export function StepInside({ number = "05" }: { number?: string }) {
  return (
    <div id="step-inside" className="relative bg-[#0b0c0a]">
      <h2 className="sr-only">Step inside</h2>
      <MaskIntro />
      <ScrollSequence id="enter" set={sequences.enter} length={5.5} focusX={0.5} label="Walking from the garden path through the pivot door into the living room">
        {(p) => (
          <ChapterOverlay
            progress={p}
            chapters={enterChapters}
            number={number}
            eyebrow="Interior walkthrough"
            sectionId="enter"
            heading={
              <>
                Walk in, <span className="serif-accent">slowly.</span>
              </>
            }
          />
        )}
      </ScrollSequence>
      <div className="on-dark relative flex flex-col items-center gap-6 bg-[#0b0c0a] py-24 text-center text-ivory">
        <p className="label text-sage-light">Every room, room by room</p>
        <p className="display fs-display-md max-w-[20ch]">
          Continue into the <span className="serif-accent">interiors.</span>
        </p>
        <ButtonLink href="/interiors" tone="light" data-cursor="Enter">Explore interiors</ButtonLink>
      </div>
    </div>
  );
}
