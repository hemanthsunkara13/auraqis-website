import { site } from "@/config/site";

/**
 * Buttons on auraqis.com/connect — the page every business-card QR code opens.
 * Add, remove or reorder entries freely. An entry with an empty `href` stays hidden until a link is filled in.
 */

export type ConnectIcon =
  | "phone"
  | "whatsapp"
  | "mail"
  | "pin"
  | "globe"
  | "grid"
  | "layers"
  | "sofa"
  | "crane"
  | "info"
  | "file"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "facebook"
  | "star";

export type ConnectLink = {
  label: string;
  hint?: string;
  href: string;
  icon: ConnectIcon;
};

export type ConnectGroup = {
  title: string;
  links: ConnectLink[];
};

const [primary, secondary] = site.phones;

/** WhatsApp chat link, e.g. "https://wa.me/917579199999". Leave empty to hide WhatsApp. */
const whatsapp = "";

export const connectQuickActions: ConnectLink[] = [
  { label: "Call", href: `tel:${primary.tel}`, icon: "phone" },
  { label: "WhatsApp", href: whatsapp, icon: "whatsapp" },
  { label: "Email", href: `mailto:${site.email}`, icon: "mail" },
  { label: "Directions", href: site.address.mapUrl, icon: "pin" },
];

export const connectGroups: ConnectGroup[] = [
  {
    title: "Get in touch",
    links: [
      { label: "Call us", hint: primary.display, href: `tel:${primary.tel}`, icon: "phone" },
      { label: "Call us (alternate line)", hint: secondary.display, href: `tel:${secondary.tel}`, icon: "phone" },
      { label: "Email us", hint: site.email, href: `mailto:${site.email}`, icon: "mail" },
      { label: "Chat on WhatsApp", hint: "Message our team", href: whatsapp, icon: "whatsapp" },
      { label: "Visit the studio", hint: `${site.address.street}, ${site.address.city}`, href: site.address.mapUrl, icon: "pin" },
    ],
  },
  {
    title: "Explore AURAQIS",
    links: [
      { label: "Website", hint: "auraqis.com", href: "/", icon: "globe" },
      { label: "Projects", hint: "Spaces we have delivered", href: "/projects", icon: "grid" },
      { label: "Interiors", hint: "Homes, workplaces & hospitality", href: "/interiors", icon: "sofa" },
      { label: "Construction", hint: "Design & build, end to end", href: "/construction", icon: "crane" },
      { label: "Services", hint: "Everything we take on", href: "/services", icon: "layers" },
      { label: "About us", hint: "Quality · Innovation · Integrity", href: "/about", icon: "info" },
    ],
  },
  {
    title: "Follow & download",
    links: [
      { label: "Company brochure", hint: "PDF download", href: "", icon: "file" },
      { label: "Instagram", hint: "Behind the scenes", href: site.instagram ?? "", icon: "instagram" },
      { label: "LinkedIn", href: "", icon: "linkedin" },
      { label: "YouTube", hint: "Project walkthroughs", href: "", icon: "youtube" },
      { label: "Facebook", href: "", icon: "facebook" },
      { label: "Review us on Google", hint: "Share your experience", href: "", icon: "star" },
    ],
  },
];

/** The "Save contact" button downloads this vCard (served by app/connect/auraqis.vcf/route.ts). */
export const connectContactCard = "/connect/auraqis.vcf";
