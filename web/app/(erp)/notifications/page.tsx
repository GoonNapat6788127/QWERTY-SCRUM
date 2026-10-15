"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/client";
import { formatBangkok } from "@/lib/time";
import type { Notification } from "@/lib/types";

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [lat, setLat] = useState("13.7500");
  const [lng, setLng] = useState("100.5100");
  const [ping, setPing] = useState("");

  useEffect(() => {
    api<{ notifications: Notification[] }>("/api/notifications")
      .then((data) => setItems(data.notifications))
      .catch(() => undefined);
  }, []);

  async function sendGps() {
    try {
      const data = await api<{ location: { recordedAt: string } }>("/api/drivers/location", {
        method: "POST",
        body: JSON.stringify({ lat: Number(lat), lng: Number(lng) }),
      });
      setPing(`Location stored at ${formatBangkok(data.location.recordedAt)}`);
    } catch (error) {
      setPing(error instanceof Error ? error.message : "Could not send location.");
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="US3b · US7 · US8"
        title="Expiry alerts and live ops"
        description="Staff and drivers are notified at 24 / 12 / 2 hours before expiry. Drivers can ping GPS from here."
      />
      <section className="mb-6 rounded-2xl border border-line bg-panel p-5">
        <h2 className="font-semibold">Driver GPS ping</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input className="rounded-lg border border-line px-3 py-2 text-sm" value={lat} onChange={(event) => setLat(event.target.value)} />
          <input className="rounded-lg border border-line px-3 py-2 text-sm" value={lng} onChange={(event) => setLng(event.target.value)} />
          <button type="button" className="rounded-lg bg-forest px-3 py-2 text-sm text-paper" onClick={() => void sendGps()}>
            Send location
          </button>
        </div>
        {ping ? <p className="mt-2 text-sm text-forest">{ping}</p> : null}
      </section>
      <div className="grid gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-line bg-panel p-4">
            <p className="text-xs uppercase tracking-wider text-urgent">{item.thresholdHours}h threshold · {item.audience}</p>
            <p className="mt-1 text-sm">{item.message}</p>
            <p className="mt-1 text-xs text-muted">{formatBangkok(item.createdAt)}</p>
          </article>
        ))}
        {items.length === 0 ? (
          <p className="rounded-2xl border border-line bg-panel p-8 text-sm text-muted">
            No expiry notifications yet. Log a donation that expires within 24 hours to trigger US3a/US3b.
          </p>
        ) : null}
      </div>
    </div>
  );
}
