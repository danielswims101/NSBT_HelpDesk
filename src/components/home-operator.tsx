import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Page } from "@/components/page";
import { PopuliPulls } from "@/components/populi-pulls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { firstName } from "@/lib/admin-home";
import { NSBT } from "@/lib/populi";
import { sendPullToAngela } from "@/lib/populi-link";
import { getWorksheetBundle, runWorksheet, type CardAnswer, type WorksheetBundle } from "@/lib/worksheet-api";

export function HomeOperator({
  displayName,
  email,
  guest,
}: {
  displayName: string | null;
  email: string | null;
  guest?: boolean;
}) {
  const [bundle, setBundle] = useState<WorksheetBundle | null>(null);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    void getWorksheetBundle()
      .then((b) => setBundle(b))
      .catch(() => undefined);
  }, []);

  async function run() {
    setBusy(true);
    try {
      const next = await runWorksheet();
      setBundle(next);
      toast.success("Numbers are on this page from Populi");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The pull did not finish");
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    if (!bundle?.id) return;
    setSending(true);
    try {
      const packet = await sendPullToAngela({ data: { id: bundle.id } });
      try {
        await navigator.clipboard.writeText(packet.body);
      } catch {
        /* ignore */
      }
      window.location.href = packet.mailto;
      toast.success(`Email to ${NSBT.angelaName} is open`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not open the email");
    } finally {
      setSending(false);
    }
  }

  const passed = bundle?.answers.filter((a) => a.checkOk === true).length ?? 0;
  const failed = bundle?.answers.filter((a) => a.checkOk === false).length ?? 0;

  return (
    <Page
      kicker={guest ? "Director of IT work page" : "Director of IT · it@nsbt.org"}
      title={guest ? "Director of IT work page" : `Hello ${firstName(displayName, email)}`}
      purpose="press one button. The campus fills the cards. Read the numbers. Send them to Angela."
      description={guest ? "You may look. The pulls belong to that office." : "One mailbox: it@nsbt.org."}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={busy} onClick={() => void run()}>
            {busy ? "Pulling from Populi…" : "Pull the worksheet from Populi"}
          </Button>
          {bundle && (
            <Button type="button" variant="secondary" disabled={sending} onClick={() => void send()}>
              {sending ? "Opening email…" : `Send to ${NSBT.angelaName}`}
            </Button>
          )}
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs tracking-wide text-muted uppercase">CHECK passed</p>
            <p className="mt-1 font-display text-3xl tabular-nums">{passed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs tracking-wide text-muted uppercase">CHECK failed</p>
            <p className="mt-1 font-display text-3xl tabular-nums">{failed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs tracking-wide text-muted uppercase">Last pull</p>
            <p className="mt-1 text-base">{bundle ? bundle.pulledAt.slice(0, 16).replace("T", " ") : "Not yet"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 space-y-4">
        {bundle ? (
          bundle.answers.map((a) => <AnswerCard key={a.code} answer={a} />)
        ) : (
          <Card>
            <CardContent className="p-5">
              <p className="text-base">Nothing from Populi on this page yet. Press the navy button. Stay here. It can take a minute.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Single lists</h2>
        <p className="mt-1 text-base text-muted">Need only terms, degrees, headcount, or home addresses? Use these.</p>
        <div className="mt-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <PopuliPulls />
        </div>
      </section>
    </Page>
  );
}

function AnswerCard({ answer }: { answer: CardAnswer }) {
  return (
    <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-display text-xl">
          {answer.code} · {answer.title}
        </p>
        {answer.checkOk === true && <Badge tone="ok">CHECK passed</Badge>}
        {answer.checkOk === false && <Badge tone="warn">CHECK failed</Badge>}
        {answer.cannot && <Badge tone="mute">Not in the API</Badge>}
      </div>
      <p className="mt-2 text-base leading-relaxed">{answer.summary}</p>
      {answer.cannot && <p className="mt-2 text-base text-muted">{answer.cannot}</p>}
      {answer.rows.length > 0 && (
        <dl className="mt-3 max-h-56 overflow-auto text-base">
          {answer.rows.map((r, i) => (
            <div key={`${r.label}-${i}`} className="grid gap-1 border-t border-border/60 py-2 sm:grid-cols-[14rem_1fr]">
              <dt className="text-muted">{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}
