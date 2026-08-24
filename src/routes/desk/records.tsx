import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/desk/records")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
