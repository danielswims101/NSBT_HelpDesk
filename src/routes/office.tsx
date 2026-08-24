import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Page } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { directory } from "@/data/directory";
import { officeFacts, officeFunctions } from "@/data/office";
import { deskLabel } from "@/lib/desk-role";
import { NSBT } from "@/lib/populi";

export const Route = createFileRoute("/office")({ component: OfficePage });

function OfficePage() {
  return (
    <AppShell>
      <Page
        kicker={officeFacts.name}
        title="One office now"
        purpose="see what Student Records and Accounts does, and who to write."
        description="Registrar and Bursar are no longer two offices. Records and student accounts live in Populi under this office."
        actions={
          <Button asChild>
            <a href={`mailto:${NSBT.officeEmail}`}>{NSBT.officeEmail}</a>
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs tracking-wide text-muted uppercase">Student channel</p>
              <p className="mt-2 font-display text-xl">{NSBT.officeEmail}</p>
              <p className="mt-2 text-sm text-muted">
                Every student inquiry about records or accounts comes here. Not a faculty inbox. Not Populi Support.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs tracking-wide text-muted uppercase">System of record</p>
              <p className="mt-2 font-display text-xl">Populi</p>
              <p className="mt-2 text-sm text-muted">{officeFacts.system}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs tracking-wide text-muted uppercase">Authority</p>
              <p className="mt-2 text-sm leading-relaxed">{officeFacts.authority}</p>
            </CardContent>
          </Card>
        </div>

        <section className="mt-8">
          <h2 className="font-display text-2xl">Functions of the Office</h2>
          <p className="mt-1 text-sm text-muted">From the official office description. This is the job — not a suggestion.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {officeFunctions.map((fn) => (
              <article key={fn.id} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
                <p className="font-mono text-xs text-muted">{fn.letter}</p>
                <h3 className="mt-1 font-display text-xl">{fn.title}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {fn.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <h2 className="font-display text-lg">Oversight</h2>
              <p className="mt-2 text-sm leading-relaxed">{officeFacts.oversight}</p>
              <p className="mt-3 text-sm leading-relaxed">{officeFacts.accreditation}</p>
              <p className="mt-3 text-sm leading-relaxed">{officeFacts.supportStaff}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h2 className="font-display text-lg">Do not look for a Registrar or a Bursar</h2>
              <p className="mt-2 text-sm leading-relaxed">
                Those titles are gone. If a student, a faculty member, or an old web page still uses them, the work still lands here. You process it in Populi. You do not forward it to a person who no longer holds the function.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link to="/configure">Automation build order</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/knowledge/$slug" params={{ slug: "office-osra" }}>
                    Office playbook
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mt-8">
          <h2 className="mb-3 font-display text-2xl">Who you actually ask</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {directory.map((p) => (
              <article
                key={`${p.name}-${p.title}`}
                className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
              >
                <div className="mb-2">
                  <Badge>{p.desk === "external" ? "External" : deskLabel(p.desk)}</Badge>
                </div>
                <h3 className="font-display text-xl">{p.name}</h3>
                <p className="text-sm text-muted">{p.title}</p>
                <div className="mt-3 space-y-1 text-sm">
                  {p.email && (
                    <p>
                      <a className="underline-offset-4 hover:underline" href={`mailto:${p.email}`}>
                        {p.email}
                      </a>
                    </p>
                  )}
                  {p.phone && (
                    <p>
                      <a className="underline-offset-4 hover:underline" href={`tel:${p.phone.replaceAll("-", "")}`}>
                        {p.phone}
                      </a>
                    </p>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed">{p.notes}</p>
              </article>
            ))}
          </div>
        </section>
      </Page>
    </AppShell>
  );
}
