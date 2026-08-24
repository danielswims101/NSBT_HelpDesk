/** Only this mailbox lands on the Director of IT work page. */
export const OPERATOR_EMAIL = "it@nsbt.org";

export function isOperatorEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === OPERATOR_EMAIL;
}

export function firstName(displayName: string | null | undefined, email: string | null | undefined): string {
  const fromName = displayName?.trim().split(/\s+/)[0];
  if (fromName && fromName.toLowerCase() !== "it") return fromName;
  const local = email?.split("@")[0];
  if (local && local !== "it") return local;
  return "there";
}
