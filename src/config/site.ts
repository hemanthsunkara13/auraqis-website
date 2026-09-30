export const site = {
  name: "AURAQIS",
  legalName: "AURAQIS PRIVATE LIMITED",
  descriptor: "Constructions · Interiors",
  tagline: "Where Vision Meets Craftsmanship",
  url: "https://auraqis.com",
  email: "info@auraqis.com",
  phones: [
    { display: "+91 75791 99999", tel: "+917579199999" },
    { display: "+91 75792 99999", tel: "+917579299999" },
  ],
  /** Instagram handle/URL is not available yet. Set a full URL here when it exists. */
  instagram: null as string | null,
  description:
    "AURAQIS is a tech-led design and build venture delivering integrated constructions, interiors, product supply and project management — creating functional, timeless, future-ready spaces.",
} as const;

export type NavItem = { label: string; href: string };

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Construction", href: "/construction" },
  { label: "Interiors", href: "/interiors" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const primaryCta = { label: "Start a Conversation", href: "/contact" };
