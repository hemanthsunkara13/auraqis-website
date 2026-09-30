import type { MaterialOption } from "@/content/materials";
import { cn } from "@/lib/utils";

/** CSS-rendered material swatch approximating the procedural 3D texture. */
export function swatchStyle(o: MaterialOption): React.CSSProperties {
  const a = o.accent ?? o.color;
  switch (o.pattern) {
    case "marble":
      return {
        backgroundColor: o.color,
        backgroundImage: `linear-gradient(115deg, transparent 38%, ${a}99 40%, transparent 43%), linear-gradient(160deg, transparent 58%, ${a}66 60%, transparent 62%), radial-gradient(circle at 30% 30%, ${a}22, transparent 60%)`,
      };
    case "wood":
      return {
        backgroundColor: o.color,
        backgroundImage: `repeating-linear-gradient(90deg, ${a}40 0 1px, transparent 1px 7px), repeating-linear-gradient(90deg, transparent 0 24%, rgba(0,0,0,0.18) 24% 25%)`,
      };
    case "fluted":
      return { backgroundColor: o.color, backgroundImage: `repeating-linear-gradient(90deg, ${a}aa 0 2px, transparent 2px 5px, rgba(255,255,255,0.15) 5px 8px)` };
    case "fabric":
      return { backgroundColor: o.color, backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 3px)` };
    case "plaster":
    case "concrete":
      return { backgroundColor: o.color, backgroundImage: `radial-gradient(circle at 20% 30%, ${a}66, transparent 40%), radial-gradient(circle at 80% 70%, ${a}55, transparent 45%)` };
    default:
      if (o.metalness > 0.5)
        return { backgroundColor: o.color, backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.45), transparent 40%, rgba(0,0,0,0.25) 80%)" };
      if (o.light) return { backgroundColor: o.color, backgroundImage: "radial-gradient(circle at 50% 40%, #fff, transparent 70%)" };
      return { backgroundColor: o.color };
  }
}

export function Swatch({ option, className }: { option: MaterialOption; className?: string }) {
  return <span aria-hidden className={cn("block", className)} style={swatchStyle(option)} />;
}
