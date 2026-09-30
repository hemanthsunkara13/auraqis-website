import { still } from "@/lib/media";

/** Build sequence chapters, keyed to progress through the 180-frame build (0–1). */
export const buildChapters = [
  { id: "blueprint", at: 0, label: "Blueprint", title: "It begins as a line.", body: "Every AURAQIS home starts on paper — a precise plan, drawn to the site." },
  { id: "plot", at: 0.1, label: "Site", title: "Set out on the land.", body: "The plan is transferred to the plot, and the footprint is marked out on the ground." },
  { id: "structure", at: 0.27, label: "Structure", title: "The frame rises.", body: "Foundations, columns, beams and slabs — the structure everything else depends on." },
  { id: "walls", at: 0.42, label: "Walls", title: "Volume and rooms.", body: "Masonry closes the frame and the spaces of the home take shape." },
  { id: "facade", at: 0.56, label: "Facade", title: "A considered skin.", body: "Stone at the base, timber above and generous glazing give the house its character." },
  { id: "landscape", at: 0.75, label: "Landscape", title: "Rooted in its garden.", body: "Lawn, trees and a long pool settle the architecture into its site." },
  { id: "dusk", at: 0.92, label: "Complete", title: "Where vision meets craftsmanship.", body: "A finished home, lit from within — ready to be lived in." },
] as const;

export const enterChapters = [
  { at: 0, label: "Arrival", title: "The approach.", body: "A lit garden path leads to a tall timber pivot door." },
  { at: 0.11, label: "Threshold", title: "The door opens.", body: "Stone, timber and warm light — the first impression of the interior." },
  { at: 0.25, label: "Foyer", title: "Step inside.", body: "A calm transition from the garden to the rooms beyond." },
  { at: 0.42, label: "Living", title: "Room to breathe.", body: "Marble, oak and soft light, opening onto the garden." },
] as const;

/** Room gallery (stills from the concept residence). Descriptions describe the imagery only. */
export const v2Rooms = [
  { id: "living", name: "Living", image: still("int-01"), body: "A marble feature wall, low deep seating and full-height glazing to the garden." },
  { id: "dining", name: "Dining", image: still("int-02"), body: "An oak table for gathering beneath a row of warm pendant lights." },
  { id: "kitchen", name: "Kitchen", image: still("int-03"), body: "An open modular kitchen around a marble island, in muted sage and brass." },
  { id: "master", name: "Master Bedroom", image: still("int-04"), body: "Fluted oak wardrobes, soft linen and filtered daylight." },
  { id: "bedroom2", name: "Bedroom 02", image: still("int-05"), body: "A calm bedroom with a study desk by the window." },
  { id: "bedroom3", name: "Bedroom 03", image: still("int-06"), body: "A quiet guest room with a lime-plaster wall and a reading corner." },
  { id: "bath", name: "Bathroom", image: still("int-07"), body: "Marble, glass and brushed-brass fittings." },
  { id: "balcony", name: "Balcony", image: still("int-08"), body: "A long covered outdoor room overlooking the garden and pool." },
] as const;

/** Material close-ups: crops into the concept imagery. `focus` is the object-position of the crop. */
export const details = [
  { name: "Marble", note: "Feature walls, islands and vanities", image: still("sl-01"), focus: "14% 45%" },
  { name: "Timber", note: "Pivot doors, fins and fluted joinery", image: still("ext-10"), focus: "50% 58%" },
  { name: "Oak & linen", note: "Wardrobes, floors and soft furnishing", image: still("int-04"), focus: "10% 55%" },
  { name: "Stone", note: "Cladding, thresholds and floors", image: still("ext-10"), focus: "30% 45%" },
  { name: "Light", note: "Scenes designed for every hour", image: still("ext-09"), focus: "55% 45%" },
] as const;
