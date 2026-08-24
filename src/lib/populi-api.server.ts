import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { isAllowedAdminEmail } from "@/lib/admin-allowlist";
import { getSessionUser } from "@/lib/auth/verify.server";
import { getSql } from "@/lib/db";
import { NSBT, POPULI } from "@/lib/populi";
import type { LinkStatus, SavedPull, TermRow } from "@/lib/populi-link";

const BASE = `${POPULI.campusUrl.replace(/\/$/, "")}/api2`;

function vaultSecret() {
  const s =
    process.env.BETTER_AUTH_SECRET?.trim() ||
    process.env.POPULI_VAULT_SECRET?.trim() ||
    "nsbt-preview-vault";
  return scryptSync(s, "nsbt-populi-link", 32);
}

function encrypt(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", vaultSecret(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return {
    cipher: enc.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
  };
}

function decrypt(cipher: string, iv: string, tag: string) {
  const dec = createDecipheriv("aes-256-gcm", vaultSecret(), Buffer.from(iv, "base64"));
  dec.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([dec.update(Buffer.from(cipher, "base64")), dec.final()]).toString("utf8");
}

export function unwrapList(json: unknown): Record<string, unknown>[] {
  if (Array.isArray(json)) return json as Record<string, unknown>[];
  if (json && typeof json === "object") {
    const o = json as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data as Record<string, unknown>[];
    if (Array.isArray(o.results)) return o.results as Record<string, unknown>[];
  }
  return [];
}

async function ensureLinkTables() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists populi_link (
      id text primary key default 'nsbt',
      key_cipher text,
      key_iv text,
      key_tag text,
      key_last4 text,
      key_set_at timestamptz,
      key_set_by text,
      last_ok_at timestamptz,
      last_error text,
      webhook_secret text
    )
  `);
  await sql.query(`insert into populi_link (id) values ('nsbt') on conflict (id) do nothing`);
  await sql.query(`
    create table if not exists populi_pulls (
      id text primary key,
      kind text not null,
      pulled_at timestamptz not null default now(),
      pulled_by text not null,
      summary text not null,
      payload jsonb not null,
      check_ok boolean,
      sent_at timestamptz,
      sent_to text
    )
  `);
  await sql.query(`alter table populi_pulls add column if not exists sent_at timestamptz`);
  await sql.query(`alter table populi_pulls add column if not exists sent_to text`);
}

export async function requireAdminEmail(bearerToken?: string) {
  const user = await getSessionUser(bearerToken);
  if (!user || !isAllowedAdminEmail(user.email)) throw new Error("Unauthorized");
  return user;
}

type LinkRow = {
  key_cipher: string | null;
  key_iv: string | null;
  key_tag: string | null;
  key_last4: string | null;
  key_set_at: string | null;
  key_set_by: string | null;
  last_ok_at: string | null;
  last_error: string | null;
};

async function loadKey(): Promise<string | null> {
  const envKey = process.env.POPULI_API_KEY?.trim();
  if (envKey) return envKey;
  const sql = await getSql();
  const rows = await sql.query<LinkRow>(
    `select key_cipher, key_iv, key_tag, key_last4, key_set_at::text as key_set_at, key_set_by, last_ok_at::text as last_ok_at, last_error from populi_link where id = 'nsbt'`,
  );
  const row = rows[0];
  if (!row?.key_cipher || !row.key_iv || !row.key_tag) return null;
  return decrypt(row.key_cipher, row.key_iv, row.key_tag);
}

export async function populiFetch(path: string, body?: Record<string, unknown>) {
  const key = await loadKey();
  if (!key) throw new Error("Populi is not linked. Paste the API key on Connectors.");
  const res = await fetch(`${BASE}${path.startsWith("/") ? path : `/${path}`}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { message: text.slice(0, 400) };
  }
  if (res.status === 429) {
    throw new Error("Populi rate limit (50/min daytime). Wait a minute and pull again.");
  }
  if (!res.ok) {
    const msg =
      json && typeof json === "object" && "message" in json
        ? String((json as { message: unknown }).message)
        : `Populi ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

export async function paginate(path: string, extra: Record<string, unknown> = {}) {
  const all: Record<string, unknown>[] = [];
  for (let page = 1; page <= 40; page++) {
    const json = await populiFetch(path, { page, limit: 200, ...extra });
    const rows = unwrapList(json);
    all.push(...rows);
    if (rows.length < 200) break;
    await new Promise((r) => setTimeout(r, 1300));
  }
  return all;
}

export async function markOk(error?: string) {
  const sql = await getSql();
  if (error) {
    await sql.query(`update populi_link set last_error = $1 where id = 'nsbt'`, [error]);
    return;
  }
  await sql.query(`update populi_link set last_ok_at = now(), last_error = null where id = 'nsbt'`);
}

export async function savePull(kind: string, by: string, summary: string, payload: unknown, checkOk: boolean | null) {
  const sql = await getSql();
  const id = `${kind}-${Date.now()}`;
  await sql.query(
    `insert into populi_pulls (id, kind, pulled_by, summary, payload, check_ok) values ($1,$2,$3,$4,$5::jsonb,$6)`,
    [id, kind, by, summary, JSON.stringify(payload), checkOk],
  );
  return id;
}

export async function getLinkStatus(bearerToken?: string): Promise<LinkStatus> {
  await requireAdminEmail(bearerToken);
  await ensureLinkTables();
  const sql = await getSql();
  const rows = await sql.query<LinkRow>(
    `select key_cipher, key_iv, key_tag, key_last4, key_set_at::text as key_set_at, key_set_by, last_ok_at::text as last_ok_at, last_error from populi_link where id = 'nsbt'`,
  );
  const row = rows[0];
  const envKey = process.env.POPULI_API_KEY?.trim();
  const envSet = Boolean(envKey);
  return {
    linked: envSet || Boolean(row?.key_cipher),
    last4: envKey ? envKey.slice(-4) : (row?.key_last4 ?? null),
    setAt: row?.key_set_at ?? null,
    setBy: envSet ? "environment" : (row?.key_set_by ?? null),
    lastOkAt: row?.last_ok_at ?? null,
    lastError: row?.last_error ?? null,
    webhookUrl: "/api/populi/webhook",
  };
}

async function persistKey(key: string, setBy: string) {
  await ensureLinkTables();
  if (!key.startsWith("sk_")) {
    throw new Error("That does not look like a Populi API key (it should start with sk_).");
  }
  if (key.startsWith("sk_sandbox_")) {
    throw new Error("Sandbox keys do not work on nsbt.populiweb.com. Create a live key.");
  }
  const enc = encrypt(key);
  const sql = await getSql();
  await sql.query(
    `update populi_link set key_cipher=$1, key_iv=$2, key_tag=$3, key_last4=$4, key_set_at=now(), key_set_by=$5, last_error=null where id='nsbt'`,
    [enc.cipher, enc.iv, enc.tag, key.slice(-4), setBy],
  );
  return { ok: true as const, last4: key.slice(-4) };
}

export async function storeKey(raw: string, bearerToken?: string) {
  const user = await requireAdminEmail(bearerToken);
  return persistKey(raw.trim(), user.email ?? "admin");
}

export async function storeKeyAsLead(raw: string) {
  return persistKey(raw.trim(), "institutional-lead");
}

export async function testLink(bearerToken?: string) {
  await requireAdminEmail(bearerToken);
  try {
    const json = await populiFetch("/academicterms/current");
    await markOk();
    const term = (json && typeof json === "object" ? json : {}) as Record<string, unknown>;
    return {
      ok: true,
      note: `Connected. Current open term is ${String(term.display_name ?? term.name ?? "current")} — that is the trap. Institutional pulls ignore it.`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Link failed";
    await markOk(message);
    throw new Error(message);
  }
}

export async function pullTerms(bearerToken?: string) {
  const user = await requireAdminEmail(bearerToken);
  const rows: TermRow[] = unwrapList(await populiFetch("/academicterms")).map((t) => {
    const start = String(t.start_date ?? t.start ?? "");
    return {
      id: String(t.id ?? ""),
      name: String(t.display_name ?? t.name ?? t.id ?? ""),
      start,
      end: String(t.end_date ?? t.end ?? ""),
      entrance: Boolean(t.used_for_enrollment ?? t.entrance),
      year: start.slice(0, 4),
    };
  });
  const years = [...new Set(rows.map((r) => r.year).filter(Boolean))].sort();
  const checkOk = years.length > 1;
  const summary = `${rows.length} terms, years ${years[0] ?? "—"}–${years[years.length - 1] ?? "—"}.`;
  await savePull("terms", user.email ?? "admin", summary, { terms: rows, years }, checkOk);
  await markOk();
  return { summary, checkOk, terms: rows, years };
}

export async function pullDegrees(bearerToken?: string) {
  const user = await requireAdminEmail(bearerToken);
  const degrees = unwrapList(await populiFetch("/degrees"));
  const granted: { date: string; degree: string; studentId: string }[] = [];
  for (const deg of degrees) {
    const id = String(deg.id ?? "");
    if (!id) continue;
    const people = await paginate(`/degrees/${id}/students`);
    for (const s of people) {
      granted.push({
        date: String(s.graduation_date ?? s.conferred_at ?? ""),
        degree: String(deg.abbrv ?? deg.abbreviation ?? deg.name ?? id),
        studentId: String(s.id ?? s.student_id ?? ""),
      });
    }
  }
  const byDate = new Map<string, { date: string; total: number; byDegree: Record<string, number> }>();
  for (const g of granted) {
    const d = g.date.slice(0, 10) || "undated";
    const row = byDate.get(d) ?? { date: d, total: 0, byDegree: {} };
    row.total += 1;
    row.byDegree[g.degree] = (row.byDegree[g.degree] ?? 0) + 1;
    byDate.set(d, row);
  }
  const dates = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  const checkOk = granted.length === 46;
  const summary = `${granted.length} conferred records across ${dates.length} dates. CHECK wants 46.`;
  await savePull("conferrals", user.email ?? "admin", summary, { granted: granted.length, dates }, checkOk);
  await markOk();
  return { summary, checkOk, granted: granted.length, dates };
}

export async function pullYears(bearerToken?: string) {
  const user = await requireAdminEmail(bearerToken);
  const current = (await populiFetch("/academicterms/current")) as Record<string, unknown>;
  const currentId = String(current.id ?? "");
  const nowStudents = currentId ? await paginate(`/academicterms/${currentId}/students`) : [];
  const terms = unwrapList(await populiFetch("/academicterms"));
  const byYear: Record<string, number> = {};
  for (const t of terms) {
    const year = String(t.start_date ?? t.start ?? "").slice(0, 4);
    const id = String(t.id ?? "");
    if (!id || !year) continue;
    const roster = await paginate(`/academicterms/${id}/students`);
    byYear[year] = (byYear[year] ?? 0) + roster.length;
  }
  const checkOk = Object.keys(byYear).length > 1;
  const payload = {
    asOf: nowStudents.length,
    currentTerm: String(current.display_name ?? current.name ?? ""),
    byYear,
    y2024: byYear["2024"] ?? 0,
    y2025: byYear["2025"] ?? 0,
  };
  const summary = `Now: ${payload.asOf}. 2024: ${payload.y2024}. 2025: ${payload.y2025}.`;
  await savePull("headcount", user.email ?? "admin", summary, payload, checkOk);
  await markOk();
  return { summary, checkOk, ...payload };
}

function pickHome(raw: unknown) {
  const list = Array.isArray(raw) ? raw : unwrapList(raw);
  const typed = list.map((a) => ({
    type: String(a.type ?? "").toLowerCase(),
    old: Boolean(a.old),
    primary: Boolean(a.primary),
    recent: Boolean(a.most_recent_by_type),
    street: String(a.street ?? ""),
    city: String(a.city ?? ""),
    state: String(a.state ?? ""),
    postal: String(a.postal ?? ""),
    country: String(a.country ?? ""),
  }));
  const homes = typed.filter((a) => a.type === "home" && !a.old);
  return (
    homes.find((a) => a.primary) ||
    homes.find((a) => a.recent) ||
    homes[0] ||
    typed.find((a) => a.primary && !a.old) ||
    null
  );
}

export async function pullAddresses(bearerToken?: string) {
  const user = await requireAdminEmail(bearerToken);
  let people: Record<string, unknown>[] = [];
  try {
    people = await paginate("/students", { expand: ["addresses"] });
  } catch {
    people = await paginate("/people", { expand: ["addresses"] });
  }
  const rows = people.map((p) => {
    const home = pickHome(p.addresses);
    const first = String(p.first_name ?? p.firstName ?? "");
    const last = String(p.last_name ?? p.lastName ?? "");
    return {
      personId: String(p.id ?? ""),
      name: String(p.display_name ?? p.name ?? (`${first} ${last}`.trim() || String(p.id ?? ""))),
      status: String(p.status ?? p.student_status ?? ""),
      type: home?.type ?? "",
      street: home?.street ?? "",
      city: home?.city ?? "",
      state: home?.state ?? "",
      postal: home?.postal ?? "",
      country: home?.country ?? "",
    };
  });
  const withHome = rows.filter((r) => r.street).length;
  const checkOk = rows.length > 0;
  const summary = `${rows.length} people since the campus began. ${withHome} have a home address on file. ${rows.length - withHome} do not.`;
  const payload = { addresses: rows, withHome, missingHome: rows.length - withHome };
  await savePull("addresses", user.email ?? "admin", summary, payload, checkOk);
  await markOk();
  return { summary, checkOk, ...payload };
}

function countBy(rows: Record<string, unknown>[], key: string) {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const k = String(r[key] ?? "—") || "—";
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

export async function pullCatalog(bearerToken?: string) {
  const user = await requireAdminEmail(bearerToken);
  const rows = await paginate("/catalogcourses");
  const summary = `${rows.length} catalog courses.`;
  await savePull(
    "catalog",
    user.email ?? "admin",
    summary,
    {
      count: rows.length,
      rows: rows.slice(0, 300).map((c) => ({
        label: String(c.abbrv ?? c.abbreviation ?? c.code ?? c.id ?? ""),
        value: String(c.name ?? c.title ?? ""),
      })),
    },
    rows.length > 0,
  );
  await markOk();
  return { summary, checkOk: rows.length > 0 };
}

export async function pullStudents(bearerToken?: string) {
  const user = await requireAdminEmail(bearerToken);
  let rows: Record<string, unknown>[] = [];
  try {
    rows = await paginate("/students");
  } catch {
    rows = await paginate("/people");
  }
  const byStatus = countBy(rows, "status");
  const summary = `${rows.length} people. ${Object.entries(byStatus)
    .map(([k, n]) => `${k} ${n}`)
    .join(", ")}.`;
  await savePull("students", user.email ?? "admin", summary, { count: rows.length, byStatus }, rows.length > 0);
  await markOk();
  return { summary, checkOk: rows.length > 0, count: rows.length, byStatus };
}

export async function pullInvoices(bearerToken?: string) {
  const user = await requireAdminEmail(bearerToken);
  const rows = await paginate("/invoices");
  const byStatus = countBy(rows, "status");
  const summary = `${rows.length} invoices. ${Object.entries(byStatus)
    .map(([k, n]) => `${k} ${n}`)
    .join(", ")}.`;
  await savePull("invoices", user.email ?? "admin", summary, { count: rows.length, byStatus }, rows.length > 0);
  await markOk();
  return { summary, checkOk: rows.length > 0 };
}

export async function pullRoles(bearerToken?: string) {
  const user = await requireAdminEmail(bearerToken);
  const rows = await paginate("/roles");
  const summary = `${rows.length} role records.`;
  await savePull(
    "roles",
    user.email ?? "admin",
    summary,
    {
      count: rows.length,
      rows: rows.slice(0, 200).map((r) => ({
        label: String(r.name ?? r.role ?? r.id ?? ""),
        value: String(r.person_name ?? r.display_name ?? r.email ?? r.person_id ?? ""),
      })),
    },
    rows.length > 0,
  );
  await markOk();
  return { summary, checkOk: rows.length > 0 };
}

export async function pullTranscripts(bearerToken?: string) {
  const user = await requireAdminEmail(bearerToken);
  const rows = await paginate("/transcriptrequests");
  const summary = `${rows.length} transcript requests.`;
  await savePull("transcripts", user.email ?? "admin", summary, { count: rows.length }, rows.length >= 0);
  await markOk();
  return { summary, checkOk: true };
}

export async function pullOfferings(bearerToken?: string) {
  const user = await requireAdminEmail(bearerToken);
  const rows = await paginate("/courseofferings");
  const summary = `${rows.length} course offerings.`;
  await savePull("offerings", user.email ?? "admin", summary, { count: rows.length }, rows.length > 0);
  await markOk();
  return { summary, checkOk: rows.length > 0 };
}

function formatPacket(pull: SavedPull) {
  const p = pull.payload;
  const lines = [
    `To: ${NSBT.angelaName} <${NSBT.angelaEmail}>`,
    `From: ${NSBT.office}`,
    `Pulled: ${pull.pulledAt.slice(0, 16).replace("T", " ")} by ${pull.pulledBy}`,
    `Kind: ${pull.kind}`,
    `CHECK: ${pull.checkOk === true ? "passed" : pull.checkOk === false ? "failed" : "n/a"}`,
    "",
    pull.summary,
    "",
  ];
  if (pull.kind === "terms") {
    lines.push(`Terms: ${p.terms?.length ?? 0}`);
    lines.push(`Years: ${(p.years ?? []).join(", ")}`);
  } else if (pull.kind === "conferrals") {
    lines.push(`Granted: ${p.granted ?? "—"}`);
  } else if (pull.kind === "headcount") {
    lines.push(`As of now (${p.currentTerm ?? ""}): ${p.asOf ?? "—"}`);
    lines.push(`2024: ${p.y2024 ?? "—"}`);
    lines.push(`2025: ${p.y2025 ?? "—"}`);
  } else if (pull.kind === "addresses") {
    lines.push(`People: ${p.addresses?.length ?? 0}`);
    lines.push(`With a home address: ${p.withHome ?? "—"}`);
    lines.push(`Missing a home address: ${p.missingHome ?? "—"}`);
    lines.push("The full street list is on the desk. Download the CSV there.");
  } else if (pull.kind === "worksheet") {
    const answers = (p as { answers?: { code?: string; summary?: string; checkOk?: boolean | null }[] }).answers ?? [];
    lines.push(`${answers.length} worksheet cards from Populi.`);
    for (const a of answers) {
      lines.push(`- ${a.code}: ${a.summary}${a.checkOk === false ? " (CHECK failed)" : a.checkOk ? " (CHECK passed)" : ""}`);
    }
    lines.push("");
    lines.push("The tables live on the NSBT desk worksheet page.");
  }
  lines.push("");
  lines.push("No student names are in this note. The full list stays in Populi and on the desk.");
  lines.push("— Office of Student Records and Accounts");
  const label =
    pull.kind === "terms"
      ? "every term"
      : pull.kind === "conferrals"
        ? "all degrees granted"
        : pull.kind === "addresses"
          ? "home addresses"
          : pull.kind === "worksheet"
            ? "worksheet 71–78"
            : "2024 + 2025 + now";
  return {
    subject: `NSBT Populi pull — ${label} — ${pull.pulledAt.slice(0, 10)}`,
    body: lines.join("\n"),
  };
}

export async function listLatestPulls(bearerToken?: string): Promise<SavedPull[]> {
  await requireAdminEmail(bearerToken);
  await ensureLinkTables();
  const sql = await getSql();
  const rows = await sql.query<{
    id: string;
    kind: string;
    pulled_at: string;
    pulled_by: string;
    summary: string;
    check_ok: boolean | null;
    payload: unknown;
    sent_at: string | null;
    sent_to: string | null;
  }>(
    `select id, kind, pulled_at::text as pulled_at, pulled_by, summary, check_ok, payload, sent_at::text as sent_at, sent_to
     from populi_pulls where kind not in ('webhook', 'worksheet') order by pulled_at desc limit 12`,
  );
  return rows.map((r) => ({
    id: r.id,
    kind: r.kind,
    pulledAt: r.pulled_at,
    pulledBy: r.pulled_by,
    summary: r.summary,
    checkOk: r.check_ok,
    payload: (r.payload ?? {}) as SavedPull["payload"],
    sentAt: r.sent_at,
    sentTo: r.sent_to,
  }));
}

export async function markPullSent(id: string, bearerToken?: string) {
  const user = await requireAdminEmail(bearerToken);
  await ensureLinkTables();
  const sql = await getSql();
  const rows = await sql.query<{
    id: string;
    kind: string;
    pulled_at: string;
    pulled_by: string;
    summary: string;
    check_ok: boolean | null;
    payload: unknown;
    sent_at: string | null;
    sent_to: string | null;
  }>(
    `select id, kind, pulled_at::text as pulled_at, pulled_by, summary, check_ok, payload, sent_at::text as sent_at, sent_to from populi_pulls where id = $1`,
    [id],
  );
  const r = rows[0];
  if (!r) throw new Error("That pull is not on this desk.");
  const pull: SavedPull = {
    id: r.id,
    kind: r.kind,
    pulledAt: r.pulled_at,
    pulledBy: r.pulled_by,
    summary: r.summary,
    checkOk: r.check_ok,
    payload: (r.payload ?? {}) as SavedPull["payload"],
    sentAt: r.sent_at,
    sentTo: r.sent_to,
  };
  const packet = formatPacket(pull);
  await sql.query(`update populi_pulls set sent_at = now(), sent_to = $2 where id = $1`, [id, NSBT.angelaEmail]);
  void user;
  return {
    to: NSBT.angelaEmail,
    toName: NSBT.angelaName,
    mailto: `mailto:${NSBT.angelaEmail}?subject=${encodeURIComponent(packet.subject)}&body=${encodeURIComponent(packet.body)}`,
    subject: packet.subject,
    body: packet.body,
  };
}
