"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { useState } from "react";
import type { ConnectGroup, ConnectLink } from "@/content/connect";
import { ConnectGlyph } from "./ConnectGlyph";

type Props = {
  quickActions: ConnectLink[];
  groups: ConnectGroup[];
  contactCard: string;
  legalName: string;
  tagline: string;
  addressLines: string[];
};

const ease = [0.22, 1, 0.36, 1] as const;
const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } };
const rise: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };

function Action({ link, className, children, label }: { link: ConnectLink; className: string; children: React.ReactNode; label?: string }) {
  if (link.href.startsWith("/")) {
    return (
      <Link href={link.href} className={className} aria-label={label}>
        {children}
      </Link>
    );
  }
  const external = /^https?:/.test(link.href);
  return (
    <a href={link.href} className={className} aria-label={label} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

export function ConnectExperience({ quickActions, groups, contactCard, legalName, tagline, addressLines }: Props) {
  const [copied, setCopied] = useState(false);
  const actions = quickActions.filter((a) => a.href);
  const sections = groups.map((g) => ({ ...g, links: g.links.filter((l) => l.href) })).filter((g) => g.links.length);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "AURAQIS", text: tagline, url });
      } catch {
        /* dismissed */
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="on-dark relative isolate min-h-svh overflow-hidden bg-forest-deep text-ivory">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_65%_at_50%_-8%,rgba(143,174,128,0.38),transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(90%_60%_at_50%_120%,rgba(168,138,88,0.18),transparent_70%)]" />
        <Image
          src="/brand/mark-ivory.png"
          alt=""
          width={767}
          height={768}
          unoptimized
          priority
          className="absolute -right-[38%] -top-[6%] w-[118%] max-w-none animate-drift opacity-[0.055] sm:-right-[20%] sm:w-[80%]"
        />
      </div>

      <motion.div
        variants={list}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex min-h-svh w-full max-w-[30rem] flex-col px-5 pt-[max(2.75rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]"
      >
        <motion.header variants={rise} className="flex flex-col items-center text-center">
          <div className="relative">
            <span className="absolute inset-0 -z-10 scale-150 rounded-full bg-sage/25 blur-2xl" aria-hidden />
            <Image src="/brand/mark-ivory.png" alt="" width={767} height={768} unoptimized priority className="h-[4.5rem] w-[4.5rem]" />
          </div>
          <h1 className="mt-5 mr-[-0.5em] font-brand text-[1.45rem] font-medium tracking-[0.5em]">AURAQIS</h1>
          <p className="label mt-2 mr-[-0.32em] text-brass">Constructions · Interiors</p>
          <p className="serif-accent mt-4 text-[1.35rem] text-ivory/75">{tagline}</p>
        </motion.header>

        <motion.div variants={rise} className="mt-9">
          <a
            href={contactCard}
            download="AURAQIS.vcf"
            className="group flex items-center gap-4 rounded-2xl bg-ivory px-4 py-3.5 text-forest-deep shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out-soft active:scale-[0.98]"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-deep text-ivory">
              <ConnectGlyph name="contact" className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-[1rem] font-semibold">Save contact</span>
              <span className="block text-[0.78rem] text-forest/70">Add AURAQIS to your phone in one tap</span>
            </span>
            <ConnectGlyph name="arrow" className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        {actions.length > 0 && (
          <motion.nav variants={rise} aria-label="Quick actions" className="mt-6 grid gap-3" style={{ gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))` }}>
            {actions.map((a) => (
              <Action key={a.label} link={a} label={a.label} className="group flex flex-col items-center gap-2">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-ivory/15 bg-ivory/[0.06] text-ivory backdrop-blur-sm transition duration-300 group-hover:border-sage-light/60 group-hover:bg-sage/25 group-active:scale-95">
                  <ConnectGlyph name={a.icon} className="h-[1.3rem] w-[1.3rem]" />
                </span>
                <span className="text-[0.72rem] font-medium tracking-wide text-ivory/80">{a.label}</span>
              </Action>
            ))}
          </motion.nav>
        )}

        {sections.map((g) => (
          <motion.section key={g.title} variants={rise} className="mt-9">
            <h2 className="label mb-3 px-1 text-sage-light">{g.title}</h2>
            <ul className="overflow-hidden rounded-3xl bg-ivory/[0.045] ring-1 ring-ivory/10 backdrop-blur-sm">
              {g.links.map((l, i) => (
                <li key={l.label} className={i ? "border-t border-ivory/[0.08]" : undefined}>
                  <Action link={l} className="group flex items-center gap-4 px-4 py-3.5 transition-colors duration-300 hover:bg-ivory/[0.06] active:bg-ivory/[0.09]">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sage/20 text-sage-light transition-colors duration-300 group-hover:bg-sage/35 group-hover:text-ivory">
                      <ConnectGlyph name={l.icon} className="h-[1.15rem] w-[1.15rem]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.95rem] font-medium">{l.label}</span>
                      {l.hint && <span className="block truncate text-[0.78rem] text-ivory/55">{l.hint}</span>}
                    </span>
                    <ConnectGlyph
                      name="arrow"
                      className="h-4 w-4 shrink-0 text-ivory/35 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ivory/80"
                    />
                  </Action>
                </li>
              ))}
            </ul>
          </motion.section>
        ))}

        <motion.div variants={rise} className="mt-9">
          <button
            type="button"
            onClick={share}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-ivory/15 px-4 py-3.5 text-[0.9rem] font-medium text-ivory/85 transition duration-300 hover:border-ivory/35 hover:bg-ivory/[0.05] active:scale-[0.98]"
          >
            <ConnectGlyph name={copied ? "check" : "share"} className="h-[1.1rem] w-[1.1rem]" />
            {copied ? "Link copied" : "Share AURAQIS with someone"}
          </button>
        </motion.div>

        <motion.footer variants={rise} className="mt-auto pt-12 text-center">
          <p className="label mr-[-0.32em] text-brass">{legalName}</p>
          <address className="mt-3 text-[0.78rem] leading-relaxed text-ivory/50 not-italic">
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </motion.footer>
      </motion.div>
    </div>
  );
}
