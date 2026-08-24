import { Page } from "@/components/page";
import { PopuliPulls } from "@/components/populi-pulls";
import { DeskChat } from "@/components/desk-chat";
import { LiveLink } from "@/components/live-link";
import { firstName } from "@/lib/admin-home";

export function HomeDesk({
  displayName,
  email,
}: {
  displayName: string | null;
  email: string | null;
}) {
  const who = firstName(displayName, email);

  return (
    <Page
      kicker="NSBT Populi AI Help Desk"
      title={`Hello ${who}`}
      purpose="press a button. Populi fills this page. Same desk for everyone who is allowed in."
      description={`${email ?? "Administrator"}. Read-only. Students never see this desk.`}
    >
      <LiveLink />

      <section className="mt-8">
        <h2 className="font-display text-2xl">Pull from Populi</h2>
        <p className="mt-2 text-base text-muted">Every year on campus, not the term that happens to be open.</p>
        <div className="mt-4">
          <PopuliPulls />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Ask the desk</h2>
        <p className="mt-2 text-base text-muted">Say what to pull. It runs.</p>
        <div className="mt-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <DeskChat />
        </div>
      </section>
    </Page>
  );
}
