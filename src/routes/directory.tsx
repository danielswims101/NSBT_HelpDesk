import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/directory")({
  beforeLoad: () => {
    throw redirect({ to: "/office" });
  },
  component: () => null,
});
