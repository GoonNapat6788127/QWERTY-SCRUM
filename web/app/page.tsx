"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, api } from "@/lib/client";

const ACCOUNTS = [
  { email: "donor@qwerty.test", password: "donor123", role: "Donor", org: "Bangkok Fresh Market" },
  { email: "foodbank@qwerty.test", password: "foodbank123", role: "Food bank", org: "SOS Food Bank Bangkok" },
  { email: "driver@qwerty.test", password: "driver123", role: "Driver", org: "QWERTY Dispatch" },
  { email: "logistics@qwerty.test", password: "logistics123", role: "Logistics", org: "Rescue Control" },
];

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
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not sign in.");
      setPending(false);
    }
  }

  return (
    <div className="erp-grid min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf">Team QWERTY · Sprint 1 Day 2</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-tight text-forest">
            Rescue ERP for surplus food logistics
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-muted">
            Donors log food with a pickup window. The matching queue ingests it within a minute,
            food banks are scored by distance and capacity, drivers capture proof, and a digital
            receipt goes back to the donor.
          </p>
          <ul className="mt-8 grid gap-3 text-sm text-ink sm:grid-cols-2">
            <li className="rounded-xl border border-line bg-panel p-4">US1a Log a donation into the queue</li>
            <li className="rounded-xl border border-line bg-panel p-4">US1b Auto-match by proximity + capacity</li>
            <li className="rounded-xl border border-line bg-panel p-4">US6 Pickup window on dispatch feeds</li>
            <li className="rounded-xl border border-line bg-panel p-4">US2–US5 Pickup, proof, receipts, urgent flags</li>
          </ul>
        </section>
        <form
          onSubmit={(event) => void submit(event)}
          className="rounded-2xl border border-line bg-panel p-8 shadow-[0_20px_50px_rgba(20,53,40,0.08)]"
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Sign in</h2>
          <p className="mt-1 text-sm text-muted">Use a demo role to enter the operations workspace.</p>
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
            className="mt-6 w-full rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-paper disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Enter workspace"}
          </button>
          <div className="mt-6 grid gap-2">
            {ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-left text-sm hover:bg-paper"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
              >
                <span>
                  <span className="font-medium">{account.role}</span>
                  <span className="text-muted"> · {account.org}</span>
                </span>
                <span className="font-mono text-xs text-muted">{account.email}</span>
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
