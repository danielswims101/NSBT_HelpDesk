import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPopuliLink, savePopuliKey, testPopuliLink, type LinkStatus } from "@/lib/populi-link";
import { POPULI } from "@/lib/populi";

export function LiveLink() {
  const [status, setStatus] = useState<LinkStatus | null>(null);
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      setStatus(await getPopuliLink());
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-xl">Populi</p>
          {status?.linked ? <Badge tone="ok">Connected</Badge> : <Badge tone="warn">No key</Badge>}
        </div>
        <p className="mt-2 text-base">
          {status?.linked
            ? `Key on file (…${status.last4 ?? "••••"}) — Academic Auditor + Financial Auditor${status.lastOkAt ? ` · last call ${status.lastOkAt.slice(0, 16).replace("T", " ")}` : ""}`
            : "Paste a live sk_ key once. Academic Auditor + Financial Auditor is enough. Then this desk reads the campus."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void testPopuliLink()
                .then((o) => toast.success(o.note ?? "Connected"))
                .catch((e) => toast.error(e instanceof Error ? e.message : "Failed"))
                .finally(() => setBusy(false));
            }}
          >
            Test
          </Button>
          <a href={POPULI.campusHome} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center px-3 text-base underline-offset-4 hover:underline">
            Open campus
          </a>
        </div>
        <form
          className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            setBusy(true);
            void savePopuliKey({ data: { key } })
              .then((s) => {
                setKey("");
                toast.success(`Key stored (…${s.last4})`);
                return refresh();
              })
              .catch((err) => toast.error(err instanceof Error ? err.message : "Could not store"))
              .finally(() => setBusy(false));
          }}
        >
          <Input
            type="password"
            autoComplete="off"
            placeholder="Paste sk_ key only if you need to replace it"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <Button type="submit" disabled={busy || !key.trim()}>
            Store key
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
