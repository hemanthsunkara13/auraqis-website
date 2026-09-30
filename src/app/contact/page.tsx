import { PageHero } from "@/components/layout/PageHero";
import { ContactSection } from "@/components/sections/ContactSection";
import { site } from "@/config/site";
import { CONCEPT_LABEL, still } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Start a conversation with ${site.legalName}. Email ${site.email} or call ${site.phones.map((p) => p.display).join(" / ")}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        lines={["Start a", <span key="s" className="serif-accent">conversation.</span>]}
        lead="Tell us about your home, workplace or commercial project — we’ll take it from concept to completion."
        media={{ image: still("sl-01"), alt: "A living room in the evening, lit from within", focus: "60% 50%", note: CONCEPT_LABEL }}
      />
      <ContactSection numbered={false} />
    </>
  );
}
