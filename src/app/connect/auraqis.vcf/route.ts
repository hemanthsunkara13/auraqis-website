import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/config/site";

export const dynamic = "force-static";

const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
// vCard lines longer than 75 octets must be folded with CRLF + space.
const fold = (line: string) => (line.match(/.{1,73}/gu) ?? [""]).join("\r\n ");

export async function GET() {
  const photo = (await readFile(path.join(process.cwd(), "public/brand/icon-192.png"))).toString("base64");
  const a = site.address;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${esc(site.name)};;;`,
    `FN:${esc(site.name)}`,
    `ORG:${esc(site.legalName)}`,
    `TITLE:${esc(site.descriptor)}`,
    ...site.phones.map((p) => `TEL;TYPE=WORK,VOICE:${p.tel}`),
    `EMAIL;TYPE=INTERNET,WORK:${site.email}`,
    `URL:${site.url}`,
    `ADR;TYPE=WORK:;;${esc(a.street)};${esc(a.city)};${esc(a.region)};${a.postalCode};${esc(a.country)}`,
    `NOTE:${esc(site.tagline)}`,
    `PHOTO;ENCODING=b;TYPE=PNG:${photo}`,
    "END:VCARD",
  ];
  return new Response(lines.map(fold).join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="AURAQIS.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
