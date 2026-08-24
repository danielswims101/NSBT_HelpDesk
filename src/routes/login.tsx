import { useEffect, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { isAllowedAdminEmail } from "@/lib/admin-allowlist";
import { NsbtMark } from "@/components/mark";
import { Button } from "@/components/ui/button";

type Search = { denied?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    denied: typeof s.denied === "string" ? s.denied : undefined,
  }),
  component: Login,
});

function Login() {
  const { user, isPending } = useCurrentUserState();
  const { denied } = Route.useSearch();
  const [error, setError] = useState<string | null>(denied ? "That Google account is not an authorized NSBT administrator." : null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user && !isAllowedAdminEmail(user.primaryEmail)) {
      void signOut("/login?denied=1");
    }
  }, [user]);

  if (!isPending && user && isAllowedAdminEmail(user.primaryEmail)) {
    return <Navigate to="/" />;
  }

  async function onGoogle(providerId: string) {
    setError(null);
    setBusy(true);
    try {
      await signIn(providerId, { callbackURL: "/", errorCallbackURL: "/login?denied=1" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <section className="relative hidden min-h-[40vh] overflow-hidden bg-primary lg:block">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-12deg, transparent, transparent 18px, currentColor 18px, currentColor 19px)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-10 text-primary-fg">
          <div className="flex items-center gap-3">
            <NsbtMark className="size-10 text-primary-fg" />
            <div>
              <p className="font-display text-xl">NSBT Populi AI Help Desk</p>
              <p className="text-sm text-primary-fg/75">Administrators Sign-In</p>
            </div>
          </div>
          <blockquote className="max-w-md">
            <p className="font-display text-2xl leading-snug">
              Named NSBT administrators only. Official @nsbt.org Google accounts.
            </p>
          </blockquote>
        </div>
      </section>
      <section className="flex flex-col justify-center px-5 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <NsbtMark className="size-9" />
            <div>
              <p className="font-display text-lg">NSBT Populi AI Help Desk</p>
              <p className="text-xs text-muted">Administrators Sign-In</p>
            </div>
          </div>
          <p className="text-xs tracking-wide text-muted uppercase">NSBT Populi AI Help Desk</p>
          <p className="mt-1 text-sm text-muted">Administrators Sign-In</p>
          <h1 className="mt-4 font-display text-3xl">Sign in</h1>
          <p className="mt-3 text-base leading-relaxed">
            This NSBT Populi AI Help Desk holds confidential information and records. Only
            Administrators are allowed to sign in with the official @nsbt.org Google accounts. If
            you are not an official NSBT administrator, accessing this page constitutes FERPA
            Federal Law violations with full enforcement of laws.
          </p>

          {authEnabled ? (
            <div className="mt-6 grid gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  disabled={busy}
                  onClick={() => void onGoogle(p.providerId)}
                >
                  {busy ? "Opening Google…" : `Continue with ${p.label}`}
                </Button>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
          )}
          {error && <p className="mt-4 text-sm text-danger">{error}</p>}
        </div>
      </section>
    </main>
  );
}
