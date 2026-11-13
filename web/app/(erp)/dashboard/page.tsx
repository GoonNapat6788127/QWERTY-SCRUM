"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RescueMapFrame } from "@/components/RescueMapFrame";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/client";
import { formatBangkok } from "@/lib/time";
import type { Donation, Notification, PublicUser } from "@/lib/types";

type DashboardResponse = {
  summary: {
    open: number;
    matched: number;
    pickedUp: number;
    delivered: number;
    urgent: number;
    foodBanks: number;
    notifications: number;
  };
  donations: Donation[];
  notifications: Notification[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [role, setRole] = useState<PublicUser["role"] | null>(null);
  const [donor, setDonor] = useState("");
  const [foodBank, setFoodBank] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [next, me] = await Promise.all([
          api<DashboardResponse>("/api/dashboard"),
          api<{ user: PublicUser }>("/api/auth/me"),
        ]);
        if (active) {
          setData(next);
          setRole(me.user.role);
        }
      } catch {
        if (active) setData(null);
      }
    }
    void load();
    const timer = setInterval(() => void load(), 8000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const rows = useMemo(() => {
    return (data?.donations ?? []).filter((item) => {
      if (donor && !item.donorName.toLowerCase().includes(donor.toLowerCase())) return false;
      if (foodBank && item.foodBankId !== foodBank) return false;
      if (status && item.status !== status) return false;
      return true;
    });
  }, [data, donor, foodBank, status]);

  const summary = data?.summary;
  const impact = useMemo(() => {
    const donations = data?.donations ?? [];
    const delivered = donations.filter((item) => item.status === "delivered");
    const moving = donations.filter((item) => item.status === "matched" || item.status === "picked_up");
    const kgSaved = delivered.reduce((sum, item) => sum + item.quantity, 0);
    const kgOnTheWay = moving.reduce((sum, item) => sum + item.quantity, 0);
    const open = donations.filter((item) => item.status !== "delivered" && item.status !== "expired");
    const soonest = open
      .map((item) => new Date(item.expiryDateTime).getTime())
      .filter((time) => Number.isFinite(time))
      .sort((a, b) => a - b)[0];
    const hoursLeft = soonest === undefined ? null : (soonest - Date.now()) / 3_600_000;
    return {
      kgSaved: Math.round(kgSaved * 10) / 10,
      meals: Math.round(kgSaved * 2),
      kgOnTheWay: Math.round(kgOnTheWay * 10) / 10,
      hoursLeft,
    };
  }, [data]);

  return (
    <div>
      <PageHeader
        eyebrow="Today"
        title="Today’s rescue activity"
        description="Open, matched, and delivered donations update as the queue and matching service run."
        actions={
          role === "donor" ? (
            <Link href="/donations/new" className="btn-solid rounded-lg px-4 py-2.5 text-base">
              Log a donation
            </Link>
          ) : null
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Open", summary?.open ?? "—"],
          ["Matched", summary?.matched ?? "—"],
          ["Picked up", summary?.pickedUp ?? "—"],
          ["Delivered", summary?.delivered ?? "—"],
          ["Urgent", summary?.urgent ?? "—"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-panel p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-4 rounded-2xl border border-leaf/40 bg-leaf/10 p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest">Rescue story</p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-forest">
          {impact.kgSaved} kg delivered, about {impact.meals} meals
        </p>
        <p className="mt-2 max-w-2xl text-base text-ink">
          {impact.kgOnTheWay} kg is matched or already in the van.
          {impact.hoursLeft === null
            ? " Nothing is waiting on the clock."
            : impact.hoursLeft <= 0
              ? " The next open item is already past expiry."
              : ` The next open item expires in ${Math.max(1, Math.round(impact.hoursLeft))} hours.`}
          {" "}One meal is counted as 0.5 kg. This story reads the same donations as the cards above.
        </p>
      </section>
      <div className="mt-4">
        <RescueMapFrame />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className="rounded-lg border border-line bg-panel px-3 py-2 text-sm"
          placeholder="Filter by donor"
          value={donor}
          onChange={(event) => setDonor(event.target.value)}
        />
        <input
          className="rounded-lg border border-line bg-panel px-3 py-2 text-sm"
          placeholder="Filter by food bank id"
          value={foodBank}
          onChange={(event) => setFoodBank(event.target.value)}
        />
        <select
          className="rounded-lg border border-line bg-panel px-3 py-2 text-sm"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="queued">Queued</option>
          <option value="matched">Matched</option>
          <option value="picked_up">Picked up</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th className="px-4 py-3">Donation</th>
              <th className="px-4 py-3">Donor</th>
              <th className="px-4 py-3">Food</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.donationId} className="border-t border-line">
                <td className="px-4 py-3 font-mono text-xs">{item.donationId}</td>
                <td className="px-4 py-3">{item.donorName}</td>
                <td className="px-4 py-3">
                  {item.foodType} {item.urgent ? <StatusBadge value="urgent" /> : null}
                </td>
                <td className="px-4 py-3">{item.quantity} kg</td>
                <td className="px-4 py-3">{formatBangkok(item.expiryDateTime)}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={item.status} />
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={6}>
                  No rescue activity yet. Log a donation to populate the queue.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
