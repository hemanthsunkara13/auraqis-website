/** Customer journey — source: company profile, “Journey to your dream spaces”. */
export type JourneyStep = {
  number: string;
  title: [string, string];
  lead: string;
  body: string;
  visual: "consult" | "quote" | "blueprint" | "manufacture" | "install";
};

export const journey: JourneyStep[] = [
  {
    number: "01",
    title: ["Consult", "Curate"],
    lead: "Your journey to perfection begins here.",
    body: "Our experts understand your style and needs to turn your ideas into detailed concepts that form the foundation of your home’s transformation.",
    visual: "consult",
  },
  {
    number: "02",
    title: ["Clarity", "Quote"],
    lead: "Transparency drives our process.",
    body: "You receive a detailed estimate outlining design specifics and costs, giving you a clear understanding of your investment and setting a confident path for the beautiful changes ahead.",
    visual: "quote",
  },
  {
    number: "03",
    title: ["Blueprint", "Personalize"],
    lead: "Forging partnership — delving into the design specifics.",
    body: "In this collaborative stage, we select materials and refine layouts to personalize your space, and you can book your project with an initial payment to begin.",
    visual: "blueprint",
  },
  {
    number: "04",
    title: ["Manufacturing", "Mastery"],
    lead: "The approved designs come to life.",
    body: "Over the next 30 days, advanced manufacturing ensures every component of your project is crafted with precision and top-quality standards.",
    visual: "manufacture",
  },
  {
    number: "05",
    title: ["Install", "Inaugurate"],
    lead: "The final step — the flawless finish.",
    body: "Our team manages installation within 2 weeks, ensuring a smooth finish and a detailed walkthrough so every element meets your expectations to inaugurate.",
    visual: "install",
  },
];
