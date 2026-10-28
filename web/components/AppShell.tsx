"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/client";
import type { PublicUser, Role } from "@/lib/types";

type NavItem = { href: string; label: string; roles: Role[]; sprint: 1 | 2 };

const NAV: NavItem[] = [
  { href: "/donations/new", label: "Log a donation", roles: ["donor"], sprint: 1 },
  { href: "/donations", label: "Donations", roles: ["donor", "foodbank", "driver", "logistics"], sprint: 1 },
  { href: "/queue", label: "Matching queue", roles: ["donor", "foodbank", "driver", "logistics"], sprint: 1 },
  { href: "/dispatch", label: "Driver dispatch", roles: ["driver", "foodbank", "logistics"], sprint: 1 },
  { href: "/incoming", label: "Incoming pickups", roles: ["foodbank", "logistics"], sprint: 1 },
  { href: "/food-banks", label: "Food banks", roles: ["foodbank", "driver", "logistics"], sprint: 1 },
  { href: "/receipts", label: "Receipts", roles: ["donor", "logistics"], sprint: 1 },
  { href: "/dashboard", label: "Operations board", roles: ["donor", "foodbank", "driver", "logistics"], sprint: 2 },
  { href: "/drivers", label: "Driver activity", roles: ["foodbank", "logistics"], sprint: 2 },
  { href: "/notifications", label: "Expiry alerts", roles: ["donor", "foodbank", "driver", "logistics"], sprint: 2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ user: PublicUser }>("/api/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => router.replace("/"));
  }, [router]);

  const items = useMemo(
    () => NAV.filter((item) => (user ? item.roles.includes(user.role) : false)),
    [user],
  );

  async function logout() {
    try {
      await api("/api/auth/logout", { method: "POST" });
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign out.");
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Loading workspace…
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="bg-forest text-paper lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="flex h-full flex-col px-5 py-6">
          <Link href="/queue" className="block">
            <p className="font-[family-name:var(--font-display)] text-3xl leading-none">QWERTY</p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-leaf">Rescue ERP</p>
          </Link>
          <nav className="mt-8 flex flex-col gap-1">
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Sprint 1</p>
            {items
              .filter((item) => item.sprint === 1)
              .map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2.5 text-base ${active ? "bg-white/15 font-semibold text-white" : "text-white/85 hover:bg-white/10 hover:text-white"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            <p className="mt-6 px-3 pb-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Sprint 2 backlog</p>
            {items
              .filter((item) => item.sprint === 2)
              .map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2.5 text-base ${active ? "bg-white/15 font-semibold text-white" : "text-white/85 hover:bg-white/10 hover:text-white"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>
          <div className="mt-8 rounded-xl bg-forest-2 p-4 text-base">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-white/75">{user.organization}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-leaf">{user.role}</p>
            <button
              type="button"
              onClick={() => void logout()}
              className="mt-3 text-sm text-white underline-offset-2 hover:underline"
            >
              Sign out
            </button>
            {error ? <p className="mt-2 text-xs text-orange-200">{error}</p> : null}
          </div>
        </div>
      </aside>
      <div className="min-h-screen">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-panel px-8 py-4">
          <p className="text-base text-ink">Surplus food logistics · Asia/Bangkok</p>
          <p className="font-mono text-sm text-muted">Queue under 1 min · Match under 2 min</p>
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
