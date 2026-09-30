"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { company } from "@/content/company";
import { SectionMarker } from "@/components/ui/SectionMarker";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, ["0.18em", "0em"]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block pr-[0.26em]">
      {word}
    </motion.span>
  );
}

const chain = ["Vision", "Blueprint", "Foundation", "Structure", "Architecture", "Interior", "Material", "Smart Living", "Craftsmanship"];

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.4"] });
  const words = company.intro.split(" ");

  return (
    <section aria-labelledby="manifesto-title" className="relative overflow-hidden bg-ivory py-28 md:py-44">
      <div className="shell">
        <SectionMarker number="02" label="The practice" className="text-forest" />
        <h2 id="manifesto-title" className="sr-only">Who we are</h2>
        <p ref={ref} className="display fs-display-lg mt-12 max-w-[24ch] leading-[1.05] text-charcoal">
          {words.map((w, i) => (
            <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2.5) / words.length)]} />
          ))}
        </p>
        <div className="grid-arch mt-20 gap-y-10 border-t border-charcoal/15 pt-10 md:mt-28">
          {[
            ["Constructions", "Residential and commercial builds, renovation and redevelopment."],
            ["Interiors", "Modular kitchens, wardrobes, custom furniture and turnkey interiors."],
            ["Delivery", "Product supply and dedicated project management, end to end."],
          ].map(([t, b], i) => (
            <div key={t} className="col-span-12 md:col-span-4">
              <p className="label text-forest tabular-nums">0{i + 1}</p>
              <p className="mt-3 text-2xl font-light tracking-tight">{t}</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-charcoal/65">{b}</p>
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden className="mt-24 overflow-hidden border-y border-charcoal/10 py-6 md:mt-32">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap motion-reduce:animate-none">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center gap-10">
              {chain.map((c) => (
                <span key={c} className="flex items-center gap-10">
                  <span className="display text-5xl text-charcoal/80 md:text-7xl">{c}</span>
                  <span className="serif-accent text-3xl text-sage md:text-5xl">→</span>
                </span>
              ))}
              <span className="font-brand text-3xl font-semibold tracking-[0.4em] text-forest md:text-5xl">AURAQIS</span>
              <span className="serif-accent text-3xl text-sage md:text-5xl">·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
