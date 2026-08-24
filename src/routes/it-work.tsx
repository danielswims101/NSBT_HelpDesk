import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/it-work")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
