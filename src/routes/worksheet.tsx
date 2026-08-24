import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/worksheet")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
