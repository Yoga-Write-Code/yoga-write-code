"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "How it works", href: "/#how" },
  { label: "Live demo", href: "/#demo" },
  { label: "Features", href: "/#features" },
  { label: "About", href: "/about" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-control p-2 text-ink-secondary transition-colors hover:bg-surface-subtle"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open ? (
        <>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-[68px] z-40 bg-ink/30"
          />
          <nav className="absolute inset-x-0 top-full z-50 border-b border-line bg-surface px-5 py-4 shadow-pop">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex gap-2.5 border-t border-line pt-4">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-control border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="rounded-control bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-pop"
              >
                Try it free
              </Link>
            </div>
          </nav>
        </>
      ) : null}
    </div>
  );
}
