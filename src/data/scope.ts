export type PullScope =
  | "all-history"
  | "every-cohort"
  | "named-years"
  | "one-term"
  | "as-of"
  | "named-date"
  | "n-a";

export const scopeLabel: Record<PullScope, string> = {
  "all-history": "ALL YEARS — every term in Populi",
  "every-cohort": "EVERY entering class — not one year",
  "named-years": "EVERY year the card names — not one of them",
  "one-term": "This session only — say which",
  "as-of": "As-of today (a snapshot)",
  "named-date": "The named date only",
  "n-a": "Not a year-scoped pull",
};

export const scopeTone: Record<PullScope, "danger" | "warn" | "ok" | "neutral" | "mute"> = {
  "all-history": "danger",
  "every-cohort": "danger",
  "named-years": "warn",
  "one-term": "neutral",
  "as-of": "ok",
  "named-date": "ok",
  "n-a": "mute",
};

export function needsScopeConfirm(scope: PullScope) {
  return scope === "all-history" || scope === "every-cohort" || scope === "named-years";
}
