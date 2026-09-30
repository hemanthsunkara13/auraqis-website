import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  tone?: "green" | "ivory" | "charcoal";
  showDescriptor?: boolean;
  className?: string;
  markClassName?: string;
  priority?: boolean;
};

/** AURAQIS mark (from the supplied logo) with a typeset wordmark matching the logo’s rounded geometric letterforms. */
export function Logo({ tone = "green", showDescriptor = false, className, markClassName, priority }: Props) {
  const textColor = tone === "ivory" ? "text-ivory" : tone === "charcoal" ? "text-charcoal" : "text-sage";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src={`/brand/mark-${tone}.png`}
        alt=""
        width={96}
        height={96}
        unoptimized
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={cn("h-9 w-9 shrink-0 object-contain", markClassName)}
      />
      <span className={cn("flex flex-col leading-none", textColor)}>
        <span className="font-brand text-[1.05rem] font-semibold tracking-[0.42em]">AURAQIS</span>
        {showDescriptor && (
          <span className="mt-1.5 font-brand text-[0.55rem] font-semibold tracking-[0.34em] opacity-80">
            CONSTRUCTIONS · INTERIORS
          </span>
        )}
      </span>
      <span className="sr-only">AURAQIS Private Limited</span>
    </span>
  );
}
