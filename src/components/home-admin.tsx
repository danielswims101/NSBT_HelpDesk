import { Link } from "@tanstack/react-router";
import { ClipboardCheck, MessageCircle, Scale } from "lucide-react";
import { Page } from "@/components/page";
import { DeskChat } from "@/components/desk-chat";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function HomeAdmin({
  displayName,
  email,
}: {
  displayName: string | null;
  email: string | null;
}) {
  const who = displayName?.trim() || email || "Administrator";

  return (
    <Page
      kicker="NSBT Populi AI Help Desk"
      title="Hello — this desk is for you"
      purpose="ask the desk to pull a list from Populi, or review a file."
      description={`${who}. Students never see this desk.`}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Link to="/worksheet" className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <ClipboardCheck className="size-5 text-primary" />
          <h2 className="mt-3 font-display text-2xl">Pull from Populi</h2>
          <p className="mt-2 text-base text-muted">One button. Numbers land here.</p>
        </Link>
        <Link to="/leadership" className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <Scale className="size-5 text-primary" />
          <h2 className="mt-3 font-display text-2xl">Review a file</h2>
          <p className="mt-2 text-base text-muted">Accept it or send it back.</p>
        </Link>
        <Link to="/ask" className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <MessageCircle className="size-5 text-primary" />
          <h2 className="mt-3 font-display text-2xl">Ask the desk</h2>
          <p className="mt-2 text-base text-muted">Say “pull home addresses.” It runs.</p>
        </Link>
      </div>

      <Card className="mt-6">
        <CardContent className="p-5">
          <p className="text-base">Curious about the office pulls?</p>
          <Button asChild variant="outline" className="mt-3">
            <Link to="/it-work">See Director of IT Work Page</Link>
          </Button>
        </CardContent>
      </Card>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Ask the desk</h2>
        <div className="mt-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <DeskChat />
        </div>
      </section>
    </Page>
  );
}
