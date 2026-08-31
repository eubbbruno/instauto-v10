"use client";

import Link from "next/link";
import { trackCtaClick } from "@/lib/analytics";

/**
 * Link de CTA que dispara o evento ClickCTA (Meta/GA) antes de navegar.
 * Usado nas páginas server-component (ex.: /para-oficinas) onde não há onClick.
 */
export default function TrackedCtaLink({
  href,
  location,
  className,
  children,
}: {
  href: string;
  location: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => trackCtaClick(location)}>
      {children}
    </Link>
  );
}
