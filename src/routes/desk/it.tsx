import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/desk/it")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
