"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { constructionOffer, interiorsOffer, services } from "@/content/services";
import { company } from "@/content/company";
import { films, still } from "@/lib/media";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const categories = [
  { href: "/construction", title: "Construction", summary: constructionOffer.lead, image: "/media/video/build-end.jpg", film: undefined },
  { href: "/interiors", title: "Interiors", summary: interiorsOffer.lead, image: films.kitchen.poster, film: films.kitchen.mobile },
  { href: "/services", title: "Services", summary: `${services.length} integrated service areas — from corporate spaces and healthcare to smart home systems.`, image: films.smart.poster, film: films.smart.mobile },
  { href: "/projects", title: "Projects", summary: "Site journals of real construction footage, and the concept residence.", image: "/videos/facade-rise.jpg", film: undefined },
  { href: "/about", title: "About", summary: company.about[0], image: still("ext-09"), film: undefined },
];

/** Cinematic index into the category pages: the backdrop changes with the row in focus. */
export function ExploreFilm({ number = "06" }: { number?: string }) {
  const [active, setActive] = useState(0);
  const c = categories[active];

  return (
    <section aria-labelledby="explore-title" className="on-dark relative isolate overflow-hidden bg-[#0b0c0a] text-ivory">
      <div aria-hidden className="absolute inset-0 -z-10">
        <AnimatePresence initial={false}>
          <motion.div key={c.href} className="absolute inset-0" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease }}>
            <Image src={c.image} alt="" fill sizes="100vw" className="object-cover" />
            {c.film && <video src={c.film} muted loop playsInline autoPlay className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden" />}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[#0b0c0a]/65" />
        <div className="film-vignette absolute inset-0" />
      </div>

      <div className="shell py-28 md:py-40">
        <div className="grid-arch mb-14 gap-y-8 md:mb-20">
          <div className="col-span-12 md:col-span-7">
            <SectionMarker number={number} label="Explore AURAQIS" className="text-sage-light" />
            <h2 id="explore-title" className="display fs-display-xl mt-8">
              Choose where <span className="serif-accent">to begin.</span>
            </h2>
          </div>
          <p className="col-span-12 flex items-end text-base leading-relaxed text-ivory/70 md:col-span-4 md:col-start-9">
            Each discipline has its own space. Step into the one that matters to you.
          </p>
        </div>

        <ol className="border-t border-ivory/15">
          {categories.map((cat, i) => {
            const on = i === active;
            return (
              <li key={cat.href} className="border-b border-ivory/15">
                <Link
                  href={cat.href}
                  data-cursor="Enter"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-7 md:py-9 short:py-6"
                >
                  <span className="label col-span-2 text-sage-light tabular-nums md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("display fs-display-lg col-span-10 transition-[transform,opacity] duration-700 ease-(--ease-out-soft) md:col-span-6", on ? "translate-x-3 opacity-100" : "opacity-55")}>
                    {cat.title}
                  </span>
                  <span className={cn("col-span-12 max-w-md text-sm leading-relaxed text-ivory/75 transition-opacity duration-700 md:col-span-4 md:col-start-8", on ? "md:opacity-100" : "md:opacity-40")}>
                    {cat.summary}
                  </span>
                  <span aria-hidden className="col-span-12 hidden justify-end md:col-span-1 md:flex">
                    <span className={cn("block h-px bg-current transition-[width] duration-700", on ? "w-12" : "w-5")} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
