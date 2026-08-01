"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV } from "@/lib/data";

export default function MobileNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="mob-nav" id="mobnav">
      {MOBILE_NAV.map(({ t, u, d }) => (
        <Link key={u} href={u} className={pathname === u ? "on" : ""}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={d} />
          </svg>
          {t}
        </Link>
      ))}
    </nav>
  );
}
