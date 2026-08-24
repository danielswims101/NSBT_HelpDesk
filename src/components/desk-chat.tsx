import { useEffect, useRef, useState } from "react";
import { askDesk } from "@/lib/desk-chat";
import { adminPrompts } from "@/data/desk-knowledge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Msg = {
  role: "user" | "assistant";
  content: string;
  links?: { title: string; href: string }[];
};

export function DeskChat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Say what to pull. I will run it on Populi and put the numbers on Home.",
    },
  ]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const prompts = adminPrompts;

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    setText("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setBusy(true);
    try {
      const out = await askDesk({ data: { question: q } });
      if (!out.ok) {
        setMessages((m) => [...m, { role: "assistant", content: out.error }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: out.text, links: out.links }]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I could not finish that pull. Ask again in a minute, or press a button on Home." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[28rem] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div
            key={`${i}-${m.role}`}
            className={cn(
              "max-w-[40rem] rounded-xl px-4 py-3 text-base leading-relaxed whitespace-pre-wrap",
              m.role === "user" ? "ml-auto bg-primary text-primary-fg" : "bg-bg text-ink",
            )}
          >
            {m.content}
            {m.links && m.links.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {m.links.map((l) => (
                  <a
                    key={l.href + l.title}
                    href={l.href}
                    className="text-base underline-offset-4 hover:underline"
                  >
                    Open: {l.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {busy && <p className="text-base text-muted">Pulling from Populi…</p>}
        <div ref={end} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p}
            type="button"
            className="rounded-full border border-border bg-surface px-3 py-2 text-left text-sm hover:bg-bg"
            onClick={() => void send(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <form
        className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          void send(text);
        }}
      >
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pull every term"
          className="min-h-20 text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(text);
            }
          }}
        />
        <Button type="submit" disabled={busy || !text.trim()} className="h-12">
          Ask
        </Button>
      </form>
      <p className="mt-2 text-sm text-muted">Do not paste student names, grades, or account numbers.</p>
    </div>
  );
}
