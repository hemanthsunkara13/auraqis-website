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
  address: {
    street: "B 32, Journalist Colony, Jubilee Hills",
    city: "Hyderabad",
    region: "Telangana",
    postalCode: "500033",
    country: "India",
    mapUrl: "https://maps.google.com/?q=Arka%20Projects%2C%20B32%2C%20Journalist%20Colony%2C%20Jubilee%20Hills%2C%20Hyderabad%2C%20Telangana",
  },
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
