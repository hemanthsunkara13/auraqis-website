/**
 * Conceptual interior (procedural prototype) — rooms, viewpoints and hotspots.
 * Coordinates are in metres in the interior scene space. Replace with a real project model by
 * matching room ids and viewpoints to the imported GLB.
 */
import type { MaterialSlotId } from "./materials";

export type RoomId =
  | "overview"
  | "living"
  | "dining"
  | "kitchen"
  | "master"
  | "bedroom2"
  | "bedroom3"
  | "bathroom"
  | "balcony";

export type Vec3 = [number, number, number];

export type Hotspot = {
  id: string;
  label: string;
  body: string;
  position: Vec3;
  slot?: MaterialSlotId;
};

export type Room = {
  id: RoomId;
  name: string;
  short: string;
  description: string;
  camera: { position: Vec3; target: Vec3; fov?: number };
  hotspots: Hotspot[];
};

export const rooms: Room[] = [
  {
    id: "overview",
    name: "Overview",
    short: "Plan",
    description: "The complete home at a glance — public spaces to the front, private rooms to the rear, opening onto a long balcony.",
    camera: { position: [0.5, 25, 18.5], target: [0, 0, 1.2], fov: 38 },
    hotspots: [],
  },
  {
    id: "living",
    name: "Living",
    short: "Living",
    description: "A calm, light-filled room anchored by a stone feature wall and opening directly to the balcony.",
    camera: { position: [0.6, 2.3, 5.3], target: [-7.5, 0.8, 2.4], fov: 50 },
    hotspots: [
      { id: "feature-wall", label: "Stone feature wall", body: "The media wall is clad in stone — select a marble to see it change.", position: [-8.85, 1.9, 3], slot: "marble" },
      { id: "sofa", label: "Lounge seating", body: "Deep, low seating in a choice of upholstery.", position: [-5.2, 0.9, 3.2], slot: "upholstery" },
      { id: "living-floor", label: "Flooring", body: "One continuous floor finish carries through the home.", position: [-4, 0.05, 1.2], slot: "floor" },
    ],
  },
  {
    id: "dining",
    name: "Dining",
    short: "Dining",
    description: "A generous table beneath a sculptural pendant, between the kitchen and the living room.",
    camera: { position: [4.4, 1.7, 5.6], target: [0.6, 0.85, 2.2], fov: 50 },
    hotspots: [
      { id: "pendant", label: "Pendant lighting", body: "Switch lighting scenes to change the mood of the room.", position: [1.5, 2.2, 3], slot: "lighting" },
      { id: "table", label: "Dining table", body: "A solid timber table — choose the wood tone.", position: [2.4, 0.85, 3.4], slot: "wood" },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    short: "Kitchen",
    description: "An open modular kitchen organised around a stone-topped island.",
    camera: { position: [2.3, 1.9, 5.9], target: [7.4, 0.9, 1.6], fov: 54 },
    hotspots: [
      { id: "island", label: "Island", body: "A stone worktop for cooking and gathering.", position: [6.5, 1.05, 3.4], slot: "marble" },
      { id: "cabinetry", label: "Cabinetry", body: "Modular fronts in a choice of finishes.", position: [8.6, 1.4, 1.5], slot: "kitchen" },
    ],
  },
  {
    id: "master",
    name: "Master Bedroom",
    short: "Master",
    description: "A quiet retreat with full-height wardrobes and a softly finished feature wall.",
    camera: { position: [-3.1, 1.65, -0.7], target: [-7.4, 0.85, -4.6], fov: 52 },
    hotspots: [
      { id: "wardrobe", label: "Wardrobe wall", body: "Full-height storage designed into the room.", position: [-8.6, 1.5, -3], slot: "wardrobe" },
      { id: "master-wall", label: "Wall finish", body: "Choose a finish for the walls.", position: [-5.8, 2.1, -5.85], slot: "wall" },
    ],
  },
  {
    id: "bedroom2",
    name: "Bedroom 02",
    short: "Bedroom 02",
    description: "A flexible bedroom with a built-in study nook.",
    camera: { position: [1.0, 1.65, -0.6], target: [3.4, 0.8, -4.8], fov: 54 },
    hotspots: [{ id: "desk", label: "Study nook", body: "A built-in desk in the chosen timber.", position: [4.5, 0.95, -2.2], slot: "wood" }],
  },
  {
    id: "bedroom3",
    name: "Bedroom 03",
    short: "Bedroom 03",
    description: "A compact bedroom with integrated wardrobe storage.",
    camera: { position: [5.5, 1.65, -0.6], target: [7.7, 0.8, -4.8], fov: 54 },
    hotspots: [{ id: "wardrobe3", label: "Integrated wardrobe", body: "Storage that sits flush with the wall.", position: [8.6, 1.4, -2], slot: "wardrobe" }],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    short: "Bath",
    description: "Stone, glass and fine metal fittings in a compact, well-planned room.",
    camera: { position: [-1.95, 1.7, -2.35], target: [-0.7, 0.95, -5.7], fov: 62 },
    hotspots: [
      { id: "fittings", label: "Fittings", body: "Taps and shower in a choice of metal finishes.", position: [-1.2, 1.25, -5.8], slot: "fittings" },
      { id: "vanity", label: "Vanity", body: "A stone vanity top — matched to the kitchen or chosen separately.", position: [-1.9, 0.95, -5.6], slot: "marble" },
    ],
  },
  {
    id: "balcony",
    name: "Balcony",
    short: "Outdoor",
    description: "A long outdoor room with planting, lounge seating and open views.",
    camera: { position: [-8.2, 1.6, 7.6], target: [1.5, 0.9, 8.4], fov: 52 },
    hotspots: [{ id: "planting", label: "Planting", body: "Planters soften the edge between inside and out.", position: [-3, 0.8, 9.1] }],
  },
];

export const roomById = (id: RoomId) => rooms.find((r) => r.id === id)!;
