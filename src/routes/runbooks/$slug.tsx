import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/runbooks/$slug")({
  beforeLoad: () => {
    throw redirect({ to: "/ask" });
  },
});
