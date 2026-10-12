import type { Viewport } from "next";
import { ConnectExperience } from "@/components/connect/ConnectExperience";
import { site } from "@/config/site";
import { connectContactCard, connectGroups, connectQuickActions } from "@/content/connect";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Connect",
    description: `Save ${site.name}'s contact, get directions to the studio, explore projects and more.`,
    path: "/connect",
  }),
  robots: { index: false, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1f2e20",
};

export default function ConnectPage() {
  const a = site.address;
  return (
    <ConnectExperience
      quickActions={connectQuickActions}
      groups={connectGroups}
      contactCard={connectContactCard}
      legalName={site.legalName}
      tagline={site.tagline}
      addressLines={[`${a.street},`, `${a.city}, ${a.region} – ${a.postalCode}`]}
    />
  );
}
