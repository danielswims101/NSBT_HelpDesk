import { lessons, type Lesson } from "@/data/learn";

const KEY = "nsbt-learn-done";

export function readLearned(): string[] {
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

export function toggleLearned(id: string): string[] {
  const cur = new Set(readLearned());
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

/** First lesson not yet checked off — the one thing to do in Populi today. */
export function nextLesson(done = readLearned()): Lesson | undefined {
  return lessons.find((l) => !done.includes(l.id));
}
