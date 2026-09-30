"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import { navigation, primaryCta, site } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 480 && y > lastY.current + 4);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled && !open;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,border-color,backdrop-filter] duration-500 ease-(--ease-out-soft)",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          solid
            ? "border-b border-charcoal/10 bg-ivory/85 text-charcoal backdrop-blur-md"
            : "border-b border-transparent bg-transparent text-ivory on-dark",
        )}
      >
        <div className={cn("shell flex items-center justify-between transition-[height] duration-500", solid ? "h-16" : "h-20 md:h-24 short:h-18")}>
          <Link href="/" aria-label="AURAQIS — home" className="relative z-10">
            <Logo tone={solid ? "green" : "ivory"} showDescriptor={!solid} priority />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8 xl:gap-10">
              {navigation.slice(1).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "link-underline pb-1 text-[0.8125rem] font-medium tracking-wide transition-opacity",
                      isActive(item.href) ? "opacity-100" : "opacity-75 hover:opacity-100",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={primaryCta.href}
              className={cn(
                "hidden items-center gap-3 border px-5 py-3 text-[0.75rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-300 sm:inline-flex",
                solid
                  ? "border-charcoal bg-charcoal text-ivory hover:bg-forest hover:border-forest"
                  : "border-ivory/40 hover:bg-ivory hover:text-charcoal",
              )}
            >
              {primaryCta.label}
              <span aria-hidden className="block h-px w-4 bg-current" />
            </Link>
            <button
              ref={menuButton}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="relative z-10 flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span className={cn("absolute left-0 block h-px w-6 bg-current transition-transform duration-300", open ? "top-1.5 rotate-45" : "top-0")} />
                <span className={cn("absolute left-0 block h-px w-6 bg-current transition-transform duration-300", open ? "top-1.5 -rotate-45" : "top-3")} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="on-dark fixed inset-0 z-40 flex flex-col bg-charcoal pt-28 text-ivory lg:hidden"
          >
            <nav aria-label="Mobile" className="shell flex-1">
              <ul className="flex flex-col">
                {navigation.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-ivory/10"
                  >
                    <Link href={item.href} className="flex items-baseline justify-between py-4 text-3xl font-light tracking-tight">
                      {item.label}
                      <span className="label text-ivory/50">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="shell space-y-2 pb-10 text-sm text-ivory/70">
              <a href={`mailto:${site.email}`} className="block">{site.email}</a>
              {site.phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className="block">{p.display}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
