"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { details } from "@/content/v2";

function Detail({ d, i }: { d: (typeof details)[number]; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [2.6, 2.1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  return (
    <li ref={ref} className={i % 2 ? "md:mt-40" : ""}>
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
        <motion.div className="absolute inset-0" style={{ scale, y, transformOrigin: d.focus }}>
          <Image src={d.image} alt={`${d.name} detail`} fill sizes="100vw" className="object-cover" style={{ objectPosition: d.focus }} />
        </motion.div>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-charcoal/15 pt-4">
        <p className="text-2xl font-light tracking-tight">{d.name}</p>
        <p className="label text-forest tabular-nums">{String(i + 1).padStart(2, "0")}</p>
      </div>
      <p className="mt-2 text-sm text-charcoal/65">{d.note}</p>
    </li>
  );
}

/** Close-up crops into the concept imagery — texture, grain and light at material scale. */
export function DetailsSection({ number = "03" }: { number?: string }) {
  return (
    <section aria-labelledby="details-title" className="relative bg-ivory py-28 md:py-40">
      <div className="shell">
        <div className="grid-arch gap-y-8">
          <div className="col-span-12 md:col-span-6">
            <SectionMarker number={number} label="Material detail" className="text-forest" />
            <h2 id="details-title" className="display fs-display-xl mt-8">
              Crafted to be <span className="serif-accent">touched.</span>
            </h2>
          </div>
          <p className="col-span-12 flex items-end text-base leading-relaxed text-charcoal/70 md:col-span-4 md:col-start-9">
            Natural stone, marble, timber and light — chosen for how they age, feel and catch the day.
          </p>
        </div>
        <ul className="mt-20 grid gap-x-10 gap-y-16 md:grid-cols-2">
          {details.map((d, i) => (
            <Detail key={d.name} d={d} i={i} />
          ))}
        </ul>
        <p className="mt-16 text-xs text-charcoal/50">Close-ups of concept visualisation imagery; finishes are indicative.</p>
      </div>
    </section>
  );
}
