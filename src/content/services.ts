/** Services & solutions — source: company profile. Capabilities are quoted from the source material. */
export type ServiceVisual =
  | "workspace"
  | "interiors"
  | "structure"
  | "institution"
  | "hospitality"
  | "healthcare"
  | "product"
  | "smart";

export type Service = {
  slug: string;
  number: string;
  title: string;
  short: string;
  summary: string;
  capabilities: string[];
  note?: string;
  visual: ServiceVisual;
  /** Optional real photograph/poster to pair with the drawing. */
  image?: string;
};

export const services: Service[] = [
  {
    slug: "corporate-spaces",
    number: "01",
    title: "Corporate Spaces",
    short: "Complete workspace transformation",
    summary:
      "We specialise in delivering functional, efficient and future-ready workplaces — from bespoke tech-enabled design to single-point project management.",
    capabilities: [
      "Complete workspace transformation",
      "Bespoke tech-enabled design",
      "Immersive virtual 3D walkthroughs",
      "Integrated supply chain",
      "High-quality products",
      "Single point project management",
      "Statement design ideas",
      "Functional workspaces",
      "Curated client spaces",
      "Technology integration",
      "Flexibility and adaptability",
    ],
    note: "A proven track record of completing more than 1 lakh+ sq. ft. of modern corporate spaces.",
    visual: "workspace",
  },
  {
    slug: "interiors-turnkey",
    number: "02",
    title: "Interiors & Turnkey Delivery",
    short: "End-to-end home & office interiors",
    summary:
      "Transforming spaces with end-to-end design, execution and customised solutions tailored to your lifestyle — covering every detail from planning to installation for a seamless, stress-free experience.",
    capabilities: ["Modular kitchens", "Wardrobe solutions", "Custom furniture", "End-to-end home & office interiors"],
    visual: "interiors",
  },
  {
    slug: "construction-civil",
    number: "03",
    title: "Construction & Civil Works",
    short: "Residential, commercial, renovation",
    summary:
      "Structural design and execution for residential and commercial construction, renovation and redevelopment — planned and delivered end to end.",
    capabilities: ["Residential construction", "Commercial construction", "Renovation", "Redevelopment", "Structural design and execution"],
    visual: "structure",
    image: "/images/site/site-frame-01.jpg",
  },
  {
    slug: "institutional-projects",
    number: "04",
    title: "Institutional Projects",
    short: "Planned for people and purpose",
    summary: "Spaces planned around the people who use them — ergonomic, collaborative, safe and accessible.",
    capabilities: [
      "Effective space planning",
      "3D visual walkthrough",
      "Custom furniture supply",
      "Ergonomics and comfort focus",
      "Collaborative & activity spaces",
      "Safety and accessibility",
    ],
    visual: "institution",
  },
  {
    slug: "hospitality-commercial",
    number: "05",
    title: "Hotels, Coffee Shops & Commercial Spaces",
    short: "Concept, ambience and flow",
    summary: "From concept understanding and mood boards to seating, service integration and compliance.",
    capabilities: [
      "Concept understanding",
      "Functionality and flow definition",
      "Ambience and mood board creation",
      "Furniture and seating options",
      "Kitchen and service area integration",
      "Compliance and safety",
    ],
    visual: "hospitality",
  },
  {
    slug: "healthcare-spaces",
    number: "06",
    title: "Healthcare Spaces",
    short: "Patient-centred design",
    summary: "Healthcare environments designed around patients, hygiene, privacy and movement.",
    capabilities: [
      "Patient-centred approach",
      "Health controls and hygiene",
      "Compliance-centric designs",
      "Privacy and confidentiality",
      "Accessibility and movement",
    ],
    visual: "healthcare",
  },
  {
    slug: "product-design",
    number: "07",
    title: "Product Design",
    short: "Timeless interior products",
    summary:
      "Design-driven home interior solutions that blend style, function and innovation. From minimalist modern to cosy rustic, our curated products are crafted to enhance every corner of your space.",
    capabilities: ["Design-driven interior products", "Curated collections", "Minimalist modern to cosy rustic"],
    visual: "product",
  },
  {
    slug: "smart-home-systems",
    number: "08",
    title: "Smart Home Systems",
    short: "Seamless technology integration",
    summary:
      "Seamless technology integration designed for comfort, control and contemporary living — from lighting and audio to climate and energy.",
    capabilities: [
      "Smart lighting & dimming systems",
      "Voice assistants",
      "Automated blinds & curtains",
      "Multi-room audio & home theatre",
      "App-controlled home security",
      "Smart thermostats & zoning",
      "Solar-integrated systems",
      "Motion-sensor lighting",
      "Energy usage dashboards",
    ],
    visual: "smart",
  },
];

export const interiorsOffer = {
  heading: "Interiors & Turnkey Delivery",
  lead: services[1].summary,
  items: [
    { title: "Modular kitchens", body: "Kitchens planned around how you cook, store and gather." },
    { title: "Wardrobe solutions", body: "Storage designed into the architecture of the room." },
    { title: "Custom furniture", body: "Pieces made for the space they live in." },
    { title: "End-to-end home interiors", body: "One team from the first concept to the final walkthrough." },
    { title: "Office interiors", body: "Functional, future-ready workplaces." },
  ],
};

export const constructionOffer = {
  heading: "Construction & Civil Works",
  lead: "End-to-end planning through installation — structural design and execution for homes and commercial buildings.",
  items: [
    { title: "Residential construction", body: "Homes built with engineering precision and a detail-driven approach." },
    { title: "Commercial construction", body: "Signature commercial environments delivered on time and within budget." },
    { title: "Renovation", body: "Existing spaces re-planned and rebuilt for the way you live and work now." },
    { title: "Redevelopment", body: "Sites and structures re-imagined for their next life." },
    { title: "Structural design & execution", body: "From structural drawings to on-site execution, under one team." },
    { title: "Planning through installation", body: "Every detail covered from planning to installation." },
  ],
};
