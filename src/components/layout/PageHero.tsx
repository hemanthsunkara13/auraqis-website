import Image from "next/image";
import { CinemaVideo } from "@/components/media/CinemaVideo";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import type { Film } from "@/lib/media";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  lines: React.ReactNode[];
  lead?: string;
  /** Full-bleed backdrop: a film, or a still that slowly drifts (Ken Burns). */
  media?: { film?: Film; image?: string; alt: string; focus?: string; note?: string };
  children?: React.ReactNode;
  className?: string;
};

/** Cinematic page opener: full-bleed film or still beneath a masked headline. */
export function PageHero({ eyebrow, lines, lead, media, children, className }: Props) {
  return (
    <section className={cn("on-dark relative isolate flex min-h-[92svh] items-end overflow-hidden bg-[#0b0c0a] text-ivory", className)}>
      {media?.film ? (
        <CinemaVideo film={media.film} label={media.alt} priority className="absolute inset-0 -z-10 h-full w-full" />
      ) : media?.image ? (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image src={media.image} alt={media.alt} fill priority sizes="100vw" className="animate-kenburns object-cover motion-reduce:animate-none" style={{ objectPosition: media.focus }} />
        </div>
      ) : (
        <div aria-hidden className="blueprint-grid absolute inset-0 -z-10 text-ivory opacity-60" />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(11,12,10,0.92)_0%,rgba(11,12,10,0.45)_45%,rgba(11,12,10,0.25)_100%)]" />
      <div aria-hidden className="film-vignette absolute inset-0 -z-10" />

      <div className="shell relative w-full pt-40 pb-16 md:pb-24 short:pt-32 short:pb-12">
        <div className="grid-arch items-end gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <Reveal y={12}>
              <p className="label flex items-center gap-4 text-sage-light">
                <span aria-hidden className="h-px w-10 bg-current" />
                {eyebrow}
              </p>
            </Reveal>
            <LineReveal as="h1" className="display mt-8 fs-page-title" lines={lines} delay={0.1} />
          </div>
          <div className="col-span-12 lg:col-span-4">
            {lead && (
              <Reveal delay={0.35}>
                <p className="max-w-md text-base leading-relaxed font-light text-ivory/80 md:text-lg">{lead}</p>
              </Reveal>
            )}
            {children && <Reveal delay={0.45} className="mt-8">{children}</Reveal>}
          </div>
        </div>
        {media?.note && <p className="label mt-12 text-ivory/45">{media.note}</p>}
      </div>
    </section>
  );
}
