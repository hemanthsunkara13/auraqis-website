import { site } from "@/config/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { LineReveal, Reveal } from "@/components/ui/Reveal";

export function ContactDetails() {
  return (
    <dl className="space-y-8">
      <div>
        <dt className="label text-ivory/55">Company</dt>
        <dd className="mt-2 text-lg font-light">{site.legalName}</dd>
      </div>
      <div>
        <dt className="label text-ivory/55">Email</dt>
        <dd className="mt-2 text-lg font-light">
          <a href={`mailto:${site.email}`} className="link-underline">{site.email}</a>
        </dd>
      </div>
      <div>
        <dt className="label text-ivory/55">Phone</dt>
        <dd className="mt-2 space-y-1 text-lg font-light">
          {site.phones.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`} className="link-underline block w-fit">{p.display}</a>
          ))}
        </dd>
      </div>
      <div>
        <dt className="label text-ivory/55">Web</dt>
        <dd className="mt-2 text-lg font-light">
          <a href={site.url} className="link-underline">auraqis.com</a>
        </dd>
      </div>
      <div>
        <dt className="label text-ivory/55">Instagram</dt>
        <dd className="mt-2 text-lg font-light">
          {site.instagram ? (
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link-underline">Follow AURAQIS</a>
          ) : (
            <span className="text-ivory/60">Coming soon</span>
          )}
        </dd>
      </div>
    </dl>
  );
}

export function ContactSection({ numbered = true }: { numbered?: boolean }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="on-dark relative bg-charcoal py-28 text-ivory md:py-40">
      <div className="shell">
        <div className="grid-arch gap-y-16">
          <div className="col-span-12 lg:col-span-5">
            {numbered && <SectionMarker number="14" label="Contact" className="text-sage-light" />}
            <LineReveal id="contact-title" as="h2" className="display mt-8 fs-display-xl" lines={["Let’s bring your", <span key="v" className="serif-accent">vision to life.</span>]} />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-sm text-base leading-relaxed font-light text-ivory/75">
                Crafting timeless spaces that reflect who you are. Tell us about your home, workplace or commercial project.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-14">
              <ContactDetails />
            </Reveal>
          </div>
          <Reveal delay={0.15} className="col-span-12 lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
