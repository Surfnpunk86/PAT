"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Fab() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  if (pathname?.startsWith("/mente-real/chat")) return null;
  return (
    <Link href="/mente-real/chat" className="fab" id="fab" aria-label="Hablar con PAT IA">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.1A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z" />
      </svg>
    </Link>
  );
}
