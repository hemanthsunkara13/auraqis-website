"use client";

import { usePathname } from "next/navigation";

/** Hides site-wide chrome (header, footer) on standalone pages such as the QR landing page. */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname?.startsWith("/connect") ? null : <>{children}</>;
}
