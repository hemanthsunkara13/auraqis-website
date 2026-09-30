import { PageHero } from "@/components/layout/PageHero";
import { Finale } from "@/components/v2/Finale";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/content/projects";
import { CONCEPT_LABEL, still } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description: "Site journals of real AURAQIS construction footage and a cinematic concept residence. Completed case studies will be published here.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        lines={["Work in", <span key="p" className="serif-accent">progress.</span>]}
        lead="Site journals document real construction footage from our sites. The concept residence is an AI-assisted visualisation of our process. Completed project case studies will be published here."
        media={{ image: still("ext-00"), alt: "The concept residence at golden hour", note: CONCEPT_LABEL }}
      />
      <section aria-label="All projects" className="bg-paper py-24 md:py-32">
        <div className="shell">
          <ul className="grid-arch gap-y-20">
            {projects.map((p, i) => (
              <li key={p.slug} className={i === 0 ? "col-span-12" : "col-span-12 md:col-span-6"}>
                <Reveal delay={(i % 2) * 0.1}>
                  <ProjectCard project={p} index={i} large={i === 0} coverClassName={i === 0 ? "aspect-[16/10] md:aspect-[21/9]" : "aspect-[4/3]"} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Finale heading="Your project" accent="could be next." />
    </>
  );
}
