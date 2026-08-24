import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Copy, Video } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Page } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import {
  MEET_INSTANT_URL,
  DESK_ROOM_SLUG,
  deskRoomUrl,
  joinUrlFromInput,
  calendarInviteUrl,
} from "@/lib/meet";
import { directory } from "@/data/directory";

export const Route = createFileRoute("/meet")({ component: MeetPage });

function openTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

async function copy(text: string, note: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(note);
  } catch {
    toast.error("Could not copy — select the link and copy it by hand.");
  }
}

function MeetPage() {
  const user = useCurrentUser();
  const [joinText, setJoinText] = useState("");
  const joinUrl = useMemo(() => joinUrlFromInput(joinText), [joinText]);
  const roomUrl = deskRoomUrl();

  // The other administrators you might call — everyone in the directory with an
  // @nsbt.org mailbox, minus yourself.
  const colleagues = directory.filter(
    (p) => p.email?.endsWith("@nsbt.org") && p.email !== user?.primaryEmail,
  );

  return (
    <AppShell>
      <Page
        kicker="Video call"
        title="Meet"
        purpose="starting or joining a video call with the other administrators over Google Meet."
        description="No new app and no new password. You are already signed in to Google with your @nsbt.org account, so every button here opens Google Meet in a new tab."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Instant meeting */}
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-xl">Start a new call</p>
                <Badge tone="ok">Instant</Badge>
              </div>
              <p className="mt-2 text-base leading-relaxed">
                Opens a brand-new Google Meet and puts you in as the host. Then press{" "}
                <span className="font-medium">Add others</span> inside Meet, or copy the link from
                your browser bar and send it to whoever should join.
              </p>
              <div className="mt-4">
                <Button asChild>
                  <a href={MEET_INSTANT_URL} target="_blank" rel="noreferrer">
                    <Video /> Start a Google Meet
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Standing desk room */}
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-xl">The desk room</p>
                <Badge>Same room every time</Badge>
              </div>
              <p className="mt-2 text-base leading-relaxed">
                One shared room for the office — nickname{" "}
                <span className="font-mono">{DESK_ROOM_SLUG}</span>. Everyone who opens it with an
                @nsbt.org account lands in the same call, so there is no link to pass around. Send an
                outside guest the instant link instead.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="secondary">
                  <a href={roomUrl} target="_blank" rel="noreferrer">
                    <Video /> Open the desk room
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void copy(roomUrl, "Desk room link copied")}
                >
                  <Copy /> Copy link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Join by code or link */}
        <Card className="mt-4">
          <CardContent className="p-5">
            <p className="font-display text-xl">Join a call someone sent you</p>
            <p className="mt-2 text-base leading-relaxed">
              Paste the Google Meet link or the code (it looks like{" "}
              <span className="font-mono">abc-defg-hij</span>) and press Join.
            </p>
            <form
              className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]"
              onSubmit={(e) => {
                e.preventDefault();
                if (joinUrl) openTab(joinUrl);
                else toast.error("That does not look like a Google Meet link or code.");
              }}
            >
              <Input
                inputMode="text"
                autoComplete="off"
                aria-label="Google Meet link or code"
                placeholder="meet.google.com/abc-defg-hij  —  or just abc-defg-hij"
                value={joinText}
                onChange={(e) => setJoinText(e.target.value)}
              />
              <Button type="submit" disabled={!joinUrl}>
                Join
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Invite a colleague through Calendar (which mints the Meet link) */}
        {colleagues.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-2xl">Invite an administrator to a call</h2>
            <p className="mt-1 text-base text-muted">
              This opens a Google Calendar invitation already addressed to them. Google adds the
              Meet link when you save it, and the invite lands in their inbox.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {colleagues.map((p) => (
                <article
                  key={p.email}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
                >
                  <div className="min-w-0">
                    <h3 className="font-display text-lg">{p.name}</h3>
                    <p className="truncate text-sm text-muted">{p.email}</p>
                  </div>
                  <Button asChild size="sm" variant="secondary">
                    <a
                      href={calendarInviteUrl({
                        title: "NSBT desk — video call",
                        guests: p.email ? [p.email] : [],
                        details: "Google Meet call for NSBT administrators.",
                      })}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Video /> Schedule a call
                    </a>
                  </Button>
                </article>
              ))}
            </div>
          </section>
        )}
      </Page>
    </AppShell>
  );
}
