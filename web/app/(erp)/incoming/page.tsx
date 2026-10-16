"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/client";
import { formatBangkok } from "@/lib/time";

type IncomingItem = {
  donationId: string;
  foodType: string;
  quantity: number;
  quantityUnit: string;
  expiryDateTime: string;
  pickupWindow: { start: string; end: string } | null;
  status: string;
  urgent: boolean;
  driverId: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  proofKind: "photo" | "signature" | null;
  proofDataUrl: string | null;
  foodBank: { name: string } | null;
};

export default function IncomingPage() {
  const [items, setItems] = useState<IncomingItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ incoming: IncomingItem[] }>("/api/incoming")
      .then((data) => setItems(data.incoming))
      .catch(() => setError("Food bank or logistics role required."));
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="US2a · US2b · Food bank portal"
        title="Incoming pickups"
        description="Pickup shows driver ID and timestamp. After delivery, proof (photo or signature) and the delivery timestamp appear here."
      />
      {error ? <p className="text-sm text-urgent">{error}</p> : null}
      <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Donation</th>
              <th className="px-4 py-3">Food</th>
              <th className="px-4 py-3">Food bank</th>
              <th className="px-4 py-3">Pickup window</th>
              <th className="px-4 py-3">Driver ID</th>
              <th className="px-4 py-3">Picked up</th>
              <th className="px-4 py-3">Delivered</th>
              <th className="px-4 py-3">Proof</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.donationId} className="border-t border-line">
                <td className="px-4 py-3 font-mono text-xs">{item.donationId}</td>
                <td className="px-4 py-3">
                  {item.foodType} · {item.quantity} {item.quantityUnit}
                </td>
                <td className="px-4 py-3">{item.foodBank?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  {item.pickupWindow
                    ? `${formatBangkok(item.pickupWindow.start)} – ${formatBangkok(item.pickupWindow.end)}`
                    : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{item.driverId ?? "Not picked up"}</td>
                <td className="px-4 py-3">{formatBangkok(item.pickedUpAt)}</td>
                <td className="px-4 py-3">{formatBangkok(item.deliveredAt)}</td>
                <td className="px-4 py-3">
                  {item.proofDataUrl ? (
                    <a className="text-forest underline" href={item.proofDataUrl} target="_blank" rel="noreferrer">
                      {item.proofKind ?? "proof"}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={item.status} />
                  {item.urgent ? <StatusBadge value="urgent" /> : null}
                </td>
              </tr>
            ))}
            {items.length === 0 && !error ? (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={9}>
                  No matched donations yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
