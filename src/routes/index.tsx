import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { HomeDesk } from "@/components/home-desk";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const user = useCurrentUser();
  return (
    <AppShell>
      <HomeDesk displayName={user?.displayName ?? null} email={user?.primaryEmail ?? null} />
    </AppShell>
  );
}
