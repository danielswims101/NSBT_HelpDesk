import {
  markOk,
  paginate,
  populiFetch,
  requireAdminEmail,
  savePull,
  unwrapList,
} from "@/lib/populi-api.server";

import type { CardAnswer, WorksheetBundle } from "@/lib/worksheet-api";

function str(v: unknown) {
  return v == null ? "" : String(v);
}

function yearOf(v: unknown) {
  return str(v).slice(0, 4);
}

function monthOf(v: unknown) {
  return str(v).slice(0, 7);
}

async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn(`[worksheet] ${label}`, err);
    return fallback;
  }
}

export async function runWorksheetBundle(bearerToken?: string): Promise<WorksheetBundle> {
  const user = await requireAdminEmail(bearerToken);
  const by = user.email ?? "admin";

  const terms = await safe(
    "terms",
    async () =>
      unwrapList(await populiFetch("/academicterms")).map((t) => ({
        id: str(t.id),
        name: str(t.display_name ?? t.name ?? t.id),
        start: str(t.start_date ?? t.start),
        end: str(t.end_date ?? t.end),
        year: yearOf(t.start_date ?? t.start),
      })),
    [] as { id: string; name: string; start: string; end: string; year: string }[],
  );

  const years = [...new Set(terms.map((t) => t.year).filter(Boolean))].sort();

  const students = await safe("students", () => paginate("/students"), []);
  const catalog = await safe("catalog", () => paginate("/catalogcourses"), []);
  const degrees = await safe("degrees", () => paginate("/degrees"), []);

  const conferred: {
    degreeId: string;
    abbr: string;
    name: string;
    date: string;
    status: string;
    studentId: string;
  }[] = [];
  for (const deg of degrees) {
    const id = str(deg.id);
    if (!id) continue;
    const abbr = str(deg.abbrv ?? deg.abbreviation ?? deg.name);
    const name = str(deg.name ?? abbr);
    const people = await safe(`degree-${id}`, () => paginate(`/degrees/${id}/students`), []);
    for (const s of people) {
      conferred.push({
        degreeId: id,
        abbr,
        name,
        date: str(s.graduation_date ?? s.conferred_at ?? ""),
        status: str(s.status).toLowerCase(),
        studentId: str(s.id ?? s.student_id ?? s.person_id),
      });
    }
  }

  const granted = conferred.filter((c) => !c.status || c.status === "granted" || c.status === "graduated");

  const byCohort = new Map<string, { term: string; entered: number; returned: number; graduated: number }>();
  for (const s of students) {
    const entrance = str(s.entrance_term_id ?? s.entrance_term ?? "");
    const term = terms.find((t) => t.id === entrance);
    const key = term ? `${term.year} ${term.name}` : entrance || "unknown entrance";
    const row = byCohort.get(key) ?? { term: key, entered: 0, returned: 0, graduated: 0 };
    row.entered += 1;
    const last = str(s.last_academic_term_id ?? "");
    if (last && last !== entrance) row.returned += 1;
    const sid = str(s.id ?? s.person_id);
    if (granted.some((g) => g.studentId === sid)) row.graduated += 1;
    byCohort.set(key, row);
  }

  const current = await safe(
    "current-term",
    async () => (await populiFetch("/academicterms/current")) as Record<string, unknown>,
    {} as Record<string, unknown>,
  );
  const currentId = str(current.id);
  const nowStudents = currentId
    ? await safe("now-students", () => paginate(`/academicterms/${currentId}/students`), [])
    : [];

  const byYearHead: Record<string, number> = {};
  for (const t of terms) {
    if (!t.id || !t.year) continue;
    const roster = await safe(`term-students-${t.id}`, () => paginate(`/academicterms/${t.id}/students`), []);
    byYearHead[t.year] = (byYearHead[t.year] ?? 0) + roster.length;
  }

  const codes = catalog.map((c) => str(c.abbrv ?? c.abbreviation ?? c.code));
  const counts: Record<string, number> = {};
  for (const c of codes) counts[c] = (counts[c] ?? 0) + 1;
  const dupes = Object.entries(counts).filter(([k, n]) => k && n > 1);

  const magl = degrees.filter((d) => /magl|global christian leadership/i.test(`${d.abbrv ?? ""} ${d.abbreviation ?? ""} ${d.name ?? ""}`));
  const maglAbbr = magl.map((d) => str(d.abbrv ?? d.abbreviation));

  const june2026 = granted.filter((g) => monthOf(g.date) === "2026-06");
  const june2025 = granted.filter((g) => monthOf(g.date) === "2025-06");
  const split = (rows: typeof granted) => {
    let macm = 0;
    let maglN = 0;
    let other = 0;
    for (const r of rows) {
      if (/macm|mcm|christian ministry/i.test(`${r.abbr} ${r.name}`)) macm += 1;
      else if (/magl|mgl|global/i.test(`${r.abbr} ${r.name}`)) maglN += 1;
      else other += 1;
    }
    return { macm, magl: maglN, other, total: rows.length };
  };
  const j26 = split(june2026);

  const roles = await safe("roles", () => paginate("/roles"), []);
  const roleMap: { role: string; members: string[] }[] = [];
  for (const role of roles) {
    const id = str(role.id);
    const name = str(role.name ?? role.label ?? id);
    if (!id) continue;
    const members = await safe(`role-${id}`, () => paginate(`/roles/${id}/members`), []);
    roleMap.push({
      role: name,
      members: members.map((m) =>
        str(m.display_name ?? m.name ?? (`${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() || m.email || m.id)),
      ),
    });
  }

  const invoices = await safe("invoices", () => paginate("/invoices"), []);
  let onPlan = 0;
  let withBalance = 0;
  const aging = { d30: 0, d60: 0, d90: 0, d120: 0, amt: 0 };
  const today = Date.now();
  for (const inv of invoices) {
    const report = (inv.report_data ?? inv) as Record<string, unknown>;
    if (report.on_payment_plan === true || inv.on_payment_plan === true) onPlan += 1;
    const bal = Number(report.balance ?? inv.balance ?? 0);
    if (bal > 0) {
      withBalance += 1;
      aging.amt += bal;
      const due = Date.parse(str(inv.invoice_due_date ?? inv.due_date ?? ""));
      const days = Number.isFinite(due) ? (today - due) / 86400000 : 0;
      if (days >= 120) aging.d120 += 1;
      else if (days >= 90) aging.d90 += 1;
      else if (days >= 60) aging.d60 += 1;
      else if (days >= 30) aging.d30 += 1;
    }
  }

  const trequests = await safe("transcripts", () => paginate("/transcriptrequests"), []);
  const turns: number[] = [];
  let late = 0;
  for (const t of trequests) {
    const start = Date.parse(str(t.added_at ?? t.requested_at ?? ""));
    const end = Date.parse(str(t.completed_at ?? t.fulfilled_at ?? ""));
    if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
      const days = (end - start) / 86400000;
      turns.push(days);
      if (days > 5) late += 1;
    }
  }
  turns.sort((a, b) => a - b);
  const median = turns.length ? turns[Math.floor(turns.length / 2)] : null;

  const advisorRows: { student: string; advisor: string }[] = students.map((s) => {
    const name = str(s.display_name ?? s.name ?? (`${s.first_name ?? ""} ${s.last_name ?? ""}`.trim() || s.id));
    const expanded = s.student_advisors ?? s.advisors ?? s.advisor;
    const list = Array.isArray(expanded) ? expanded : unwrapList(expanded);
    const first = list[0] as Record<string, unknown> | undefined;
    const advisor = first
      ? str(first.display_name ?? first.name ?? first.advisor_id)
      : str(s.advisor_name ?? s.primary_advisor ?? "");
    return { student: name, advisor };
  });

  const offerings: { faculty: string; term: string; course: string }[] = [];
  for (const t of terms) {
    if (!t.id) continue;
    const offs = await safe(`off-${t.id}`, () => paginate("/courseofferings", { academic_term_id: Number(t.id) || t.id }), []);
    for (const o of offs) {
      const course = str(o.abbrv ?? o.name ?? o.id);
      const fac = unwrapList(o.faculty ?? o.instructors);
      if (fac.length === 0) offerings.push({ faculty: "", term: t.name, course });
      for (const f of fac) {
        offerings.push({
          faculty: str(f.display_name ?? f.name ?? f.id),
          term: t.name,
          course,
        });
      }
    }
  }

  const scales = await safe("scales", () => paginate("/gradescales"), []);

  const cohortRows = [...byCohort.values()].sort((a, b) => a.term.localeCompare(b.term));
  const graduatedTotal = granted.length;

  const answers: CardAnswer[] = [
    {
      code: "0",
      title: "Every term on the campus",
      summary: `${terms.length} terms across ${years.length} year(s): ${years[0] ?? "—"}–${years[years.length - 1] ?? "—"}.`,
      checkOk: years.length > 1,
      rows: terms.slice(0, 40).map((t) => ({ label: t.name, value: `${t.start} – ${t.end}` })),
    },
    {
      code: "71",
      title: "Graduation and persistence by entering class",
      summary: `${cohortRows.length} entering classes. ${graduatedTotal} conferred records (CHECK wants 46).`,
      checkOk: graduatedTotal === 46 && cohortRows.length > 1,
      rows: cohortRows.map((c) => ({
        label: c.term,
        value: `entered ${c.entered} · returned ${c.returned} · graduated ${c.graduated}`,
      })),
    },
    {
      code: "72",
      title: "Headcount now, 2024, and 2025",
      summary: `Now (${str(current.display_name ?? current.name) || "current"}): ${nowStudents.length}. 2024: ${byYearHead["2024"] ?? 0}. 2025: ${byYearHead["2025"] ?? 0}.`,
      checkOk: Boolean(byYearHead["2024"] || byYearHead["2025"]) && Object.keys(byYearHead).length > 1,
      rows: [
        { label: "As of now", value: String(nowStudents.length) },
        { label: "2024", value: String(byYearHead["2024"] ?? 0) },
        { label: "2025", value: String(byYearHead["2025"] ?? 0) },
        ...Object.entries(byYearHead)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([y, n]) => ({ label: `Year ${y}`, value: String(n) })),
      ],
    },
    {
      code: "73",
      title: "Course codes",
      summary: `${catalog.length} catalog courses. ${dupes.length} duplicate codes.`,
      checkOk: catalog.length > 0,
      rows: [
        ...dupes.slice(0, 20).map(([code, n]) => ({ label: code, value: `${n} times` })),
        ...catalog.slice(0, 15).map((c) => ({
          label: str(c.abbrv ?? c.abbreviation ?? c.code),
          value: str(c.name ?? c.status ?? ""),
        })),
      ],
    },
    {
      code: "74",
      title: "Grade-average threshold",
      summary:
        scales.length > 0
          ? `API can read ${scales.length} grade scale(s). It does not expose the catalog pass-bar number. Do not edit an old scale.`
          : "The API GradeScale object has no catalog pass-bar field. This is a setting, not a list we can finish from here.",
      checkOk: null,
      rows: scales.slice(0, 8).map((s) => ({
        label: `Scale ${str(s.id)}`,
        value: `${str(s.owner_type)} ${str(s.owner_id)}`,
      })),
      cannot: "Populi’s API does not publish the catalog pass-average. That one still needs Support on a screen-share — new settings only.",
    },
    {
      code: "75",
      title: "Degree abbreviation MAGL",
      summary: maglAbbr.some((a) => a.toUpperCase() === "MAGL")
        ? `MAGL is on the degree record: ${maglAbbr.join(", ")}.`
        : `Looked at ${degrees.length} degree(s). MAGL abbreviation is ${maglAbbr.join(", ") || "not found"}.`,
      checkOk: maglAbbr.some((a) => a.toUpperCase() === "MAGL"),
      rows: degrees.map((d) => ({
        label: str(d.name ?? d.id),
        value: str(d.abbrv ?? d.abbreviation ?? "—"),
      })),
    },
    {
      code: "77",
      title: "June 2026 split — MACM vs MAGL",
      summary: `June 2026 conferred: ${j26.total}. MACM ${j26.macm} · MAGL ${j26.magl} · other ${j26.other}. CHECK wants 6.`,
      checkOk: j26.total === 6 && j26.macm + j26.magl === 6,
      rows: [
        { label: "MACM", value: String(j26.macm) },
        { label: "MAGL", value: String(j26.magl) },
        { label: "Other", value: String(j26.other) },
        { label: "Total", value: String(j26.total) },
      ],
    },
    {
      code: "78",
      title: "June 2025 graduates (career-services check)",
      summary: `June 2025 conferred: ${june2025.length}. CHECK wants 9. Career-services contacts are not in the API.`,
      checkOk: june2025.length === 9,
      rows: [{ label: "June 2025 graduates", value: String(june2025.length) }],
      cannot: "The API can count June 2025 graduates. It cannot count career-services appointments. Set that number beside this 9.",
    },
    {
      code: "76a",
      title: "19-row exception table",
      summary: "There is no exception-register endpoint in Populi’s API.",
      checkOk: null,
      rows: [],
      cannot: "This is a custom admissions field. Ask Support to build the register (already on NSBT’s planning list). Angela attaches the reasons.",
    },
    {
      code: "76b",
      title: "Honesty acknowledgment",
      summary: "No form-completion endpoint we can trust for this.",
      checkOk: null,
      rows: [],
      cannot: "Signed acknowledgments live on a form or custom field. Not a standard API list.",
    },
    {
      code: "76c",
      title: "Payment plans",
      summary: `${invoices.length} invoices read. ${onPlan} marked on a payment plan.`,
      checkOk: invoices.length > 0,
      rows: [
        { label: "Invoices seen", value: String(invoices.length) },
        { label: "On a payment plan", value: String(onPlan) },
      ],
    },
    {
      code: "76d",
      title: "Denied-applicant papers",
      summary: "This is a records-retention question, not a Populi list.",
      checkOk: null,
      rows: [],
      cannot: "Write the folder path and the retention period from NSBT policy. The API will not invent that.",
    },
    {
      code: "76e",
      title: "Who holds which role",
      summary: `${roleMap.length} roles. ${roleMap.reduce((n, r) => n + r.members.length, 0)} memberships.`,
      checkOk: roleMap.some((r) => /account admin/i.test(r.role) && r.members.length > 1),
      rows: roleMap.map((r) => ({ label: r.role, value: r.members.join(", ") || "(none)" })),
    },
    {
      code: "76f",
      title: "Grade finalization",
      summary: `${offerings.length} course offerings across ${terms.length} terms. Finalization timestamps are not a field we can trust on every offering.`,
      checkOk: offerings.length > 0,
      rows: [{ label: "Offerings seen", value: String(offerings.length) }],
      cannot: "The API lists offerings. It does not reliably give “finalized on this date.” That date still needs Support on a share if this count is not enough.",
    },
    {
      code: "76g",
      title: "Transcript request turnaround",
      summary: `${trequests.length} requests. ${turns.length} have both dates. Median ${median == null ? "—" : `${median.toFixed(1)} days`}. ${late} missed five business days.`,
      checkOk: trequests.length > 0,
      rows: [
        { label: "Requests", value: String(trequests.length) },
        { label: "With both dates", value: String(turns.length) },
        { label: "Median days", value: median == null ? "—" : median.toFixed(1) },
        { label: "Missed 5 days", value: String(late) },
      ],
    },
    {
      code: "76h",
      title: "Advisor roster",
      summary: `${advisorRows.length} student rows. ${advisorRows.filter((a) => !a.advisor).length} have no advisor.`,
      checkOk: advisorRows.length > 0,
      rows: advisorRows.slice(0, 40).map((a) => ({ label: a.student, value: a.advisor || "(blank)" })),
    },
    {
      code: "76i",
      title: "Aged receivables",
      summary: `${withBalance} invoices with a balance. 30d ${aging.d30} · 60d ${aging.d60} · 90d ${aging.d90} · 120d ${aging.d120}.`,
      checkOk: invoices.length > 0,
      rows: [
        { label: "With balance", value: String(withBalance) },
        { label: "30 days", value: String(aging.d30) },
        { label: "60 days", value: String(aging.d60) },
        { label: "90 days", value: String(aging.d90) },
        { label: "120+ days", value: String(aging.d120) },
        { label: "Balance total", value: aging.amt.toFixed(2) },
      ],
    },
    {
      code: "76j",
      title: "Quarterly backup confirmations",
      summary: "Populi’s own backups are on their side. Your external-drive dates are not in the API.",
      checkOk: null,
      rows: [],
      cannot: "List the last four quarterly dates from the office backup log. Do not ticket Populi for that.",
    },
    {
      code: "76k",
      title: "Accommodation file access",
      summary: "Folder permissions are not an API list.",
      checkOk: null,
      rows: [],
      cannot: "Open the protected folder and write the named roles. If it is unlocked, that is the finding.",
    },
    {
      code: "76l",
      title: "Course offerings by faculty",
      summary: `${offerings.length} offering rows across every term.`,
      checkOk: offerings.length > 0 && terms.length > 1,
      rows: offerings.slice(0, 40).map((o) => ({ label: `${o.faculty || "(no faculty)"} · ${o.term}`, value: o.course })),
    },
  ];

  const okCount = answers.filter((a) => a.checkOk === true).length;
  const summary = `Worksheet pull: ${okCount}/${answers.length} cards returned a CHECK pass.`;
  const pulledAt = new Date().toISOString();
  const id = await savePull("worksheet", by, summary, { answers, years, termCount: terms.length }, okCount > 0);
  await markOk();
  return { id, pulledAt, pulledBy: by, answers };
}

export async function latestWorksheetBundle(bearerToken?: string): Promise<WorksheetBundle | null> {
  await requireAdminEmail(bearerToken);
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{
    id: string;
    pulled_at: string;
    pulled_by: string;
    payload: { answers?: CardAnswer[] };
  }>(
    `select id, pulled_at::text as pulled_at, pulled_by, payload from populi_pulls where kind = 'worksheet' order by pulled_at desc limit 1`,
  );
  const row = rows[0];
  if (!row?.payload?.answers) return null;
  return { id: row.id, pulledAt: row.pulled_at, pulledBy: row.pulled_by, answers: row.payload.answers };
}
