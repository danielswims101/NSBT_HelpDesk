import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/leadership")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
