import { company, whyAuraqis } from "@/content/company";
import { Counter } from "@/components/ui/Counter";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { LineReveal, Reveal } from "@/components/ui/Reveal";

export function WhySection({ number = "13" }: { number?: string }) {
  return (
    <section id="why" aria-labelledby="why-title" className="relative overflow-hidden bg-stone py-28 text-charcoal md:py-40">
      <div className="shell">
        <SectionMarker number={number} label="Why AURAQIS" className="text-forest" />
        <LineReveal id="why-title" as="h2" className="display mt-8 max-w-[18ch] fs-display-xl" lines={["Experience that", <span key="d" className="serif-accent">delivers confidence.</span>]} />

        <div className="grid-arch mt-20 gap-y-16 border-t border-charcoal/20 pt-14">
          {whyAuraqis.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.12} className="col-span-12 md:col-span-6">
              <p className="font-sans fs-numeral leading-[0.85] font-extralight tracking-tighter text-forest tabular-nums">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="label mt-6">{s.label}</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal/75">{s.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="grid-arch mt-20 gap-y-12">
          {whyAuraqis.reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.1} className="col-span-12 border-t border-charcoal/20 pt-6 md:col-span-4">
              <p className="label text-forest tabular-nums">0{i + 1}</p>
              <h3 className="mt-4 text-2xl leading-tight font-light">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{r.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <ul className="flex flex-wrap gap-x-10 gap-y-3 text-charcoal/80" aria-label="Our values">
            {company.values.map((v) => (
              <li key={v} className="serif-accent text-2xl md:text-3xl">
                {v}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
