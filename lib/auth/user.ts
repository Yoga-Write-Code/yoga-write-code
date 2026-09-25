import type { User } from "@supabase/supabase-js";

function getMetadataName(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const name = value.trim();
  return name || undefined;
}

export function getUserDisplayName(
  user: Pick<User, "email" | "user_metadata">,
): string {
  const fullName = getMetadataName(user.user_metadata.full_name);
  if (fullName) return fullName;

  const name = getMetadataName(user.user_metadata.name);
  if (name) return name;

  const emailName = user.email?.split("@")[0]?.trim();
  return emailName || "Your account";
}
