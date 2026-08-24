import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/runbooks/")({
  beforeLoad: () => {
    throw redirect({ to: "/ask" });
  },
});
