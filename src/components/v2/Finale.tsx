import { CinemaVideo } from "@/components/media/CinemaVideo";
import { ButtonLink } from "@/components/ui/Button";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { primaryCta, site } from "@/config/site";
import { films } from "@/lib/media";

/** Closing chapter over the dusk film: the invitation to start a conversation. */
export function Finale({ heading = "Let’s bring your", accent = "vision to life." }: { heading?: string; accent?: string }) {
  return (
    <section aria-label="Start a conversation" className="on-dark relative isolate overflow-hidden bg-[#0b0c0a] text-ivory">
      <CinemaVideo film={films.hero} label="The concept residence at dusk" className="absolute inset-0 -z-10 h-full w-full opacity-60" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,12,10,0.85),rgba(11,12,10,0.45)_40%,rgba(11,12,10,0.9))]" />
      <div className="shell flex min-h-[90svh] flex-col justify-center py-28">
        <LineReveal as="h2" className="display fs-giant max-w-[14ch]" lines={[heading, <span key="a" className="serif-accent text-sage-light">{accent}</span>]} />
        <Reveal delay={0.2} className="mt-14 grid gap-10 border-t border-ivory/15 pt-10 md:grid-cols-3">
          <div>
            <p className="label text-ivory/55">Write</p>
            <a href={`mailto:${site.email}`} className="link-underline mt-3 inline-block text-xl font-light md:text-2xl">{site.email}</a>
          </div>
          <div>
            <p className="label text-ivory/55">Call</p>
            {site.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} className="link-underline mt-3 block w-fit text-xl font-light md:text-2xl">{p.display}</a>
            ))}
          </div>
          <div className="flex items-end md:justify-end">
            <ButtonLink href={primaryCta.href} tone="light" data-cursor="Talk">{primaryCta.label}</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
