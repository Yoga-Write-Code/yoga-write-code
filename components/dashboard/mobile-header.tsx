"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SidebarBody } from "./sidebar";
import type { ProjectNavItem } from "./sidebar-nav";
import { Wordmark } from "./wordmark";

export function MobileHeader({
  name,
  email,
  projects,
}: {
  name?: string;
  email?: string;
  projects?: ProjectNavItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-surface px-5 py-3 lg:hidden">
        <Wordmark />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-control p-2 text-ink-secondary transition-colors hover:bg-surface-subtle"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-surface shadow-pop">
            <div className="flex items-center justify-between px-6 pb-6 pt-5">
              <Wordmark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-control p-2 text-ink-secondary transition-colors hover:bg-surface-subtle"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarBody
              name={name}
              email={email}
              projects={projects}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}