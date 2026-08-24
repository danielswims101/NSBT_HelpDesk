import type { DeskView } from "@/lib/types";

const KEY = "nsbt-desk-view";

export function readDeskView(): DeskView {
  if (typeof window === "undefined") return "combined";
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === "it" || v === "records" || v === "combined") return v;
  } catch {
    /* ignore */
  }
  return "combined";
}

export function writeDeskView(view: DeskView) {
  try {
    window.localStorage.setItem(KEY, view);
  } catch {
    /* ignore */
  }
}

export function deskLabel(view: DeskView | "it" | "records" | "shared") {
  if (view === "it") return "Systems";
  if (view === "records") return "Records";
  if (view === "shared") return "Everyone";
  return "Everything";
}
