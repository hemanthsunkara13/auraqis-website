"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { smartLiving } from "@/content/smartLiving";
import { CONCEPT_LABEL, films } from "@/lib/media";
import { cn } from "@/lib/utils";

type Scene = "day" | "evening";

/**
 * Smart Living as a scene switch: the living-room film plays forward (curtains close, lights dim)
 * or its reversed encode plays back to the open daytime scene.
 */
export function SmartFilm({ number = "02" }: { number?: string }) {
  const fwd = useRef<HTMLVideoElement>(null);
  const rev = useRef<HTMLVideoElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<Scene>("day");
  const [showRev, setShowRev] = useState(false);
  const [load, setLoad] = useState(false);
  const auto = useRef(false);

  const play = (next: Scene) => {
    if (next === scene) return;
    setScene(next);
    const a = next === "evening" ? fwd.current : rev.current;
    const b = next === "evening" ? rev.current : fwd.current;
    if (!a || !b) return;
    a.currentTime = 0;
    a.play().catch(() => undefined);
    setShowRev(next === "day");
    b.pause();
  };

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setLoad(true);
        if (e.intersectionRatio > 0.6 && !auto.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          auto.current = true;
          window.setTimeout(() => {
            setScene("evening");
            fwd.current?.play().catch(() => undefined);
          }, 900);
        }
      },
      { threshold: [0, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="smart-living" aria-labelledby="smart-title" className="on-dark relative bg-forest-deep py-28 text-ivory md:py-40">
      <div className="shell">
        <div className="grid-arch gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <SectionMarker number={number} label="Smart Living" className="text-sage-light" />
            <h2 id="smart-title" className="display fs-display-xl mt-8">
              {smartLiving.heading[0]} <span className="serif-accent">{smartLiving.heading[1]}</span>
            </h2>
            <p className="mt-8 max-w-sm text-base leading-relaxed font-light text-ivory/75">{smartLiving.lead}</p>
          </div>
          <div className="col-span-12 flex items-end lg:col-span-6 lg:col-start-7">
            <div role="group" aria-label="Lighting scene" className="flex border border-ivory/30">
              {(["day", "evening"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={scene === s}
                  onClick={() => play(s)}
                  data-cursor={s === "day" ? "Open" : "Dim"}
                  className={cn("label px-6 py-4 transition-colors duration-500", scene === s ? "bg-ivory text-charcoal" : "text-ivory hover:bg-ivory/10")}
                >
                  {s === "day" ? "Open scene" : "Evening scene"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div ref={wrap} className="relative mt-14 aspect-[16/9] overflow-hidden bg-charcoal md:mt-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={films.smart.poster} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <video ref={fwd} src={load ? films.smart.src : undefined} poster={films.smart.poster} muted playsInline preload="auto" aria-label="Curtains closing and lights dimming in the living room" className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-500", showRev ? "opacity-0" : "opacity-100")} />
          <video ref={rev} src={load ? films.smartReverse.src : undefined} poster={films.smartReverse.poster} muted playsInline preload="auto" aria-label="Curtains opening and lights brightening in the living room" className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-500", showRev ? "opacity-100" : "opacity-0")} />
          <div aria-hidden className="film-vignette absolute inset-0" />
          <motion.p key={scene} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="label absolute top-6 left-6 bg-[#0b0c0a]/55 px-3 py-2 backdrop-blur">
            {scene === "day" ? "Open · curtains up · full light" : "Evening · curtains closed · dimmed"}
          </motion.p>
          <p className="label absolute right-6 bottom-6 text-ivory/60">{CONCEPT_LABEL}</p>
        </div>

        <ul className="mt-16 grid gap-x-10 gap-y-8 border-t border-ivory/15 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {smartLiving.features.map((f, i) => (
            <li key={f.id} className="flex gap-5">
              <span className="label pt-1 text-sage-light tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-lg font-light">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ivory/60">{f.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="label mt-12 text-ivory/50">{smartLiving.signoff}</p>
      </div>
    </section>
  );
}
