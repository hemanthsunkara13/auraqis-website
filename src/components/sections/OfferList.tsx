import { SectionMarker } from "@/components/ui/SectionMarker";
import { LineReveal, Reveal } from "@/components/ui/Reveal";

type Offer = { heading: string; lead: string; items: { title: string; body: string }[] };

/** Editorial capability index used on the Construction and Interiors pages. */
export function OfferList({ offer, label, drawing, number }: { offer: Offer; label: string; drawing?: React.ReactNode; number?: string }) {
  return (
    <section aria-labelledby="offer-title" className="relative bg-ivory py-28 md:py-40">
      <div className="shell grid-arch gap-y-16">
        <div className="col-span-12 lg:col-span-5">
          <SectionMarker number={number} label={label} className="text-forest" />
          <LineReveal id="offer-title" as="h2" className="display mt-8 fs-display-lg" lines={[offer.heading]} />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-charcoal/75">{offer.lead}</p>
          </Reveal>
          {drawing && (
            <Reveal delay={0.2} className="mt-12 aspect-[4/3] max-w-md bg-paper p-6 text-forest">
              {drawing}
            </Reveal>
          )}
        </div>
        <ol className="col-span-12 border-t border-charcoal/15 lg:col-span-6 lg:col-start-7">
          {offer.items.map((item, i) => (
            <li key={item.title} className="border-b border-charcoal/15">
              <Reveal delay={i * 0.06} className="grid grid-cols-12 gap-4 py-8">
                <span className="label col-span-2 pt-2 text-forest tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div className="col-span-10">
                  <h3 className="fs-lead leading-tight font-light tracking-tight">{item.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-charcoal/70">{item.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
