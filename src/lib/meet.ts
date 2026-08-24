/**
 * Google Meet deep links.
 *
 * Every named administrator signs in to this desk with an @nsbt.org Google
 * Workspace account, so Google Meet is the video tool that is already theirs —
 * no SDK, no account to make, no second password. Meet refuses to load inside
 * an <iframe> (it sends X-Frame-Options: DENY), so there is nothing to embed:
 * each helper here just builds a Meet/Calendar URL the desk opens in a new tab,
 * where the user is already signed in.
 */

/** meet.new — mints a fresh instant meeting and drops the opener straight in. */
export const MEET_INSTANT_URL = "https://meet.google.com/new";

/**
 * The desk's standing room. This is a Workspace "nicknamed" meeting: anyone on
 * @nsbt.org who opens the same nickname lands in the same call, and the first
 * one in becomes the host. It is the same room every time, so it can be
 * bookmarked and reused without anyone sharing a link.
 *
 * Two limits, by Google's design: a nickname only works for people signed in
 * on the same @nsbt.org organization (share the instant link with an outside
 * guest), and once everyone leaves, the room resets. Change the nickname by
 * setting VITE_MEET_ROOM at build time.
 */
export const DESK_ROOM_SLUG =
  (import.meta.env.VITE_MEET_ROOM as string | undefined)?.trim() || "nsbt-desk";

/** Deep link that opens (or joins) the nicknamed standing room. */
export function deskRoomUrl(slug: string = DESK_ROOM_SLUG): string {
  return `https://meet.google.com/lookup/${encodeURIComponent(slug)}`;
}

/**
 * A pasted Meet link or a bare join code (`abc-defg-hij`) → a clean join URL.
 * Returns null when the text holds nothing meeting-shaped, so the caller can
 * keep the Join button disabled instead of opening a dead tab.
 */
export function joinUrlFromInput(raw: string): string | null {
  const text = raw.trim();
  if (!text) return null;
  // A full URL was pasted: accept it only when it actually points at Meet.
  try {
    const url = new URL(text);
    if (url.hostname === "meet.google.com") return url.toString();
    return null;
  } catch {
    // Not a URL — fall through and look for a bare code.
  }
  // Meet codes are three-four-three lowercase letters (e.g. abc-defg-hij).
  const code = text.match(/[a-z]{3}-[a-z]{4}-[a-z]{3}/i)?.[0];
  return code ? `https://meet.google.com/${code.toLowerCase()}` : null;
}

/**
 * A Google Calendar "create event" compose URL, pre-addressed to guests.
 * Google attaches a Meet link automatically when the organizer saves the
 * event, so this is the native way to send a dated invitation whose link the
 * guests keep — better than mailing a link nobody can find later.
 */
export function calendarInviteUrl(opts: {
  title: string;
  guests?: string[];
  details?: string;
}): string {
  const params = new URLSearchParams({ action: "TEMPLATE", text: opts.title });
  if (opts.details) params.set("details", opts.details);
  for (const guest of opts.guests ?? []) {
    if (guest.trim()) params.append("add", guest.trim());
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
