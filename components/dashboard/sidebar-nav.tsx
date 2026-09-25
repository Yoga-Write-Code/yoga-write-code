"use client";

import {
  BarChart3,
  FileText,
  LayoutGrid,
  Search,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type ProjectNavItem = {
  id: string;
  name: string;
};

function NavItem({
  href,
  label,
  icon: Icon,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active =
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={
        active
          ? "flex items-center gap-2.5 rounded-control bg-brand-soft px-3 py-2 text-sm font-medium text-brand"
          : "flex items-center gap-2.5 rounded-control px-3 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink"
      }
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1 px-4">
      <NavItem href="/dashboard" label="Overview" icon={LayoutGrid} onNavigate={onNavigate} />
      <NavItem href="/dashboard/seo" label="Opportunities" icon={Search} onNavigate={onNavigate} />
      <NavItem href="/dashboard/content" label="Drafts & Editor" icon={FileText} onNavigate={onNavigate} />
      <NavItem href="/dashboard/analytics" label="Analytics" icon={BarChart3} onNavigate={onNavigate} />
    </nav>
  );
}

const PROJECT_SECTIONS = [
  ["#analysis", "01 · Analysis"],
  ["#opportunities", "02 · Opportunities"],
  ["#cluster", "03 · Topic cluster"],
  ["#brief", "04 · SEO brief"],
  ["#outline", "05 · Outline"],
] as const;

export function ProjectSectionNav({ projects = [] }: { projects?: ProjectNavItem[] }) {
  const pathname = usePathname();
  const match = pathname.match(/^\/dashboard\/projects\/([^/]+)(?:\/editor)?\/?$/);
  if (!match) return null;

  const projectId = match[1];
  const project = projects.find((item) => item.id === projectId);
  const projectName = project?.name?.trim() || "This project";
  const projectPath = `/dashboard/projects/${projectId}`;

  return (
    <div className="mt-6 px-4">
      <p
        title={projectName}
        className="truncate px-3 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted"
      >
        {projectName}
      </p>
      <nav className="mt-2 space-y-1">
        {PROJECT_SECTIONS.map(([href, label]) => (
          <a
            key={href}
            href={pathname.includes("/editor") ? `${projectPath}${href}` : href}
            className="block rounded-control px-3 py-1.5 text-sm text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink"
          >
            {label}
          </a>
        ))}
        <Link
          href={`${projectPath}/editor`}
          className="block rounded-control px-3 py-1.5 text-sm text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink"
        >
          Editor
        </Link>
      </nav>
    </div>
  );
}

export function SettingsNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="mt-6 space-y-1 px-4">
      <NavItem href="/dashboard/settings" label="Settings" icon={Settings} onNavigate={onNavigate} />
    </nav>
  );
}