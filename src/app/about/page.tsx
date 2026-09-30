import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { WhySection } from "@/components/sections/WhySection";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { company } from "@/content/company";
import { CONCEPT_LABEL, still } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "AURAQIS is built on the pillars of Quality, Innovation and Integrity — blending design excellence with engineering precision to create functional, timeless spaces.",
  path: "/about",
});

export default function AboutPage() {
  const [lead, ...rest] = company.about;
  return (
    <>
      <PageHero
        eyebrow="About AURAQIS"
        lines={["Built on expertise.", <span key="s" className="serif-accent">Driven by vision.</span>]}
        lead={company.intro}
        media={{ image: still("ext-09"), alt: "The concept residence at dusk", note: CONCEPT_LABEL }}
      />

      <section aria-labelledby="about-title" className="bg-ivory py-28 md:py-40">
        <div className="shell grid-arch gap-y-16">
          <div className="col-span-12 lg:col-span-5">
            <SectionMarker number="01" label="Who we are" className="text-forest" />
            <h2 id="about-title" className="sr-only">Who we are</h2>
            <Reveal delay={0.05}>
              <p className="mt-10 fs-lead leading-snug font-light tracking-tight">{lead}</p>
            </Reveal>
          </div>
          <div className="col-span-12 space-y-6 text-base leading-relaxed text-charcoal/75 lg:col-span-5 lg:col-start-8 lg:pt-20">
            {rest.map((p, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="pillars-title" className="on-dark relative overflow-hidden bg-forest-deep py-28 text-ivory md:py-40">
        <div aria-hidden className="absolute -right-24 -bottom-24 w-[46vw] max-w-[640px] opacity-[0.06]">
          <Image src="/brand/mark-ivory.png" alt="" width={640} height={640} unoptimized className="w-full" style={{ height: "auto" }} />
        </div>
        <div className="shell relative">
          <SectionMarker number="02" label="Our pillars" className="text-sage-light" />
          <LineReveal id="pillars-title" as="h2" className="display mt-8 fs-display-xl" lines={["Quality. Innovation.", <span key="i" className="serif-accent">Integrity.</span>]} />
          <div className="grid-arch mt-20 gap-y-12">
            {company.pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1} className="col-span-12 border-t border-ivory/15 pt-8 md:col-span-4">
                <p className="label text-sage-light tabular-nums">0{i + 1}</p>
                <h3 className="mt-4 text-3xl font-light">{p.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/70">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="story-title" className="bg-paper py-28 md:py-40">
        <div className="shell grid-arch items-center gap-y-14">
          <Reveal className="col-span-12 md:col-span-5">
            <LazyVideo src="/videos/site-team.mp4" poster="/videos/site-team.jpg" alt="The team reviewing work on site" className="aspect-[4/5] w-full" />
            <p className="label mt-4 text-charcoal/50">Real site footage</p>
          </Reveal>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <SectionMarker number="03" label="Our story" className="text-forest" />
            <LineReveal id="story-title" as="h2" className="display mt-8 fs-display-lg" lines={["Every space deserves", <span key="e" className="serif-accent">elegance and intention.</span>]} />
            {company.story.body.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-charcoal/75">{p}</p>
              </Reveal>
            ))}
            <dl className="mt-14 grid gap-10 border-t border-charcoal/15 pt-10 sm:grid-cols-2">
              <Reveal>
                <dt className="label text-forest">Vision</dt>
                <dd className="mt-3 text-lg leading-snug font-light">{company.vision}</dd>
              </Reveal>
              <Reveal delay={0.1}>
                <dt className="label text-forest">Mission</dt>
                <dd className="mt-3 text-lg leading-snug font-light">{company.mission}</dd>
              </Reveal>
            </dl>
          </div>
        </div>
      </section>

      <WhySection number="04" />
      <ClosingCta />
    </>
  );
}
