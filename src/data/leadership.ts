import { allWorksheetLines } from "@/data/worksheet";
import { scopeLabel } from "@/data/scope";

export const rejectIf = [
  "The file is one academic year and the card said ALL YEARS or EVERY COHORT.",
  "There is no term inventory attached to 71 or 72.",
  "Graduate total is not 46 (item 71) or the first three conferral dates do not sum to 40.",
  "Item 72 is missing as-of-today, or 2024, or 2025.",
  "Item 77 does not add to 6. Item 78 graduate total is not 9.",
  "A Populi ticket number is offered instead of the export.",
];

export const sendBackNote = [
  "This file is returned. It is one academic year (or the current session only).",
  "",
  "Populi opens on the current term. Clear that filter. Export the term inventory first (Worksheet card 0). Then pull every year / every cohort the card names.",
  "",
  "Do not open a Populi Support ticket for this. Re-export and resend with the pull date.",
].join("\n");

export const acceptRows = allWorksheetLines.map((l) => ({
  code: l.code,
  title: l.title,
  scope: scopeLabel[l.scope],
  accept: l.send,
  reject: l.scopeFail,
  check: l.check,
}));
