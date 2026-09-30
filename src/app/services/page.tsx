import { PageHero } from "@/components/layout/PageHero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { SmartFilm } from "@/components/v2/SmartFilm";
import { Finale } from "@/components/v2/Finale";
import { company } from "@/content/company";
import { CONCEPT_LABEL, still } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Corporate spaces, interiors & turnkey delivery, construction & civil works, institutional, hospitality, healthcare, product design and smart home systems.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services & Solutions"
        lines={["Transforming spaces", <span key="s" className="serif-accent">with precision.</span>]}
        lead={`${company.intro} ${company.oneStop}`}
        media={{ image: still("int-02"), alt: "Dining area beneath warm pendant lights", note: CONCEPT_LABEL }}
      />
      <ServicesSection showHeader={false} />
      <SmartFilm number="02" />
      <Finale />
    </>
  );
}
