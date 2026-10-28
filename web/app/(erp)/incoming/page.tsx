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
      {error ? <p className="text-base text-urgent">{error}</p> : null}
      <div className="grid gap-4">
        {items.map((item) => (
          <article key={item.donationId} className="rounded-2xl border border-line bg-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  {item.foodType} · {item.quantity} {item.quantityUnit}
                </h2>
                <p className="mono-id mt-1 text-muted">{item.donationId}</p>
                <p className="mt-1 text-base">{item.foodBank?.name ?? "Food bank not assigned"}</p>
              </div>
              <div>
                <StatusBadge value={item.status} />
                {item.urgent ? <StatusBadge value="urgent" /> : null}
              </div>
            </div>
            <dl className="mt-4 grid gap-3 text-base sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-sm font-semibold text-muted">Pickup window</dt>
                <dd>
                  {item.pickupWindow
                    ? `${formatBangkok(item.pickupWindow.start)} – ${formatBangkok(item.pickupWindow.end)}`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-muted">Driver ID</dt>
                <dd className="mono-id">{item.driverId ?? "Not picked up"}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-muted">Picked up</dt>
                <dd>{formatBangkok(item.pickedUpAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-muted">Delivered</dt>
                <dd>{formatBangkok(item.deliveredAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-muted">Proof</dt>
                <dd>
                  {item.proofDataUrl ? (
                    <a className="font-semibold text-forest underline" href={item.proofDataUrl} target="_blank" rel="noreferrer">
                      Open {item.proofKind ?? "proof"}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </article>
        ))}
        {items.length === 0 && !error ? (
          <p className="rounded-2xl border border-line bg-panel p-8 text-base text-muted">No matched donations yet.</p>
        ) : null}
      </div>
    </div>
  );
}
