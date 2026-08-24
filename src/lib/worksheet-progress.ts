import type { WorksheetStatus } from "@/data/worksheet";

const KEY = "nsbt-worksheet-v6";

export type LineState = {
  status: WorksheetStatus;
  note: string;
  pullDate: string;
  scopeConfirmed: boolean;
};

export type WorksheetState = Record<string, LineState>;

export function emptyLine(): LineState {
  return { status: "todo", note: "", pullDate: "", scopeConfirmed: false };
}

export function readWorksheet(): WorksheetState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as WorksheetState;
  } catch {
    return {};
  }
}

export function writeWorksheet(next: WorksheetState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function patchLine(id: string, patch: Partial<LineState>): WorksheetState {
  const cur = readWorksheet();
  const prev = cur[id] ?? emptyLine();
  const next = { ...cur, [id]: { ...prev, ...patch } };
  writeWorksheet(next);
  return next;
}
