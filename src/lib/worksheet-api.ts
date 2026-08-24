import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export type CardAnswer = {
  code: string;
  title: string;
  summary: string;
  checkOk: boolean | null;
  rows: { label: string; value: string }[];
  cannot?: string;
};

export type WorksheetBundle = {
  id: string;
  pulledAt: string;
  pulledBy: string;
  answers: CardAnswer[];
};

export const runWorksheet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./worksheet-api.server");
    return mod.runWorksheetBundle(context.bearerToken);
  });

export const getWorksheetBundle = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./worksheet-api.server");
    return mod.latestWorksheetBundle(context.bearerToken);
  });
