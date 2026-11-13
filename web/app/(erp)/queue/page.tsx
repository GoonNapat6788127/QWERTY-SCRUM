"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { ApiError, api } from "@/lib/client";
import { formatBangkok } from "@/lib/time";
import type { PublicUser } from "@/lib/types";

function hoursLeftLabel(iso: string): string {
  const hours = (new Date(iso).getTime() - Date.now()) / 3_600_000;
  if (!Number.isFinite(hours)) return "";
  if (hours <= 0) return "Past expiry";
  if (hours < 1) return "Under 1 hour left";
  return `${Math.round(hours)} hours left`;
}

type QueueItem = {
  donationId: string;
  foodType: string;
  quantity: number;
  quantityUnit: string;
  expiryDateTime: string;
  pickupWindow: { start: string; end: string } | null;
  urgent: boolean;
  status: string;
  queuedAt: string;
  donorName: string;
  foodBankId: string | null;
  lines?: { foodType: string; quantity: number }[];
  splitAcrossBanks?: boolean;
};

export default function QueuePage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [role, setRole] = useState<PublicUser["role"] | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await api<{ items: QueueItem[]; elapsedMs: number }>("/api/queue");
        if (active) {
          setItems(data.items);
          setElapsedMs(data.elapsedMs);
        }
      } catch {
        /* keep the last good queue if a refresh fails */
      }
    }
    void load();
    api<{ user: PublicUser }>("/api/auth/me")
      .then((data) => setRole(data.user.role))
      .catch(() => undefined);
    const timer = setInterval(() => void load(), 4000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="US1a · US3a matching queue"
        title="Matching queue"
        description="Queued donations appear immediately after ingestion. Items expiring within 24 hours are flagged urgent."
      />
      <p className="mb-4 text-xs text-muted">
        Queue endpoint `/api/queue` · last fetch {elapsedMs ?? "—"} ms
      </p>
      {notice ? <p className="mb-3 text-sm text-forest">{notice}</p> : null}
      <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Food type</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Pickup window</th>
              <th className="px-4 py-3">Flags</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.donationId} className="border-t border-line">
                <td className="mono-id">{item.donationId}</td>
                <td className="px-4 py-3">
                  {item.lines && item.lines.length > 1
                    ? item.lines.map((line) => `${line.foodType} ${line.quantity} kg`).join(", ")
                    : item.foodType}
                  {item.splitAcrossBanks ? <span className="mt-1 block text-sm text-muted">Sent to several banks</span> : null}
                </td>
                <td className="px-4 py-3">
                  {item.quantity} {item.quantityUnit}
                </td>
                <td className="px-4 py-3">
                  {formatBangkok(item.expiryDateTime)}
                  <span className="mt-1 block text-sm text-muted">{hoursLeftLabel(item.expiryDateTime)}</span>
                </td>
                <td className="px-4 py-3">
                  {item.pickupWindow
                    ? `${formatBangkok(item.pickupWindow.start)} – ${formatBangkok(item.pickupWindow.end)}`
                    : "—"}
                </td>
                <td className="px-4 py-3 space-x-1">
                  <StatusBadge value={item.status} />
                  {item.urgent ? <StatusBadge value="urgent" /> : null}
                  {role === "logistics" && item.status === "queued" ? (
                    <button
                      type="button"
                      className="btn-line ml-2 rounded-lg px-3 py-1 text-sm"
                      onClick={() => {
                        setNotice("");
                        api(`/api/donations/${item.donationId}/rematch`, { method: "POST" })
                          .then(() => api<{ items: QueueItem[]; elapsedMs: number }>("/api/queue"))
                          .then((data) => {
                            setItems(data.items);
                            setElapsedMs(data.elapsedMs);
                            setNotice(`Matching ran again for ${item.donationId}.`);
                          })
                          .catch((err: unknown) => {
                            setNotice(err instanceof ApiError ? err.message : "Matching could not run again.");
                          });
                      }}
                    >
                      Match again
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={6}>
                  Queue is empty. Submit a donation or POST to `/api/test/queue`.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
