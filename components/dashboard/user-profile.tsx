export function UserProfile({ name, email }: { name?: string; email?: string }) {
  const label = name?.trim() || email?.split("@")[0] || "Your account";
  const initials = label
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="flex w-full items-center gap-3 rounded-md px-2 py-2">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-stone-900 text-[11px] font-medium text-stone-50">
        {initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-stone-900">{label}</span>
        <span className="block truncate text-xs text-stone-500">
          {email ?? "Not signed in"}
        </span>
      </span>
    </div>
  );
}