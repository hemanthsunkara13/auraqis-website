import Image from "next/image";
import Link from "next/link";
import { navigation, site } from "@/config/site";
import { services } from "@/content/services";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-charcoal text-ivory">
      <div className="shell pt-24 pb-10 md:pt-32">
        <div className="grid-arch gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <p className="label text-sage-light">{site.tagline}</p>
            <p className="display mt-6 max-w-md text-4xl md:text-5xl">
              Let’s bring your <span className="serif-accent">vision</span> to life.
            </p>
            <div className="mt-10 space-y-2 text-lg font-light">
              <a href={`mailto:${site.email}`} className="link-underline block w-fit">{site.email}</a>
              {site.phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className="link-underline block w-fit">{p.display}</a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer" className="col-span-6 lg:col-span-2 lg:col-start-7">
            <p className="label text-ivory/60">Explore</p>
            <ul className="mt-6 space-y-3 text-sm">
              {navigation.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-underline text-ivory/85 hover:text-ivory">{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 lg:col-span-3">
            <p className="label text-ivory/60">Services</p>
            <ul className="mt-6 space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className="link-underline text-ivory/85 hover:text-ivory">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-1">
            <p className="label text-ivory/60">Social</p>
            <div className="mt-6 text-sm">
              {site.instagram ? (
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link-underline">Instagram</a>
              ) : (
                <span className="text-ivory/60">Instagram — coming soon</span>
              )}
            </div>
          </div>
        </div>

        <div className="relative mt-24 flex items-end gap-6 border-t border-ivory/10 pt-10 md:mt-32">
          <Image src="/brand/mark-ivory.png" alt="" width={160} height={160} unoptimized className="h-20 w-20 opacity-90 md:h-28 md:w-28" />
          <p aria-hidden className="font-brand text-[13vw] leading-[0.8] font-semibold tracking-[0.18em] text-ivory/[0.07] select-none md:text-[10vw]">
            AURAQIS
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 text-xs text-ivory/55 md:flex-row">
          <p>© {year} {site.legalName}. All rights reserved.</p>
          <p className="font-brand tracking-[0.3em] uppercase">{site.descriptor}</p>
          <a href={site.url} className="hover:text-ivory">auraqis.com</a>
        </div>
      </div>
    </footer>
  );
}
