import { useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { triageOptions } from "@/data/triage";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { createTicket } from "@/lib/tickets";
import type { Desk, RequesterRole, TicketPriority } from "@/lib/types";

type Search = { topic?: string };

export const Route = createFileRoute("/tickets/new")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    topic: typeof search.topic === "string" ? search.topic : undefined,
  }),
  component: NewTicket,
});

function NewTicket() {
  const { topic } = Route.useSearch();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const hint = triageOptions.find((t) => t.id === topic);
  const [title, setTitle] = useState(hint ? hint.label : "");
  const [description, setDescription] = useState(hint ? hint.summary : "");
  const [desk, setDesk] = useState<Desk>(hint?.desk ?? "shared");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState<TicketPriority>(hint?.populi === "if-outage" ? "urgent" : "normal");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterRole, setRequesterRole] = useState<RequesterRole>("student");
  const [studentRef, setStudentRef] = useState("");
  const [populiModule, setPopuliModule] = useState("");
  const [ferpa, setFerpa] = useState(true);

  const mutation = useMutation({
    mutationFn: () =>
      createTicket({
        data: {
          title,
          description,
          desk,
          category,
          priority,
          requesterName,
          requesterEmail,
          requesterRole,
          studentRef,
          populiModule,
          ferpa,
          authorName: user?.displayName ?? user?.primaryEmail ?? "Staff",
        },
      }),
    onSuccess: (res) => {
      toast.success(`${res.id} opened`);
      void navigate({ to: "/tickets/$ticketId", params: { ticketId: res.id } });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not create ticket"),
  });

  return (
    <AppShell>
      <Page
        kicker="Work notes"
        title="Write a note"
        purpose="leave a paper trail for the other administrators."
        description="No Social Security numbers. No card numbers."
      >
        <form
          className="grid max-w-3xl gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Field>
          <Field label="What happened">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-36"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Which work">
              <select className={selectClass} value={desk} onChange={(e) => setDesk(e.target.value as Desk)}>
                <option value="it">Systems</option>
                <option value="records">Records</option>
                <option value="shared">Everyone</option>
              </select>
            </Field>
            <Field label="Category">
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </Field>
            <Field label="Priority">
              <select
                className={selectClass}
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Requester name">
              <Input value={requesterName} onChange={(e) => setRequesterName(e.target.value)} required />
            </Field>
            <Field label="Requester email">
              <Input
                type="email"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                required
              />
            </Field>
            <Field label="Requester role">
              <select
                className={selectClass}
                value={requesterRole}
                onChange={(e) => setRequesterRole(e.target.value as RequesterRole)}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff</option>
                <option value="alumni">Alumni</option>
                <option value="applicant">Applicant</option>
              </select>
            </Field>
            <Field label="Student / alumni id (optional)">
              <Input value={studentRef} onChange={(e) => setStudentRef(e.target.value)} />
            </Field>
          </div>
          <Field label="Populi path or module">
            <Input
              value={populiModule}
              onChange={(e) => setPopuliModule(e.target.value)}
              placeholder="Profile → Info → User account"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={ferpa}
              onChange={(e) => setFerpa(e.target.checked)}
              className="size-4 accent-primary"
            />
            Treat as an education record (FERPA)
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save to work log"}
            </Button>
            <Button type="button" variant="outline" onClick={() => history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Page>
    </AppShell>
  );
}

const selectClass =
  "flex h-11 w-full rounded-sm border border-border bg-raised px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
