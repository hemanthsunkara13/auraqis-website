import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ProjectCover, kindLabel } from "@/components/projects/ProjectCard";
import { BuildChapter } from "@/components/v2/BuildChapter";
import { StepInside } from "@/components/v2/StepInside";
import { buildChapters } from "@/content/v2";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { Swatch } from "@/components/ui/Swatch";
import { materialSlots } from "@/content/materials";
import { projectBySlug, projects, type ProjectMedia } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.summary, path: `/projects/${p.slug}` });
}

function Media({ media, className, sizes }: { media: ProjectMedia; className?: string; sizes: string }) {
  if (media.type === "video") return <LazyVideo src={media.src} poster={media.poster} alt={media.alt} className={className} />;
  return (
    <div className={cn("relative overflow-hidden bg-charcoal", className)}>
      <Image src={media.src} alt={media.alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const facts = [
    { label: "Category", value: project.category },
    { label: "Location", value: project.location },
    { label: "Year", value: project.year },
    { label: "Area", value: project.area },
    { label: "Client", value: project.client },
  ].filter((f): f is { label: string; value: string } => !!f.value);
  const slots = project.materials ? materialSlots.filter((s) => project.materials!.includes(s.id)) : [];

  return (
    <article>
      <header className="on-dark relative bg-charcoal pt-32 text-ivory md:pt-40">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="label text-ivory/55">
            <Link href="/projects" className="link-underline">Projects</Link>
            <span aria-hidden className="mx-3">/</span>
            <span className="text-ivory/85">{kindLabel[project.kind]}</span>
          </nav>
          <LineReveal as="h1" className="display mt-8 max-w-[16ch] fs-page-title" lines={[project.title]} />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed font-light text-ivory/75">{project.summary}</p>
          </Reveal>
        </div>
        <Reveal delay={0.25} className="shell mt-16 pb-0">
          <ProjectCover project={project} sizes="100vw" priority className="aspect-[16/10] md:aspect-[21/9]" />
        </Reveal>
      </header>

      <section aria-label="Overview" className="bg-ivory py-24 md:py-32">
        <div className="shell grid-arch gap-y-14">
          <dl className="col-span-12 space-y-6 md:col-span-4">
            {facts.map((f) => (
              <div key={f.label} className="border-t border-charcoal/15 pt-4">
                <dt className="label text-forest">{f.label}</dt>
                <dd className="mt-2 text-base">{f.value}</dd>
              </div>
            ))}
            <div className="border-t border-charcoal/15 pt-4">
              <dt className="label text-forest">Services</dt>
              <dd className="mt-2 space-y-1 text-base">
                {project.services.map((s) => (
                  <span key={s} className="block">{s}</span>
                ))}
              </dd>
            </div>
          </dl>
          <div className="col-span-12 space-y-6 md:col-span-7 md:col-start-6">
            {project.description.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? "fs-lead leading-snug font-light tracking-tight" : "text-base leading-relaxed text-charcoal/75"}>{p}</p>
              </Reveal>
            ))}
            {project.kind === "concept" && (
              <p className="border-l-2 border-brass pl-4 text-sm text-charcoal/70">
                Concept visualisation — AI-generated imagery. Architecture, finishes and layout are illustrative and do not represent a completed AURAQIS project.
              </p>
            )}
          </div>
        </div>
      </section>

      {project.journey && project.journey.length > 0 && (
        <section aria-labelledby="journey-title" className="on-dark bg-charcoal py-24 text-ivory md:py-32">
          <div className="shell">
            <SectionMarker label="Construction journey" className="text-sage-light" />
            <h2 id="journey-title" className="sr-only">Construction journey</h2>
            <ol className="mt-16 space-y-24">
              {project.journey.map((step, i) => (
                <li key={step.title} className="grid-arch items-center gap-y-8">
                  {step.media && (
                    <Reveal className={cn("col-span-12 md:col-span-4", i % 2 === 1 && "md:order-2 md:col-start-8")}>
                      <Media media={step.media} className="aspect-[9/16] max-h-[78svh] w-full" sizes="(min-width: 768px) 33vw, 100vw" />
                    </Reveal>
                  )}
                  <Reveal delay={0.1} className={cn("col-span-12 md:col-span-5", i % 2 === 1 ? "md:order-1 md:col-start-2" : "md:col-start-7")}>
                    <p className="label text-sage-light tabular-nums">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-4 fs-display-sm leading-tight font-light">{step.title}</h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-ivory/70">{step.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="bg-paper py-24 md:py-32">
          <div className="shell">
            <SectionMarker label="Gallery" className="text-forest" />
            <h2 id="gallery-title" className="sr-only">Gallery</h2>
            <ul className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3">
              {project.gallery.map((m, i) => (
                <li key={`${m.src}-${i}`} className="mb-6 break-inside-avoid">
                  <Reveal delay={(i % 3) * 0.06}>
                    <Media
                      media={m}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className={m.type === "video" || m.aspect === "portrait" ? "aspect-[9/16] w-full" : "aspect-[4/3] w-full"}
                    />
                    <p className="mt-3 text-sm text-charcoal/60">{m.alt}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {project.hasFilm && (
        <>
          <BuildChapter number="01" chapters={buildChapters} />
          <StepInside number="02" />
        </>
      )}

      {slots.length > 0 && (
        <section aria-labelledby="palette-title" className="bg-ivory py-24 md:py-32">
          <div className="shell">
            <SectionMarker label="Material palette" className="text-forest" />
            <LineReveal id="palette-title" as="h2" className="display mt-8 fs-display-md" lines={["Finishes to", <span key="e" className="serif-accent">explore.</span>]} />
            <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
              {slots.map((s) => (
                <li key={s.id}>
                  <div className="flex">
                    {s.options.map((o) => (
                      <Swatch key={o.id} option={o} className="aspect-square flex-1" />
                    ))}
                  </div>
                  <p className="label mt-4 text-forest">{s.category}</p>
                  <p className="mt-1 text-sm text-charcoal/65">{s.options.map((o) => o.name).join(" · ")}</p>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-xs text-charcoal/50">Finishes are indicative visualisations for exploration.</p>
          </div>
        </section>
      )}

      <nav aria-label="Next project" className="on-dark bg-charcoal text-ivory">
        <Link href={`/projects/${next.slug}`} className="group shell flex flex-col gap-4 py-20 md:flex-row md:items-end md:justify-between md:py-28">
          <div>
            <p className="label text-sage-light">Next · {kindLabel[next.kind]}</p>
            <p className="display mt-6 fs-display-xl transition-transform duration-700 ease-(--ease-out-soft) group-hover:translate-x-3">
              {next.title}
            </p>
          </div>
          <span className="label text-ivory/60">View project →</span>
        </Link>
      </nav>

      <ClosingCta />
    </article>
  );
}
