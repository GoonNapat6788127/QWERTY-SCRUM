"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/client";
import type { PublicUser, Role } from "@/lib/types";

const SIDE_CSS = `
.side-menu {
  background:
    radial-gradient(circle at 12% 0%, rgba(198, 161, 91, 0.38), transparent 32%),
    radial-gradient(circle at 100% 100%, rgba(31, 138, 91, 0.45), transparent 36%),
    linear-gradient(180deg, #17634a 0%, #0e3b2e 42%, #0a2c22 100%);
  box-shadow: 12px 0 36px rgba(14, 59, 46, 0.22);
}
.side-brand { display: flex; align-items: center; gap: 0.85rem; border-bottom: 1px solid rgba(198, 161, 91, 0.35); padding-bottom: 1.25rem; }
.side-mark { width: 2.7rem; height: 2.7rem; flex: none; border-radius: 999px; background: radial-gradient(circle at 35% 30%, #f3d48a, transparent 42%), linear-gradient(145deg, #2f9e62, #0e3b2e); box-shadow: 0 0 0 3px rgba(198, 161, 91, 0.45), 0 8px 16px rgba(0, 0, 0, 0.2); }
.nav-kicker { display: flex; align-items: center; gap: 0.65rem; padding: 0 0.8rem 0.35rem; color: rgba(255, 253, 248, 0.62); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
.nav-kicker::after { content: ""; height: 1px; flex: 1; background: linear-gradient(90deg, rgba(198, 161, 91, 0.85), transparent); }
.nav-link { display: flex; align-items: center; gap: 0.7rem; margin-top: 0.15rem; border-radius: 999px; padding: 0.65rem 0.9rem; color: rgba(255, 253, 248, 0.88); }
.nav-link:hover { background: rgba(255, 253, 248, 0.08); color: white; }
.nav-link-active { background: linear-gradient(90deg, rgba(198, 161, 91, 0.42), rgba(255, 253, 248, 0.12)); color: white; font-weight: 650; box-shadow: inset 0 0 0 1px rgba(243, 212, 138, 0.45); }
.nav-gem { width: 0.55rem; height: 0.55rem; flex: none; border-radius: 999px; background: #f3d48a; box-shadow: 0 0 0 3px rgba(243, 212, 138, 0.22); }
.nav-link-active .nav-gem { background: white; box-shadow: 0 0 0 3px rgba(255, 253, 248, 0.28); }
.side-profile { margin-top: auto; border-radius: 1.25rem; border: 1px solid rgba(243, 212, 138, 0.35); background: linear-gradient(180deg, rgba(255, 253, 248, 0.1), rgba(10, 44, 34, 0.35)); padding: 1rem; }
.side-signout { margin-top: 0.8rem; border-radius: 999px; border: 1px solid rgba(255, 253, 248, 0.35); padding: 0.35rem 0.8rem; font-size: 0.85rem; color: white; }
.side-signout:hover { background: rgba(255, 253, 248, 0.12); }
`;

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

  const scene = pathname.startsWith("/dispatch") || pathname.startsWith("/incoming") || pathname.startsWith("/drivers")
    ? "scene-street"
    : pathname.startsWith("/receipts")
      ? "scene-receipt"
      : pathname.startsWith("/dashboard") || pathname.startsWith("/food-banks") || pathname.startsWith("/notifications")
        ? "scene-kitchen"
        : "scene-produce";
  const sceneImage = {
    "scene-street": "/bg-street.jpg",
    "scene-receipt": "/bg-receipt.jpg",
    "scene-kitchen": "/bg-kitchen.jpg",
    "scene-produce": "/bg-produce.jpg",
  }[scene];

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Loading workspace…
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <style>{SIDE_CSS}</style>
      <aside className="side-menu text-paper lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="flex h-full flex-col px-5 py-6">
          <Link href="/queue" className="side-brand">
            <span className="side-mark" aria-hidden="true" />
            <span>
              <p className="font-[family-name:var(--font-display)] text-3xl leading-none">QWERTY</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gold">Rescue ERP</p>
            </span>
          </Link>
          <nav className="mt-8 flex flex-1 flex-col gap-1">
            <p className="nav-kicker">Rescue</p>
            {items
              .filter((item) => item.sprint === 1)
              .map((item) => (
                <Link key={item.href} href={item.href} className={pathname === item.href ? "nav-link nav-link-active" : "nav-link"}>
                  <span className="nav-gem" aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            <p className="nav-kicker mt-6">Operations</p>
            {items
              .filter((item) => item.sprint === 2)
              .map((item) => (
                <Link key={item.href} href={item.href} className={pathname === item.href ? "nav-link nav-link-active" : "nav-link"}>
                  <span className="nav-gem" aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
          </nav>
          <div className="side-profile">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-white/75">{user.organization}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold">{user.role}</p>
            <button type="button" onClick={() => void logout()} className="side-signout">
              Sign out
            </button>
            {error ? <p className="mt-2 text-xs text-orange-200">{error}</p> : null}
          </div>
        </div>
      </aside>
      <div
        className={`scene min-h-screen ${scene}`}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255, 250, 242, 0.72), rgba(244, 239, 228, 0.8)), url("${sceneImage}")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/40 bg-[#fffdf8] px-8 py-4">
          <p className="text-base font-medium text-[#0c1c16]">Surplus food logistics · Asia/Bangkok</p>
          <p className="font-mono text-sm text-[#243d32]">Queue under 1 min · Match under 2 min</p>
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
