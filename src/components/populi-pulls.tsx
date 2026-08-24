import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  listLatestPulls,
  pullCatalog,
  pullConferrals,
  pullHeadcount,
  pullHomeAddresses,
  pullInvoices,
  pullOfferings,
  pullRoles,
  pullStudents,
  pullTermInventory,
  pullTranscripts,
  testPopuliLink,
  type SavedPull,
} from "@/lib/populi-link";

const ACTIONS = [
  { id: "terms", label: "Every term", fn: pullTermInventory },
  { id: "conf", label: "Degrees granted", fn: pullConferrals },
  { id: "head", label: "Enrollment by year", fn: pullHeadcount },
  { id: "students", label: "Students", fn: pullStudents },
  { id: "addr", label: "Home addresses", fn: pullHomeAddresses },
  { id: "catalog", label: "Catalog courses", fn: pullCatalog },
  { id: "offer", label: "Course offerings", fn: pullOfferings },
  { id: "inv", label: "Invoices", fn: pullInvoices },
  { id: "roles", label: "Roles", fn: pullRoles },
  { id: "tr", label: "Transcript requests", fn: pullTranscripts },
] as const;

export function PopuliPulls() {
  const [busy, setBusy] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [pulls, setPulls] = useState<SavedPull[]>([]);

  async function refresh() {
    try {
      setPulls(((await listLatestPulls()) as SavedPull[]).filter((p) => p.kind !== "webhook" && p.kind !== "worksheet"));
    } catch {
      /* not signed in */
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function run(label: string, fn: () => Promise<{ summary?: string; note?: string }>) {
    setBusy(label);
    setFlash(null);
    try {
      const out = await fn();
      setFlash(out.summary ?? out.note ?? "Done.");
      toast.success("Numbers are on this desk");
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "That pull did not work";
      setFlash(message);
      toast.error(message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((a) => (
          <Button
            key={a.id}
            type="button"
            variant={a.id === "terms" ? "default" : "secondary"}
            disabled={busy !== null}
            onClick={() => void run(a.id, a.fn)}
          >
            {busy === a.id ? "Working…" : a.label}
          </Button>
        ))}
        <Button type="button" variant="outline" disabled={busy !== null} onClick={() => void run("test", testPopuliLink)}>
          {busy === "test" ? "Checking…" : "Test the link"}
        </Button>
      </div>
      {flash && <p className="mt-4 text-base leading-relaxed">{flash}</p>}

      {pulls.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-display text-xl">On this desk</h3>
          {pulls.map((p) => (
            <article key={p.id} className="rounded-lg bg-bg px-4 py-4">
              <p className="font-medium">{labelFor(p.kind)}</p>
              <p className="mt-1 text-base">{p.summary}</p>
              <p className="mt-1 text-sm text-muted">
                {p.pulledAt.slice(0, 16).replace("T", " ")} · {p.pulledBy}
              </p>
              <PullPreview pull={p} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function labelFor(kind: string) {
  const map: Record<string, string> = {
    terms: "Every term",
    conferrals: "Degrees granted",
    headcount: "Enrollment by year",
    addresses: "Home addresses",
    catalog: "Catalog courses",
    students: "Students",
    invoices: "Invoices",
    roles: "Roles",
    transcripts: "Transcript requests",
    offerings: "Course offerings",
  };
  return map[kind] ?? kind;
}

function PullPreview({ pull }: { pull: SavedPull }) {
  const p = pull.payload ?? {};
  if (pull.kind === "terms" && Array.isArray(p.terms)) {
    const rows = p.terms;
    return (
      <div className="mt-3 max-h-56 overflow-auto text-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="text-muted">
              <th className="py-1 pr-3 font-medium">Year</th>
              <th className="py-1 pr-3 font-medium">Term</th>
              <th className="py-1 pr-3 font-medium">Start</th>
              <th className="py-1 font-medium">End</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={`${t.name}-${i}`} className="border-t border-border/60">
                <td className="py-1 pr-3">{t.year}</td>
                <td className="py-1 pr-3">{t.name}</td>
                <td className="py-1 pr-3">{t.start}</td>
                <td className="py-1">{t.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (pull.kind === "conferrals" && Array.isArray(p.dates)) {
    return (
      <ul className="mt-3 space-y-1 text-sm">
        {p.dates.map((d) => (
          <li key={d.date}>
            {d.date}: {d.total}
            {d.byDegree ? ` · ${Object.entries(d.byDegree).map(([k, v]) => `${k} ${v}`).join(", ")}` : ""}
          </li>
        ))}
      </ul>
    );
  }
  if (pull.kind === "headcount") {
    const byYear = p.byYear ?? {};
    return (
      <ul className="mt-3 space-y-1 text-sm">
        <li>Current open term ({String(p.currentTerm ?? "")}): {String(p.asOf ?? "—")} — that term is not the whole school</li>
        {Object.entries(byYear)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([y, n]) => (
            <li key={y}>
              {y}: {n}
            </li>
          ))}
      </ul>
    );
  }
  if (p.byStatus) {
    return (
      <ul className="mt-3 space-y-1 text-sm">
        {Object.entries(p.byStatus).map(([k, n]) => (
          <li key={k}>
            {k}: {n}
          </li>
        ))}
      </ul>
    );
  }
  if (Array.isArray(p.rows) && p.rows.length > 0) {
    return (
      <ul className="mt-3 max-h-56 space-y-1 overflow-auto text-sm">
        {p.rows.slice(0, 80).map((r, i) => (
          <li key={`${r.label}-${i}`}>
            {r.label}
            {r.value ? ` — ${r.value}` : ""}
          </li>
        ))}
      </ul>
    );
  }
  if (pull.kind === "addresses" && Array.isArray(p.addresses)) {
    const rows = p.addresses;
    return (
      <div className="mt-3">
        <p className="text-sm">
          {p.withHome ?? 0} with a home address · {p.missingHome ?? 0} missing
        </p>
        <button type="button" className="mt-2 text-sm underline-offset-4 hover:underline" onClick={() => downloadCsv(rows)}>
          Download CSV
        </button>
        <div className="mt-2 max-h-56 overflow-auto text-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted">
                <th className="py-1 pr-3 font-medium">Name</th>
                <th className="py-1 pr-3 font-medium">Street</th>
                <th className="py-1 pr-3 font-medium">City</th>
                <th className="py-1 pr-3 font-medium">ST</th>
                <th className="py-1 font-medium">ZIP</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 80).map((r) => (
                <tr key={r.personId} className="border-t border-border/60">
                  <td className="py-1 pr-3">{r.name}</td>
                  <td className="py-1 pr-3">{r.street || "—"}</td>
                  <td className="py-1 pr-3">{r.city}</td>
                  <td className="py-1 pr-3">{r.state}</td>
                  <td className="py-1">{r.postal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 80 && <p className="mt-2 text-sm text-muted">Showing the first 80. Download the CSV for everyone.</p>}
        </div>
      </div>
    );
  }
  return null;
}

function downloadCsv(rows: NonNullable<SavedPull["payload"]["addresses"]>) {
  const header = "name,status,street,city,state,postal,country";
  const body = rows
    .map((r) =>
      [r.name, r.status, r.street, r.city, r.state, r.postal, r.country]
        .map((c) => `"${String(c ?? "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `nsbt-home-addresses-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
