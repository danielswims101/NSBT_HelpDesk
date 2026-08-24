import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DeskChat } from "@/components/desk-chat";
import { Page } from "@/components/page";

export const Route = createFileRoute("/ask")({ component: AskPage });

function AskPage() {
  return (
    <AppShell>
      <Page
        kicker="Ask the desk"
        title="Say what to pull"
        purpose="the desk runs it on Populi and puts the numbers on Home."
        description="Do not paste student lists, Social Security numbers, or account numbers."
      >
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <DeskChat />
        </div>
      </Page>
    </AppShell>
  );
}
