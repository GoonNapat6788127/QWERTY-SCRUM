"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/client";
import type { PublicUser, Role } from "@/lib/types";

type NavItem = { href: string; label: string; roles: Role[] };

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Operations board", roles: ["donor", "foodbank", "driver", "logistics"] },
  { href: "/donations/new", label: "Log a donation", roles: ["donor"] },
  { href: "/donations", label: "Donations", roles: ["donor", "foodbank", "driver", "logistics"] },
  { href: "/queue", label: "Matching queue", roles: ["donor", "foodbank", "driver", "logistics"] },
  { href: "/dispatch", label: "Driver dispatch", roles: ["driver", "foodbank", "logistics"] },
  { href: "/food-banks", label: "Food banks", roles: ["foodbank", "driver", "logistics"] },
  { href: "/drivers", label: "Driver activity", roles: ["foodbank", "logistics"] },
  { href: "/receipts", label: "Receipts & tax", roles: ["donor", "logistics"] },
  { href: "/notifications", label: "Expiry alerts", roles: ["donor", "foodbank", "driver", "logistics"] },
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
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-forest text-paper">
        <div className="flex h-full flex-col px-5 py-6">
          <Link href="/dashboard" className="block">
            <p className="font-[family-name:var(--font-display)] text-2xl leading-none">QWERTY</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-leaf">Rescue ERP</p>
          </Link>
          <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-white/50">Sprint 1 workspace</p>
          <nav className="mt-3 flex flex-col gap-1">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm ${active ? "bg-white/10 text-white" : "text-white/75 hover:bg-white/5 hover:text-white"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-xl bg-forest-2 p-3 text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-white/60">{user.organization}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-leaf">{user.role}</p>
            <button
              type="button"
              onClick={() => void logout()}
              className="mt-3 text-xs text-white/70 underline-offset-2 hover:underline"
            >
              Sign out
            </button>
            {error ? <p className="mt-2 text-xs text-orange-200">{error}</p> : null}
          </div>
        </div>
      </aside>
      <div className="min-h-screen">
        <header className="flex items-center justify-between border-b border-line bg-panel px-6 py-3">
          <p className="text-sm text-muted">Surplus food logistics · Asia/Bangkok</p>
          <p className="font-mono text-xs text-muted">US1a queue &lt; 1 min · US1b match &lt; 2 min</p>
        </header>
        <main className="px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
