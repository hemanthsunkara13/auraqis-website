import type { ConnectIcon } from "@/content/connect";

type Props = { name: ConnectIcon | "contact" | "share" | "arrow" | "check"; className?: string };

const paths: Record<Props["name"], React.ReactNode> = {
  phone: <path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.9 6.9l1.3-2 4 1.6V19a1.8 1.8 0 0 1-1.9 1.8A16.4 16.4 0 0 1 3.2 5.9 1.8 1.8 0 0 1 5 4Z" />,
  whatsapp: (
    <>
      <path d="M4.3 19.7 5.4 16A8.3 8.3 0 1 1 8.2 18.7Z" />
      <path d="M9.4 8.6c.2-.5.6-.5.9-.5h.4c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.6 1.1 1.4 1.9 2.5 2.5l.6-.5c.2-.2.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.4c0 .3 0 .7-.5.9-.6.3-1.6.5-3.1-.2a8.6 8.6 0 0 1-3.8-3.8c-.7-1.5-.5-2.5-.2-3.1Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.2-3.6-8.5S9.6 5.9 12 3.5Z" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </>
  ),
  layers: <path d="m12 4 8.5 4.5L12 13 3.5 8.5 12 4Zm-8.5 8L12 16.5l8.5-4.5M3.5 15.5 12 20l8.5-4.5" />,
  sofa: (
    <>
      <path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11" />
      <path d="M3.5 12.5a1.5 1.5 0 0 1 3 0V14h11v-1.5a1.5 1.5 0 0 1 3 0V17a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-4.5ZM6 18v1.5M18 18v1.5" />
    </>
  ),
  crane: <path d="M5 20.5V5h3v15.5M3.5 20.5h8M8 5h12.5L8 9M15 5v3.5M15 11.5a1.5 1.5 0 1 1-1.5 1.5M5 9h3M5 13h3" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.6v.1" />
    </>
  ),
  file: (
    <>
      <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3.5V8h4.5M12 11v6M9.5 14.5 12 17l2.5-2.5" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M16.8 7.3v.1" />
    </>
  ),
  linkedin: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M8.3 10.5v5.5M8.3 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6s2 .9 2 2.6v3" />
    </>
  ),
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="m10.5 9.5 4 2.5-4 2.5Z" />
    </>
  ),
  facebook: <path d="M13.5 20.5v-7h2.4l.4-2.8h-2.8V9c0-.8.3-1.4 1.4-1.4h1.5V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.6 1.3-3.6 3.7v2H8.2v2.8h2.4v7" />,
  star: <path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6L12 4Z" />,
  contact: (
    <>
      <circle cx="10" cy="8.5" r="3.5" />
      <path d="M3.5 19.5a6.5 6.5 0 0 1 13 0M18.5 8v6M15.5 11h6" />
    </>
  ),
  share: <path d="M12 15V3.5M8 7.5l4-4 4 4M5.5 11.5v7a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-7" />,
  arrow: <path d="M8 16 16 8M9.5 8H16v6.5" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
};

export function ConnectGlyph({ name, className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {paths[name]}
    </svg>
  );
}
