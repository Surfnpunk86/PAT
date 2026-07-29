"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/data";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="hdr">
      <div className="hdr-in">
        <Link href="/" className="logo" aria-label="PAT inicio">
          <span className="logo-mark">
            <span>P</span>
          </span>
          <span className="logo-word">
            People
            <br />
            Are Talking
          </span>
        </Link>

        <nav className={`nav ${open ? "open" : ""}`} id="nav">
          {NAV.map(([t, u]) => (
            <Link
              key={u}
              href={u}
              className={pathname === u ? "on" : ""}
              onClick={() => setOpen(false)}
            >
              {t}
            </Link>
          ))}
        </nav>

        <div className="hdr-act">
          <Link href="/comunidad" className="btn btn-y btn-sm">
            Únete
          </Link>
          <Link href="/mente-real/chat" className="btn btn-o btn-sm">
            Habla con PAT IA
          </Link>
          <button
            className="burger"
            id="burger"
            aria-label="Menú"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <i></i>
            <i></i>
            <i></i>
          </button>
        </div>
      </div>
    </header>
  );
}
