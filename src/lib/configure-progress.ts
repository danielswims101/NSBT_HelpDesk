const KEY = "nsbt-configure-sent";

export function readConfigured(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function toggleConfigured(id: string): string[] {
  const cur = new Set(readConfigured());
  if (cur.has(id)) cur.delete(id);
  else cur.add(id);
  const next = [...cur];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
