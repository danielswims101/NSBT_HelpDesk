import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/knowledge/$slug")({
  beforeLoad: () => {
    throw redirect({ to: "/ask" });
  },
});
