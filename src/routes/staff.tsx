import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { staffRoles, staffRules } from "@/data/staff-access";
import { NSBT, POPULI } from "@/lib/populi";

export const Route = createFileRoute("/staff")({ component: StaffPage });

function StaffPage() {
  return (
    <AppShell>
      <Page
        kicker="Who can sign in"
        title="Who may sign in"
        purpose="see who may open this desk and how they get in."
        description="Only the official @nsbt.org Google accounts listed below. Anyone else is turned away."
        actions={
          <Button asChild>
            <a href={POPULI.campusHome} target="_blank" rel="noreferrer">
              Open Populi campus
            </a>
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs tracking-wide text-muted uppercase">Where it lives</p>
              <p className="mt-2 text-base leading-relaxed">
                Staff will use desk.nsbt.org once that name is attached. Until then, sign in here with your NSBT Google account.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs tracking-wide text-muted uppercase">Where it does not live</p>
              <p className="mt-2 text-base leading-relaxed">
                Not a page on {NSBT.site}. Not inside Populi. Students never see it.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs tracking-wide text-muted uppercase">How a person gets in</p>
              <p className="mt-2 text-sm leading-relaxed">
                Open this address. Continue with Google using an official @nsbt.org account listed below. Use the left nav. Nothing to install.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardContent className="p-5">
            <h2 className="font-display text-xl">If you need the API or Webhooks page later</h2>
            <p className="mt-2 text-base leading-relaxed">
              In Populi: your photo (top right) → Account & Settings → Account. In the left list, API is near the bottom. Webhooks is two items above it.
            </p>
          </CardContent>
        </Card>

        <section className="mt-8">
          <h2 className="font-display text-2xl">Who uses which door</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {staffRoles.map((r) => (
              <article key={r.who} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
                <h3 className="font-display text-xl">{r.who}</h3>
                <p className="mt-2 text-sm leading-relaxed">{r.does}</p>
                <p className="mt-3 text-xs tracking-wide text-muted uppercase">Opens</p>
                <p className="mt-1 text-sm">{r.opens}</p>
              </article>
            ))}
          </div>
        </section>

        <Card className="mt-8">
          <CardContent className="p-5">
            <h2 className="font-display text-xl">House rules</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {staffRules.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/">Open Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Page>
    </AppShell>
  );
}
