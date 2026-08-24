import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export type ChatTurn = { role: "user" | "assistant"; content: string };

const SSN = /\b\d{3}-\d{2}-\d{4}\b/;
const LONG_DIGITS = /\b\d{9,}\b/;

type Action =
  | "terms"
  | "conferrals"
  | "headcount"
  | "addresses"
  | "catalog"
  | "students"
  | "invoices"
  | "roles"
  | "transcripts"
  | "offerings";

function detectAction(q: string): Action | null {
  const s = q.toLowerCase();
  if (/address|residence|street|zip|postal/.test(s)) return "addresses";
  if (/every term|term inventory|all years|all term/.test(s)) return "terms";
  if (/degree|confer|graduat/.test(s)) return "conferrals";
  if (/headcount|enroll|by year/.test(s)) return "headcount";
  if (/catalog|course list/.test(s) && !/offering/.test(s)) return "catalog";
  if (/offering/.test(s)) return "offerings";
  if (/invoice|billing|balance|receivable/.test(s)) return "invoices";
  if (/role|who has/.test(s)) return "roles";
  if (/transcript/.test(s)) return "transcripts";
  if (/student/.test(s)) return "students";
  if (/pull|run|get|show|give me/.test(s)) return "terms";
  return null;
}

function looksLikeRecord(text: string): boolean {
  if (SSN.test(text) || LONG_DIGITS.test(text)) return true;
  if (text.split(/\n/).length > 20 && text.length > 800) return true;
  return false;
}

export const askDesk = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((v: { question: string }) => v)
  .handler(async ({ data, context }) => {
    const question = data.question.trim().slice(0, 1200);
    if (!question) return { ok: false as const, error: "Type a question first." };
    if (looksLikeRecord(question)) {
      return {
        ok: true as const,
        text: "Do not paste student lists here. Ask me to pull a list. I will put it on Home.",
        links: [] as { title: string; href: string }[],
      };
    }

    const action = detectAction(question);
    if (action) {
      try {
        const api = await import("./populi-api.server");
        const run = {
          terms: api.pullTerms,
          conferrals: api.pullDegrees,
          headcount: api.pullYears,
          addresses: api.pullAddresses,
          catalog: api.pullCatalog,
          students: api.pullStudents,
          invoices: api.pullInvoices,
          roles: api.pullRoles,
          transcripts: api.pullTranscripts,
          offerings: api.pullOfferings,
        }[action];
        const out = await run(context.bearerToken);
        return {
          ok: true as const,
          text: `Pulled from Populi.\n\n${out.summary}\n\nThe table is on Home.`,
          links: [{ title: "See the table", href: "/" }],
        };
      } catch (err) {
        return {
          ok: true as const,
          text: err instanceof Error ? err.message : "Populi did not return that list.",
          links: [{ title: "Home", href: "/" }],
        };
      }
    }

    return {
      ok: true as const,
      text: "I can pull from Populi. Try: every term, degrees granted, enrollment by year, students, home addresses, catalog, offerings, invoices, roles, transcript requests.",
      links: [{ title: "Home", href: "/" }],
    };
  });
