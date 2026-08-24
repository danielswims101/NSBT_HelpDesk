import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export type LinkStatus = {
  linked: boolean;
  last4: string | null;
  setAt: string | null;
  setBy: string | null;
  lastOkAt: string | null;
  lastError: string | null;
  webhookUrl: string;
};

export type TermRow = {
  id: string;
  name: string;
  start: string;
  end: string;
  entrance: boolean;
  year: string;
};

export type SavedPull = {
  id: string;
  kind: string;
  pulledAt: string;
  pulledBy: string;
  summary: string;
  checkOk: boolean | null;
  payload: {
    terms?: TermRow[];
    years?: string[];
    granted?: number;
    dates?: { date: string; total: number; byDegree: Record<string, number> }[];
    asOf?: number;
    currentTerm?: string;
    byYear?: Record<string, number>;
    y2024?: number;
    y2025?: number;
    addresses?: {
      personId: string;
      name: string;
      status: string;
      type: string;
      street: string;
      city: string;
      state: string;
      postal: string;
      country: string;
    }[];
    withHome?: number;
    missingHome?: number;
    count?: number;
    byStatus?: Record<string, number>;
    rows?: { label: string; value: string }[];
  };
  sentAt: string | null;
  sentTo: string | null;
};

export const getPopuliLink = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.getLinkStatus(context.bearerToken);
  });

export const savePopuliKey = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((v: { key: string }) => v)
  .handler(async ({ data, context }) => {
    const mod = await import("./populi-api.server");
    return mod.storeKey(data.key, context.bearerToken);
  });

export const testPopuliLink = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.testLink(context.bearerToken);
  });

export const pullTermInventory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.pullTerms(context.bearerToken);
  });

export const pullConferrals = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.pullDegrees(context.bearerToken);
  });

export const pullHeadcount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.pullYears(context.bearerToken);
  });

export const pullHomeAddresses = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.pullAddresses(context.bearerToken);
  });

export const pullCatalog = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.pullCatalog(context.bearerToken);
  });

export const pullStudents = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.pullStudents(context.bearerToken);
  });

export const pullInvoices = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.pullInvoices(context.bearerToken);
  });

export const pullRoles = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.pullRoles(context.bearerToken);
  });

export const pullTranscripts = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.pullTranscripts(context.bearerToken);
  });

export const pullOfferings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.pullOfferings(context.bearerToken);
  });

export const listLatestPulls = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const mod = await import("./populi-api.server");
    return mod.listLatestPulls(context.bearerToken);
  });

export const sendPullToAngela = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((v: { id: string }) => v)
  .handler(async ({ data, context }) => {
    const mod = await import("./populi-api.server");
    return mod.markPullSent(data.id, context.bearerToken);
  });
