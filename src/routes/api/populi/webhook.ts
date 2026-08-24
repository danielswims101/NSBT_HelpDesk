import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

export const Route = createFileRoute("/api/populi/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const text = await request.text();
        let body: unknown = text;
        try {
          body = JSON.parse(text);
        } catch {
          /* keep raw */
        }
        const sql = await getSql();
        await sql.query(`
          create table if not exists populi_pulls (
            id text primary key,
            kind text not null,
            pulled_at timestamptz not null default now(),
            pulled_by text not null,
            summary text not null,
            payload jsonb not null,
            check_ok boolean
          )
        `);
        await sql.query(
          `insert into populi_pulls (id, kind, pulled_by, summary, payload, check_ok)
           values ($1,'webhook','populi',$2,$3::jsonb,null)`,
          [
            `wh-${Date.now()}`,
            "Inbound Populi webhook",
            JSON.stringify({
              headers: {
                signature: request.headers.get("populi-rsa-sha256-signature"),
              },
              body,
            }),
          ],
        );
        return new Response(JSON.stringify({ ok: true }), {
          headers: { "content-type": "application/json" },
        });
      },
      GET: () =>
        new Response(JSON.stringify({ ok: true, hint: "POST only — paste this URL into Populi webhooks." }), {
          headers: { "content-type": "application/json" },
        }),
    },
  },
});
