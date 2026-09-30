import { PageHero } from "@/components/layout/PageHero";
import { OfferList } from "@/components/sections/OfferList";
import { JourneySection } from "@/components/sections/JourneySection";
import { RoomsGallery } from "@/components/v2/RoomsGallery";
import { DetailsSection } from "@/components/v2/DetailsSection";
import { StepInside } from "@/components/v2/StepInside";
import { Finale } from "@/components/v2/Finale";
import { InteriorsDrawing } from "@/components/ui/Drawings";
import { ButtonLink } from "@/components/ui/Button";
import { interiorsOffer } from "@/content/services";
import { CONCEPT_LABEL, films } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Interiors",
  description:
    "Modular kitchens, wardrobe solutions, custom furniture and end-to-end home & office interiors — designed, executed and installed by AURAQIS.",
  path: "/interiors",
});

export default function InteriorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Interiors & Turnkey Delivery"
        lines={["Crafting spaces", <span key="s" className="serif-accent">that reflect you.</span>]}
        lead={interiorsOffer.lead}
        media={{ film: films.kitchen, alt: "Walking from the dining area into the kitchen", note: CONCEPT_LABEL }}
      >
        <ButtonLink href="#rooms" tone="light">See every room</ButtonLink>
      </PageHero>
      <OfferList offer={interiorsOffer} number="01" label="What we deliver" drawing={<InteriorsDrawing className="h-full w-full" />} />
      <RoomsGallery number="02" />
      <DetailsSection number="03" />
      <StepInside number="04" />
      <JourneySection number="05" />
      <Finale heading="Ready to design" accent="your interiors?" />
    </>
  );
}
