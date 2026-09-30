import { primaryCta, site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { LineReveal, Reveal } from "@/components/ui/Reveal";

export function ClosingCta({ heading = "Let’s bring your", accent = "vision to life." }: { heading?: string; accent?: string }) {
  return (
    <section aria-label="Start a conversation" className="relative bg-ivory py-28 md:py-36">
      <div className="shell grid-arch items-end gap-y-10">
        <div className="col-span-12 md:col-span-8">
          <LineReveal as="h2" className="display fs-display-xl" lines={[heading, <span key="a" className="serif-accent text-forest">{accent}</span>]} />
        </div>
        <Reveal delay={0.15} className="col-span-12 flex flex-col items-start gap-4 md:col-span-4 md:items-end">
          <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
          <a href={`mailto:${site.email}`} className="link-underline text-sm text-charcoal/70">{site.email}</a>
        </Reveal>
      </div>
    </section>
  );
}
