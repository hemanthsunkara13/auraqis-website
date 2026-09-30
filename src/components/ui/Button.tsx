import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";
type Tone = "dark" | "light";

const base =
  "group inline-flex items-center gap-4 px-6 py-4 text-[0.75rem] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 ease-(--ease-out-soft)";

function classes(variant: Variant, tone: Tone) {
  if (variant === "solid")
    return tone === "light"
      ? "bg-ivory text-charcoal hover:bg-sage hover:text-ivory"
      : "bg-charcoal text-ivory hover:bg-forest";
  if (variant === "outline")
    return tone === "light"
      ? "border border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory/10"
      : "border border-charcoal/30 text-charcoal hover:border-charcoal hover:bg-charcoal/5";
  return tone === "light" ? "px-0 text-ivory" : "px-0 text-charcoal";
}

function Arrow() {
  return (
    <span aria-hidden className="relative block h-px w-6 overflow-hidden bg-current/30">
      <span className="absolute inset-0 origin-left scale-x-50 bg-current transition-transform duration-500 group-hover:scale-x-100" />
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
  tone = "dark",
  className,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  tone?: Tone;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = cn(base, classes(variant, tone), className);
  const external = href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http");
  if (external)
    return (
      <a href={href} className={cls} {...rest}>
        {children}
        <Arrow />
      </a>
    );
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
      <Arrow />
    </Link>
  );
}

export function Button({
  children,
  variant = "solid",
  tone = "dark",
  className,
  ...rest
}: { variant?: Variant; tone?: Tone } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cn(base, classes(variant, tone), className)} {...rest}>
      {children}
      <Arrow />
    </button>
  );
}
