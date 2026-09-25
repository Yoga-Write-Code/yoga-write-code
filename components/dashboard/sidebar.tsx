import { ProjectSectionNav, SettingsNav, SidebarNav, type ProjectNavItem } from "./sidebar-nav";
import { SignOut } from "./sign-out";
import { UserProfile } from "./user-profile";
import { Wordmark } from "./wordmark";

export function SidebarBody({
  email,
  projects,
  onNavigate,
}: {
  email?: string;
  projects?: ProjectNavItem[];
  onNavigate?: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        <SidebarNav onNavigate={onNavigate} />
        <ProjectSectionNav projects={projects} />
        <SettingsNav onNavigate={onNavigate} />
      </div>
      <div className="shrink-0 border-t border-line px-4 py-4">
        <UserProfile email={email} />
        <SignOut />
      </div>
    </div>
  );
}

export function Sidebar({
  email,
  projects,
}: {
  email?: string;
  projects?: ProjectNavItem[];
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-surface lg:flex">
      <div className="px-6 pb-8 pt-7">
        <Wordmark />
      </div>
      <SidebarBody email={email} projects={projects} />
    </aside>
  );
}