import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Menu,
  MessageCircle,
  Users,
} from "lucide-react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { isAllowedAdminEmail } from "@/lib/admin-allowlist";
import { initials } from "@/lib/utils";
import { NsbtMark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/ask", label: "Ask the desk", icon: MessageCircle },
  { to: "/staff", label: "Who can sign in", icon: Users },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5">
      {navItems.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-base font-medium transition-colors duration-150",
              active ? "bg-primary text-primary-fg" : "text-ink/80 hover:bg-primary/6 hover:text-ink",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useCurrentUserState();
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3 px-1">
        <NsbtMark className="size-9" />
        <div className="min-w-0">
          <p className="font-display text-base leading-tight font-medium">NSBT Populi AI Help Desk</p>
          <p className="truncate text-xs text-muted">Named administrators only</p>
        </div>
      </Link>
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto space-y-3">
        <a
          href="https://nsbt.populiweb.com"
          target="_blank"
          rel="noreferrer"
          className="flex h-11 items-center gap-2 rounded-md border border-border px-3 text-sm hover:bg-raised"
        >
          Open Populi campus
        </a>
        <div className="flex items-center gap-2 px-1">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="" className="size-8 rounded-full object-cover" />
          ) : (
            <span className="grid size-8 place-items-center rounded-full bg-primary text-[0.6875rem] font-medium text-primary-fg">
              {initials(user?.displayName ?? user?.primaryEmail)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.displayName ?? "Operator"}</p>
            <p className="truncate text-xs text-muted">{user?.primaryEmail}</p>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && !isAllowedAdminEmail(user.primaryEmail)) {
      void signOut("/login?denied=1");
    }
  }, [user]);

  if (isPending) {
    return (
      <div className="flex min-h-svh">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-surface md:block" />
        <main className="flex-1 p-6">
          <div className="h-8 w-48 animate-pulse rounded-md bg-primary/8" />
        </main>
      </div>
    );
  }

  if (!user || !isAllowedAdminEmail(user.primaryEmail)) return <RedirectToSignIn />;

  return (
    <div className="flex min-h-svh">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 overflow-y-auto border-r border-border bg-surface md:block">
        <SidebarBody />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-surface px-3 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
          <NsbtMark className="size-7" />
          <span className="font-display text-base font-medium">NSBT Populi AI Help Desk</span>
        </header>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left">
            <SidebarBody onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
