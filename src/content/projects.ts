/**
 * Projects. No real project information has been supplied yet, so entries are either:
 *  - "site-journal": real, supplied construction footage/photos (no invented names, locations, dates or clients), or
 *  - "concept": the procedural 3D prototype, clearly labelled as conceptual.
 * To add a real project, append an entry with kind "project" and fill in only verified fields.
 * Optional fields are only rendered when present.
 */
import type { MaterialSlotId } from "./materials";

export type ProjectKind = "project" | "site-journal" | "concept";

export type ProjectMedia =
  | { type: "image"; src: string; alt: string; aspect?: "portrait" | "landscape" }
  | { type: "video"; src: string; poster: string; alt: string };

export type Project = {
  slug: string;
  kind: ProjectKind;
  title: string;
  category: string;
  summary: string;
  description: string[];
  /** Omit to use the architectural drawing cover. */
  cover?: { src: string; alt: string };
  services: string[];
  gallery: ProjectMedia[];
  journey?: { title: string; body: string; media?: ProjectMedia }[];
  materials?: MaterialSlotId[];
  /** Show the V2 build and step-inside films on the project page. */
  hasFilm?: boolean;
  // Verified fields only — leave undefined until supplied.
  location?: string;
  year?: string;
  area?: string;
  client?: string;
};

const v = (id: string, alt: string): ProjectMedia => ({ type: "video", src: `/videos/${id}.mp4`, poster: `/videos/${id}.jpg`, alt });
const img = (id: string, alt: string, aspect: "portrait" | "landscape" = "landscape"): ProjectMedia => ({
  type: "image",
  src: `/images/site/${id}.jpg`,
  alt,
  aspect,
});

const still = (id: string, alt: string): ProjectMedia => ({ type: "image", src: `/media/stills/${id}.jpg`, alt });
const film = (id: string, alt: string): ProjectMedia => ({ type: "video", src: `/media/video/${id}-720.mp4`, poster: `/media/video/${id}.jpg`, alt });

export const projects: Project[] = [
  {
    slug: "concept-residence",
    kind: "concept",
    title: "Concept Residence",
    category: "Residential · Construction + Interiors",
    summary: "A cinematic concept visualisation of how AURAQIS takes a home from blueprint to finished interior.",
    description: [
      "This residence is a conceptual design visualised with AI-generated imagery for this website, to illustrate the AURAQIS process. It is not a built project.",
      "Follow the build from blueprint to dusk, then walk through the pivot door into the rooms and finishes.",
    ],
    cover: { src: "/media/stills/ext-09.jpg", alt: "The concept residence at dusk" },
    services: ["Construction & Civil Works", "Interiors & Turnkey Delivery", "Smart Home Systems"],
    gallery: [
      still("ext-00", "The completed residence at golden hour"),
      still("ext-10", "The entrance and teak pivot door at dusk"),
      still("int-01", "Living room with marble feature wall"),
      film("kitchen", "Walking from the dining area into the kitchen"),
      still("int-02", "Dining area beneath pendant lights"),
      still("int-03", "Kitchen with marble island and sage cabinetry"),
      film("bedroom", "Master bedroom in soft daylight"),
      still("int-07", "Bathroom with marble and brushed brass"),
      still("int-08", "Covered balcony overlooking the pool"),
    ],
    materials: ["marble", "floor", "wood", "kitchen", "wardrobe", "lighting", "upholstery", "wall", "fittings"],
    hasFilm: true,
  },
  {
    slug: "site-journal-stone-and-earth",
    kind: "site-journal",
    title: "Site Journal — Stone & Earth",
    category: "Construction · Site record",
    summary: "Real footage of retaining walls and stonework being laid by hand, beside a finished multi-storey facade.",
    description: [
      "Unedited site footage documenting stone masonry and ground works.",
      "Every building rests on work like this — careful, manual and rarely seen once the project is complete.",
    ],
    cover: { src: "/videos/stonework-retaining.jpg", alt: "Workers laying stone retaining walls on site" },
    services: ["Construction & Civil Works"],
    gallery: [
      v("stonework-foundation", "Stone retaining wall being laid by hand"),
      v("stonework-retaining", "Workers carrying stone along the retaining wall"),
      v("stonework-hands", "Stonework at the base of a building under construction"),
      v("facade-rise", "Camera rising from the stone base to the upper floors"),
    ],
    journey: [
      { title: "Ground work", body: "Stone is set course by course to form the retaining edge.", media: v("stonework-hands", "Stonework in progress") },
      { title: "Base to facade", body: "The masonry base meets the building above.", media: v("facade-rise", "Facade above the stone base") },
    ],
  },
  {
    slug: "site-journal-steel-and-brick",
    kind: "site-journal",
    title: "Site Journal — Steel & Brick",
    category: "Construction · Site record",
    summary: "Steel framing, decking and brick arches rising within bamboo scaffolding.",
    description: [
      "Unedited site footage documenting structural steel, roof decking and brick arch construction.",
      "Scaffolding, steel and hand-laid brick — the structure before the finish.",
    ],
    cover: { src: "/videos/scaffold-arches.jpg", alt: "Brick arches within scaffolding" },
    services: ["Construction & Civil Works"],
    gallery: [
      v("steel-columns", "Steel columns and decking sheets on site"),
      v("steel-roof", "Looking up through steel roof framing"),
      v("scaffold-arches", "Brick arches rising within scaffolding"),
      v("scaffold-canopy", "Scaffolding beneath a tree canopy"),
      v("scaffold-crew", "Crew working across the facade"),
      v("brick-arches", "Exposed brick arches"),
      v("site-team", "Team reviewing work on site"),
    ],
    journey: [
      { title: "Structure", body: "Steel columns and decking define the frame.", media: v("steel-columns", "Steel columns") },
      { title: "Masonry", body: "Brick arches are built within the scaffold.", media: v("scaffold-arches", "Brick arches") },
      { title: "On site", body: "Details are reviewed together, on site.", media: v("site-team", "Team on site") },
    ],
  },
  {
    slug: "site-journal-residential-frame",
    kind: "site-journal",
    title: "Site Journal — Residential Frame",
    category: "Construction · Site record",
    summary: "A multi-storey residential concrete frame, with masonry and window frames in progress.",
    description: ["Site photographs documenting a residential concrete frame at the masonry and window-frame stage."],
    cover: { src: "/images/site/site-frame-01.jpg", alt: "Residential concrete frame with scaffolding" },
    services: ["Construction & Civil Works"],
    gallery: [
      img("site-frame-01", "Residential frame with scaffolding"),
      img("site-frame-02", "Frame with window openings and brickwork"),
      img("site-frame-03", "Upper floors with window frames installed"),
      img("site-frame-04", "Full-height view of the residential frame", "portrait"),
      img("site-frame-05", "Close view of a floor under construction"),
    ],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
