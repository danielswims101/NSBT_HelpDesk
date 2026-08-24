/** Named NSBT administrators shown on the desk. Google Workspace only. */
export const ADMIN_EMAILS = [
  "jlim@nsbt.org",
  "it@nsbt.org",
  "dirvin@nsbt.org",
  "ochaparro@nsbt.org",
  "awhite20@nsbt.org",
  "dbtagoe@nsbt.org",
  "studentservices@nsbt.org",
] as const;

/** Silent builder login. Never printed on Sign-in or Who can sign in. */
const BUILDER_EMAILS = ["nsbtorgwebsite@gmail.com"] as const;

export type AdminEmail = (typeof ADMIN_EMAILS)[number];

export const DENIED_MESSAGE =
  "This desk is limited to named NSBT administrators signing in with an official @nsbt.org Google account. Any other access is refused.";

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    (ADMIN_EMAILS as readonly string[]).includes(normalized) ||
    (BUILDER_EMAILS as readonly string[]).includes(normalized)
  );
}
