import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Page } from "@/components/page";
import { PriorityBadge, StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { deskLabel } from "@/lib/desk-role";
import { shortDate } from "@/lib/format";
import { addComment, getTicket, updateTicket } from "@/lib/tickets";
import type { TicketPriority, TicketStatus } from "@/lib/types";

export const Route = createFileRoute("/tickets/$ticketId")({ component: TicketDetail });

const statuses: TicketStatus[] = [
  "open",
  "in_progress",
  "waiting_populi",
  "waiting_requester",
  "resolved",
  "closed",
];
const priorities: TicketPriority[] = ["low", "normal", "high", "urgent"];

function TicketDetail() {
  const { ticketId } = Route.useParams();
  const user = useCurrentUser();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicket({ data: ticketId }),
  });
  const [note, setNote] = useState("");
  const [resolution, setResolution] = useState("");

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["ticket", ticketId] });
    void qc.invalidateQueries({ queryKey: ["tickets"] });
  };

  const patch = useMutation({
    mutationFn: (input: Parameters<typeof updateTicket>[0]["data"]) => updateTicket({ data: input }),
    onSuccess: () => {
      toast.success("Work log updated");
      refresh();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Update failed"),
  });

  const comment = useMutation({
    mutationFn: () =>
      addComment({
        data: {
          ticketId,
          body: note,
          authorName: user?.displayName ?? user?.primaryEmail ?? "Staff",
        },
      }),
    onSuccess: () => {
      setNote("");
      refresh();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Comment failed"),
  });

  const ticket = data?.ticket;

  if (isLoading) {
    return (
      <AppShell>
        <Page kicker="Work log" title="Loading item">
          <div className="h-40 animate-pulse rounded-xl bg-primary/6" />
        </Page>
      </AppShell>
    );
  }

  if (!ticket) {
    return (
      <AppShell>
        <Page kicker="Work log" title="Item not found">
          <Button asChild variant="outline">
            <Link to="/tickets">Back to work log</Link>
          </Button>
        </Page>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Page
        kicker={ticket.id}
        title={ticket.title}
        description={`${deskLabel(ticket.desk)} · ${ticket.category} · opened ${shortDate(ticket.createdAt)}`}
        actions={
          <Button asChild variant="outline">
            <Link to="/escalate" search={{ ticket: ticket.id }}>
              Escalation gate
            </Link>
          </Button>
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  {ticket.ferpa && <Badge tone="warn">FERPA</Badge>}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{ticket.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h2 className="font-display text-xl">Notes</h2>
                <ol className="mt-4 space-y-4">
                  {(data?.comments ?? []).map((c) => (
                    <li key={c.id} className="border-l-2 border-border pl-3">
                      <p className="text-xs text-muted">
                        {c.authorName} · {shortDate(c.createdAt)}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm">{c.body}</p>
                    </li>
                  ))}
                  {(data?.comments ?? []).length === 0 && (
                    <p className="text-sm text-muted">No notes yet.</p>
                  )}
                </ol>
                <form
                  className="mt-4 grid gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    comment.mutate();
                  }}
                >
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Internal note — no SSNs"
                    required
                  />
                  <Button type="submit" disabled={comment.isPending} className="justify-self-start">
                    Add note
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="grid gap-3 p-5 text-sm">
                <Row k="Requester" v={`${ticket.requesterName} · ${ticket.requesterRole}`} />
                <Row k="Email" v={ticket.requesterEmail} />
                {ticket.studentRef && <Row k="Student ref" v={ticket.studentRef} />}
                {ticket.populiModule && <Row k="Populi" v={ticket.populiModule} />}
                <Row k="Owner" v={ticket.assignedTo ?? "Unassigned"} />
                <Row k="Filed by" v={ticket.createdByName} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="grid gap-3 p-5">
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium">Status</span>
                  <select
                    className={selectClass}
                    value={ticket.status}
                    onChange={(e) =>
                      patch.mutate({ id: ticket.id, status: e.target.value as TicketStatus })
                    }
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium">Priority</span>
                  <select
                    className={selectClass}
                    value={ticket.priority}
                    onChange={(e) =>
                      patch.mutate({ id: ticket.id, priority: e.target.value as TicketPriority })
                    }
                  >
                    {priorities.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium">Resolution note</span>
                  <Textarea
                    value={resolution || ticket.resolution || ""}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="What fixed it"
                  />
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    patch.mutate({
                      id: ticket.id,
                      resolution: resolution || ticket.resolution,
                      status: ticket.status === "open" ? "resolved" : ticket.status,
                    })
                  }
                >
                  Save resolution
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Page>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-xs tracking-wide text-muted uppercase">{k}</p>
      <p className="mt-0.5">{v}</p>
    </div>
  );
}

const selectClass =
  "flex h-11 w-full rounded-sm border border-border bg-raised px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
