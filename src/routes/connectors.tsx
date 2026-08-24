import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { LiveLink } from "@/components/live-link";
import { Page } from "@/components/page";

export const Route = createFileRoute("/connectors")({ component: ConnectorsPage });

function ConnectorsPage() {
  return (
    <AppShell>
      <Page
        kicker="Populi"
        title="Connection"
        purpose="this desk already talks to Populi. Only paste a key if the connection is off."
      >
        <LiveLink />
      </Page>
    </AppShell>
  );
}
