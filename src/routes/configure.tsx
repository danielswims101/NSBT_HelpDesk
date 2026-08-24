import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/configure")({
  beforeLoad: () => {
    throw redirect({ to: "/ask" });
  },
});
