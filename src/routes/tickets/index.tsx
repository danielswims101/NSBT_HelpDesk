import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Page } from "@/components/page";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deskLabel, readDeskView } from "@/lib/desk-role";
import { relativeTime } from "@/lib/format";
import { listTickets } from "@/lib/tickets";
import type { TicketStatus } from "@/lib/types";

export const Route = createFileRoute("/tickets/")({ component: TicketsPage });

const statuses: Array<TicketStatus | "all"> = [
  "all",
  "open",
  "in_progress",
  "waiting_populi",
  "waiting_requester",
  "resolved",
  "closed",
];

function TicketsPage() {
  const { data: tickets = [], isLoading, isError } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      try {
        return await listTickets();
      } catch {
        return [];
      }
    },
    retry: 1,
  });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const view = readDeskView();

  const rows = useMemo(() => {
    return tickets.filter((t) => {
      if (view !== "combined" && t.desk !== view && t.desk !== "shared") return false;
      if (status !== "all" && t.status !== status) return false;
      if (!q.trim()) return true;
      const hay = `${t.id} ${t.title} ${t.requesterName} ${t.category}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [tickets, q, status, view]);

  return (
    <AppShell>
      <Page
        kicker="Work notes"
        title="What we did"
        purpose="keep a short note of work you finished, so the next person can see it."
        description="This is our list, not Populi Support. Do not put Social Security numbers or card numbers here."
        actions={
          <Button asChild>
            <Link to="/tickets/new">Write a note</Link>
          </Button>
        }
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search id, requester, title"
            className="sm:max-w-sm"
          />
          <div className="flex flex-wrap gap-1">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`h-11 rounded-sm px-3 text-sm ${
                  status === s ? "bg-primary text-primary-fg" : "bg-surface text-muted hover:text-ink"
                }`}
              >
                {s === "all" ? "All" : s.replaceAll("_", " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-border text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Hat</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-muted">
                    Loading log…
                  </td>
                </tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-muted">
                    {isError
                      ? "Could not load the log. Refresh and try again."
                      : "No work logged yet. Use Log work — this is your notes, not Populi Support."}
                  </td>
                </tr>
              )}
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      to="/tickets/$ticketId"
                      params={{ ticketId: t.id }}
                      className="font-medium hover:underline"
                    >
                      {t.title}
                    </Link>
                    <p className="font-mono text-xs text-muted">
                      {t.id} · {t.requesterName}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted">{deskLabel(t.desk)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td className="px-4 py-3 text-muted">{relativeTime(t.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Page>
    </AppShell>
  );
}
