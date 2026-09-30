import { PageHero } from "@/components/layout/PageHero";
import { OfferList } from "@/components/sections/OfferList";
import { FootageSection } from "@/components/sections/FootageSection";
import { BuildChapter } from "@/components/v2/BuildChapter";
import { ResultReveal } from "@/components/v2/ResultReveal";
import { Finale } from "@/components/v2/Finale";
import { StructureDrawing } from "@/components/ui/Drawings";
import { ButtonLink } from "@/components/ui/Button";
import { constructionOffer } from "@/content/services";
import { buildChapters } from "@/content/v2";
import { CONCEPT_LABEL, films } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Construction",
  description:
    "Residential and commercial construction, renovation, redevelopment and structural design & execution — planned and delivered end to end by AURAQIS.",
  path: "/construction",
});

export default function ConstructionPage() {
  return (
    <>
      <PageHero
        eyebrow="Construction & Civil Works"
        lines={["From blueprint", <span key="s" className="serif-accent">to structure.</span>]}
        lead={constructionOffer.lead}
        media={{ film: films.result, alt: "The completed concept residence in daylight", note: CONCEPT_LABEL }}
      >
        <ButtonLink href="#blueprint" tone="light">Watch it build</ButtonLink>
      </PageHero>
      <OfferList offer={constructionOffer} number="01" label="Capabilities" drawing={<StructureDrawing className="h-full w-full" />} />
      <BuildChapter number="02" chapters={buildChapters} />
      <ResultReveal number="03" />
      <FootageSection number="04" />
      <Finale heading="Planning a home or" accent="commercial build?" />
    </>
  );
}
