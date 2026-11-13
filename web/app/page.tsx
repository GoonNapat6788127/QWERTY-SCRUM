"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, api } from "@/lib/client";

const ACCOUNTS = [
  { email: "donor@qwerty.test", password: "donor123", role: "Donor", org: "Bangkok Fresh Market", tint: "#1f8a5b" },
  { email: "foodbank@qwerty.test", password: "foodbank123", role: "Food bank", org: "SOS Food Bank Bangkok", tint: "#c6a15b" },
  { email: "driver@qwerty.test", password: "driver123", role: "Driver", org: "QWERTY Dispatch", tint: "#c4532a" },
  { email: "logistics@qwerty.test", password: "logistics123", role: "Logistics", org: "Rescue Control", tint: "#0e3b2e" },
];

const LOGIN_CSS = `
.side-mark { display: inline-block; width: 2.4rem; height: 2.4rem; border-radius: 999px; background: radial-gradient(circle at 35% 30%, #f3d48a, transparent 42%), linear-gradient(145deg, #2f9e62, #0e3b2e); box-shadow: 0 0 0 3px rgba(198,161,91,.45); }
.login-hero h1 { color: #0e3b2e; text-shadow: 0 1px 0 rgba(255,253,248,.6); }
.login-hero h1::after { content: ""; display: block; width: 5.5rem; height: 4px; margin-top: .7rem; border-radius: 999px; background: linear-gradient(90deg,#1f8a5b,#c6a15b,#c4532a); }
.login-tile { display: flex; align-items: center; gap: .75rem; border-radius: 1.15rem; padding: 1rem 1.05rem; color: #0c1c16; font-weight: 650; background: linear-gradient(180deg,#fffefb,#fff3e0); border: 1px solid #e4d3b4; box-shadow: 0 14px 30px rgba(16,36,28,.12); }
.login-tile i { width: .7rem; height: .7rem; flex: none; border-radius: 999px; box-shadow: 0 0 0 4px rgba(198,161,91,.16); }
.login-card { position: relative; overflow: hidden; border-radius: 1.6rem; padding: 2rem; background: linear-gradient(#fffdf8,#fff6e8) padding-box, linear-gradient(135deg,#1f8a5b,#c6a15b,#c4532a) border-box; border: 2px solid transparent; box-shadow: 0 28px 60px rgba(14,59,46,.22); }
.login-card::before { content: ""; position: absolute; inset: 0 auto auto 0; height: 7px; width: 100%; background: linear-gradient(90deg,#1f8a5b,#c6a15b,#c4532a); }
.role-btn { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: .75rem; border-radius: 999px; border: 1px solid #eadfce; background: #fff; padding: .7rem .9rem; text-align: left; }
.role-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(16,36,28,.08); }
.role-dot { width: .7rem; height: .7rem; border-radius: 999px; box-shadow: 0 0 0 4px rgba(198,161,91,.18); }
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("donor@qwerty.test");
  const [password, setPassword] = useState("donor123");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event?: React.FormEvent) {
    event?.preventDefault();
    setPending(true);
    setError("");
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.replace("/queue");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not sign in.");
      setPending(false);
    }
  }

  return (
    <div
      className="scene scene-market min-h-screen"
      style={{
        backgroundImage: 'linear-gradient(180deg, rgba(255, 250, 242, 0.42), rgba(244, 239, 228, 0.55)), url("/rescue-bg.jpg")',
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <style>{LOGIN_CSS}</style>
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
        <section className="login-hero">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#0e3b2e]">
            <span className="side-mark" aria-hidden="true" />
            Team QWERTY · Bangkok
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-tight">
            Rescue ERP for surplus food logistics
          </h1>
          <p className="mt-4 max-w-lg text-base font-medium leading-7 text-[#0c1c16]">
            Donors log food with a pickup window. The matching queue ingests it within a minute,
            food banks are scored by distance and capacity, drivers capture proof, and a digital
            receipt goes back to the donor.
          </p>
          <ul className="mt-8 grid gap-3 text-base leading-6 sm:grid-cols-2">
            <li className="login-tile"><i style={{ background: "#1f8a5b" }} />Log a donation into the queue</li>
            <li className="login-tile"><i style={{ background: "#c6a15b" }} />Match by distance and capacity</li>
            <li className="login-tile"><i style={{ background: "#c4532a" }} />Pickup, proof, and receipt</li>
            <li className="login-tile"><i style={{ background: "#0e3b2e" }} />Urgent flag when expiry is near</li>
          </ul>
        </section>
        <form onSubmit={(event) => void submit(event)} className="login-card">
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[#0e3b2e]">Sign in</h2>
          <p className="mt-1 text-sm font-medium text-[#243d32]">Choose a role, or type an email, then enter the workspace.</p>
          <label className="mt-6 block text-sm font-medium">
            Email
            <input
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Password
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error ? (
            <p className="mt-3 text-sm text-urgent" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="btn-solid mt-6 w-full rounded-full px-4 py-3 text-base disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Enter workspace"}
          </button>
          <div className="mt-6 grid gap-2">
            {ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                className="role-btn"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="role-dot" style={{ background: account.tint }} />
                  <span>
                    <span className="font-semibold text-[#0c1c16]">{account.role}</span>
                    <span className="text-[#243d32]"> · {account.org}</span>
                  </span>
                </span>
                <span className="font-mono text-xs text-[#243d32]">{account.email}</span>
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
