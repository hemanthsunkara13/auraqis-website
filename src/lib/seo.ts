import type { Metadata } from "next";
import { site } from "@/config/site";

export function pageMetadata({
  title,
  description,
  path,
  image = "/brand/og-image.jpg",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${title} — ${site.name}`,
      description,
      siteName: site.legalName,
      images: [{ url: image, width: 1200, height: 630, alt: site.legalName }],
    },
    twitter: { card: "summary_large_image", title: `${title} — ${site.name}`, description, images: [image] },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: `${site.url}/brand/icon-512.png`,
    email: site.email,
    slogan: site.tagline,
    description: site.description,
    contactPoint: site.phones.map((p) => ({
      "@type": "ContactPoint",
      telephone: p.tel,
      email: site.email,
      contactType: "customer service",
    })),
    ...(site.instagram ? { sameAs: [site.instagram] } : {}),
  };
}
