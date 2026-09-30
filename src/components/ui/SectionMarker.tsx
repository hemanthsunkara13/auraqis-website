import { cn } from "@/lib/utils";

/** Section marker: "03 — Blueprint → Reality" with a hairline. */
export function SectionMarker({ number, label, className }: { number?: string; label: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {number && <span className="label tabular-nums">{number}</span>}
      <span aria-hidden className="h-px w-10 bg-current opacity-40" />
      <span className="label opacity-80">{label}</span>
    </div>
  );
}
