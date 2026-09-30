/**
 * Material library for the interior experience. Names and descriptions are aesthetic descriptions only —
 * no technical specifications. Textures are generated procedurally (see components/3d/interior/textures.ts)
 * and can be replaced with real scanned/compressed texture sets per option via `textureUrl`.
 */
import type { RoomId } from "./rooms";

export type TexturePattern = "marble" | "wood" | "plaster" | "fluted" | "fabric" | "concrete" | "none";

export type MaterialOption = {
  id: string;
  name: string;
  description: string;
  /** Swatch & base colour. */
  color: string;
  /** Secondary colour for veins / grain. */
  accent?: string;
  pattern: TexturePattern;
  roughness: number;
  metalness: number;
  /** Optional path to a real texture to replace the procedural one. */
  textureUrl?: string;
  /** Lighting slot only: light colour + intensity multiplier. */
  light?: { color: string; intensity: number };
};

export type MaterialSlotId =
  | "marble"
  | "floor"
  | "wood"
  | "kitchen"
  | "wardrobe"
  | "lighting"
  | "upholstery"
  | "wall"
  | "fittings";

export type MaterialSlot = {
  id: MaterialSlotId;
  category: string;
  where: string;
  focusRoom: RoomId;
  options: MaterialOption[];
};

export const materialSlots: MaterialSlot[] = [
  {
    id: "marble",
    category: "Marble",
    where: "Kitchen island, living feature wall and vanity",
    focusRoom: "kitchen",
    options: [
      { id: "ivory-veined", name: "Ivory Veined", description: "Soft white stone with fine grey veining — bright and timeless.", color: "#ECEAE4", accent: "#8E8E8A", pattern: "marble", roughness: 0.18, metalness: 0 },
      { id: "warm-travertine", name: "Warm Travertine", description: "Honeyed, layered stone with a quiet natural texture.", color: "#D8C7A8", accent: "#B39A74", pattern: "marble", roughness: 0.45, metalness: 0 },
      { id: "verde", name: "Verde", description: "Deep green stone with pale veining, echoing the AURAQIS mark.", color: "#2F4530", accent: "#A9BFA0", pattern: "marble", roughness: 0.16, metalness: 0 },
      { id: "nero", name: "Nero", description: "Dramatic charcoal stone with white veining.", color: "#1E201D", accent: "#CFCFCB", pattern: "marble", roughness: 0.14, metalness: 0 },
    ],
  },
  {
    id: "floor",
    category: "Flooring",
    where: "Living, dining and bedrooms",
    focusRoom: "living",
    options: [
      { id: "natural-oak", name: "Natural Oak", description: "Light, warm planks that keep rooms calm and open.", color: "#C9A77C", accent: "#A9855A", pattern: "wood", roughness: 0.55, metalness: 0 },
      { id: "smoked-walnut", name: "Smoked Walnut", description: "Deep, rich tones for a grounded, intimate feel.", color: "#5E4330", accent: "#3F2B1E", pattern: "wood", roughness: 0.5, metalness: 0 },
      { id: "stone-tile", name: "Stone Tile", description: "Large-format stone-look tiles in a soft warm grey.", color: "#C8C3B7", accent: "#B2AC9F", pattern: "concrete", roughness: 0.4, metalness: 0 },
      { id: "micro-cement", name: "Micro-cement", description: "A seamless, minimal surface with subtle movement.", color: "#9D9A92", accent: "#8A877F", pattern: "concrete", roughness: 0.65, metalness: 0 },
    ],
  },
  {
    id: "wood",
    category: "Wood",
    where: "Dining table, media unit and bed frames",
    focusRoom: "dining",
    options: [
      { id: "oak", name: "Oak", description: "Honest, light grain — Scandinavian calm.", color: "#C29A6B", accent: "#9C774C", pattern: "wood", roughness: 0.5, metalness: 0 },
      { id: "walnut", name: "Walnut", description: "Dark, figured grain with a refined presence.", color: "#6B4A33", accent: "#4A3222", pattern: "wood", roughness: 0.45, metalness: 0 },
      { id: "teak-tone", name: "Teak Tone", description: "Warm golden-brown timber tone.", color: "#9A6B3F", accent: "#74502D", pattern: "wood", roughness: 0.5, metalness: 0 },
      { id: "ash-white", name: "White Ash", description: "Pale, almost silvery timber for a light palette.", color: "#DCD3C4", accent: "#C0B4A0", pattern: "wood", roughness: 0.55, metalness: 0 },
    ],
  },
  {
    id: "kitchen",
    category: "Kitchen Finishes",
    where: "Kitchen cabinetry",
    focusRoom: "kitchen",
    options: [
      { id: "sage-matte", name: "Sage Matte", description: "Muted green matte fronts — soft and natural.", color: "#7E9A70", pattern: "none", roughness: 0.8, metalness: 0 },
      { id: "charcoal-matte", name: "Charcoal Matte", description: "Deep, architectural and understated.", color: "#2A2D28", pattern: "none", roughness: 0.75, metalness: 0 },
      { id: "ivory-lacquer", name: "Ivory Lacquer", description: "A soft sheen that reflects light around the room.", color: "#E6E2D8", pattern: "none", roughness: 0.25, metalness: 0 },
      { id: "walnut-veneer", name: "Walnut Veneer", description: "Warm timber fronts with a natural figure.", color: "#6B4A33", accent: "#4A3222", pattern: "wood", roughness: 0.45, metalness: 0 },
    ],
  },
  {
    id: "wardrobe",
    category: "Wardrobes",
    where: "Master bedroom and bedrooms",
    focusRoom: "master",
    options: [
      { id: "fluted-oak", name: "Fluted Oak", description: "Vertical fluting that plays with light and shadow.", color: "#C29A6B", accent: "#8E6B45", pattern: "fluted", roughness: 0.55, metalness: 0 },
      { id: "stone-matte", name: "Stone Matte", description: "Calm, warm grey fronts that recede into the wall.", color: "#BDB7AA", pattern: "none", roughness: 0.8, metalness: 0 },
      { id: "forest", name: "Forest", description: "Deep green fronts for a rich, enveloping room.", color: "#2F4530", pattern: "none", roughness: 0.7, metalness: 0 },
      { id: "ivory-fluted", name: "Ivory Fluted", description: "Soft ivory with fine vertical rhythm.", color: "#E3DED3", accent: "#BDB6A7", pattern: "fluted", roughness: 0.6, metalness: 0 },
    ],
  },
  {
    id: "lighting",
    category: "Lighting",
    where: "Ambient and pendant lighting across the home",
    focusRoom: "dining",
    options: [
      { id: "warm", name: "Warm Glow", description: "Soft, amber-leaning light for relaxed evenings.", color: "#FFC98F", pattern: "none", roughness: 1, metalness: 0, light: { color: "#FFC98F", intensity: 1 } },
      { id: "neutral", name: "Neutral White", description: "Balanced light for everyday living.", color: "#FFF1DD", pattern: "none", roughness: 1, metalness: 0, light: { color: "#FFF1DD", intensity: 1.1 } },
      { id: "daylight", name: "Daylight", description: "Crisp and bright, for focused work.", color: "#E9F0FF", pattern: "none", roughness: 1, metalness: 0, light: { color: "#E9F0FF", intensity: 1.25 } },
      { id: "dimmed", name: "Evening Dim", description: "A low, intimate scene.", color: "#E8A36A", pattern: "none", roughness: 1, metalness: 0, light: { color: "#E8A36A", intensity: 0.45 } },
    ],
  },
  {
    id: "upholstery",
    category: "Furniture",
    where: "Sofa, dining chairs and bed linen",
    focusRoom: "living",
    options: [
      { id: "oat-boucle", name: "Oat Bouclé", description: "Textured, cloud-soft oatmeal.", color: "#D6CCBA", accent: "#C4B9A5", pattern: "fabric", roughness: 0.95, metalness: 0 },
      { id: "sage-linen", name: "Sage Linen", description: "Relaxed linen in muted green.", color: "#8FA784", accent: "#7F9674", pattern: "fabric", roughness: 0.95, metalness: 0 },
      { id: "charcoal-wool", name: "Charcoal Wool", description: "Tailored and deep.", color: "#3A3D38", accent: "#2F322D", pattern: "fabric", roughness: 0.95, metalness: 0 },
      { id: "terracotta", name: "Terracotta", description: "Earthy warmth for a statement piece.", color: "#A8613F", accent: "#934F31", pattern: "fabric", roughness: 0.9, metalness: 0 },
    ],
  },
  {
    id: "wall",
    category: "Wall Finishes",
    where: "Walls throughout",
    focusRoom: "living",
    options: [
      { id: "warm-ivory", name: "Warm Ivory", description: "A soft, light-reflecting backdrop.", color: "#E7E3DA", pattern: "none", roughness: 0.9, metalness: 0 },
      { id: "lime-plaster", name: "Lime Plaster", description: "Hand-finished, gently clouded texture.", color: "#D6CFC1", accent: "#C7BFAF", pattern: "plaster", roughness: 0.95, metalness: 0 },
      { id: "sage-wash", name: "Sage Limewash", description: "A calm green wash with natural depth.", color: "#A7B79B", accent: "#95A889", pattern: "plaster", roughness: 0.95, metalness: 0 },
      { id: "charcoal", name: "Charcoal", description: "Dramatic and enveloping.", color: "#34372F", accent: "#2B2E27", pattern: "plaster", roughness: 0.9, metalness: 0 },
    ],
  },
  {
    id: "fittings",
    category: "Bathroom Fittings",
    where: "Taps, shower and accessories",
    focusRoom: "bathroom",
    options: [
      { id: "brushed-brass", name: "Brushed Brass", description: "Warm metal with a soft brushed finish.", color: "#B89560", pattern: "none", roughness: 0.35, metalness: 1 },
      { id: "matte-black", name: "Matte Black", description: "Graphic and contemporary.", color: "#1D1E1C", pattern: "none", roughness: 0.6, metalness: 0.4 },
      { id: "chrome", name: "Polished Chrome", description: "Bright, reflective and classic.", color: "#D9DCDF", pattern: "none", roughness: 0.08, metalness: 1 },
      { id: "gunmetal", name: "Gunmetal", description: "Dark, smoky metal with depth.", color: "#55585A", pattern: "none", roughness: 0.3, metalness: 1 },
    ],
  },
];

export const defaultMaterialSelection = Object.fromEntries(
  materialSlots.map((s) => [s.id, s.options[0].id]),
) as Record<MaterialSlotId, string>;

export function getMaterialOption(slot: MaterialSlotId, optionId: string): MaterialOption {
  const s = materialSlots.find((m) => m.id === slot)!;
  return s.options.find((o) => o.id === optionId) ?? s.options[0];
}
