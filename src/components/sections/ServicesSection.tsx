"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { services } from "@/content/services";
import { serviceDrawings } from "@/components/ui/Drawings";
import { ButtonLink } from "@/components/ui/Button";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { LineReveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** 11 — Services as an editorial index; each row opens to show capabilities and an architectural drawing. */
export function ServicesSection({ showHeader = true, numberLabel = "11" }: { showHeader?: boolean; numberLabel?: string }) {
  const [open, setOpen] = useState<string | null>(services[0].slug);

  return (
    <section id="services" aria-labelledby="services-title" className="relative bg-ivory py-28 md:py-40">
      <div className="shell">
        {showHeader && (
          <div className="grid-arch mb-16 gap-y-8 md:mb-24">
            <div className="col-span-12 md:col-span-7">
              <SectionMarker number={numberLabel} label="Services & Solutions" className="text-forest" />
              <LineReveal
                as="h2"
                id="services-title"
                className="display mt-8 fs-display-xl"
                lines={["Transforming spaces with", <span key="p" className="serif-accent">precision and creativity.</span>]}
              />
            </div>
            <div className="col-span-12 flex items-end md:col-span-4 md:col-start-9">
              <p className="text-base leading-relaxed text-charcoal/70">
                Integrated services across constructions, interiors, product supply and project management — one team, one point of contact.
              </p>
            </div>
          </div>
        )}
        {!showHeader && <h2 id="services-title" className="sr-only">Services</h2>}

        <ul className="border-t border-charcoal/15">
          {services.map((s) => {
            const isOpen = open === s.slug;
            const Drawing = serviceDrawings[s.visual];
            return (
              <li key={s.slug} id={s.slug} className="scroll-mt-24 border-b border-charcoal/15">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`svc-${s.slug}`}
                    onClick={() => setOpen(isOpen ? null : s.slug)}
                    className="group grid w-full grid-cols-12 items-baseline gap-4 py-7 text-left md:py-9"
                  >
                    <span className="label col-span-2 text-forest tabular-nums md:col-span-1">{s.number}</span>
                    <span
                      className={cn(
                        "col-span-10 fs-display-sm leading-tight font-light tracking-tight transition-transform duration-500 ease-(--ease-out-soft) md:col-span-7",
                        !isOpen && "group-hover:translate-x-3",
                      )}
                    >
                      {s.title}
                    </span>
                    <span className="col-span-10 col-start-3 text-sm text-charcoal/60 md:col-span-3 md:col-start-auto">{s.short}</span>
                    <span aria-hidden className="col-span-1 hidden justify-self-end md:block">
                      <span className="relative block h-4 w-4">
                        <span className="absolute top-1/2 left-0 h-px w-4 bg-current" />
                        <span className={cn("absolute top-0 left-1/2 h-4 w-px bg-current transition-transform duration-500", isOpen && "scale-y-0")} />
                      </span>
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`svc-${s.slug}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-12 gap-x-4 gap-y-10 pb-12">
                        <div className="col-span-12 md:col-span-5 md:col-start-2">
                          <p className="text-lg leading-relaxed font-light text-charcoal/85">{s.summary}</p>
                          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-charcoal/75 sm:grid-cols-2">
                            {s.capabilities.map((c) => (
                              <li key={c} className="flex gap-3">
                                <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-sage" />
                                {c}
                              </li>
                            ))}
                          </ul>
                          {s.note && <p className="mt-8 border-l-2 border-sage pl-4 text-sm text-charcoal/80">{s.note}</p>}
                        </div>
                        <div className="col-span-12 md:col-span-5 md:col-start-8">
                          <div className="relative aspect-[4/3] overflow-hidden bg-paper">
                            {s.image && (
                              <Image src={s.image} alt="Residential frame under construction" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover opacity-90 mix-blend-multiply grayscale-[30%]" />
                            )}
                            <div className={cn("absolute inset-0 p-6 text-forest", s.image && "text-ivory")}>
                              <Drawing className="h-full w-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {showHeader && (
          <div className="mt-14 flex justify-end">
            <ButtonLink href="/services" variant="outline">All services</ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
