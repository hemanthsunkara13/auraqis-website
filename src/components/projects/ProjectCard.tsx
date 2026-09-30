import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

export const kindLabel: Record<Project["kind"], string> = {
  project: "Project",
  "site-journal": "Site journal · real footage",
  concept: "Concept · AI visualisation",
};

export function ProjectCover({ project, sizes, priority, className }: { project: Project; sizes: string; priority?: boolean; className?: string }) {
  const cover = project.cover ?? { src: "/media/stills/ext-01.jpg", alt: "Architectural line drawing" };
  return (
    <div className={cn("relative overflow-hidden bg-charcoal", className)}>
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        className="object-cover transition-transform duration-[1.4s] ease-(--ease-out-soft) group-hover:scale-[1.04]"
      />
    </div>
  );
}

export function ProjectCard({ project, large, index, coverClassName }: { project: Project; large?: boolean; index: number; coverClassName?: string }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <ProjectCover
        project={project}
        sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
        className={coverClassName ?? (large ? "aspect-[16/10]" : "aspect-[4/5]")}
      />
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <p className="label text-forest">{kindLabel[project.kind]}</p>
          <h3 className="mt-2 text-2xl font-light tracking-tight md:text-3xl">
            <span className="link-underline">{project.title}</span>
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-charcoal/65">{project.summary}</p>
        </div>
        <span className="label shrink-0 text-charcoal/50 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
      </div>
    </Link>
  );
}
