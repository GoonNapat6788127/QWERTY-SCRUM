"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/client";
import { formatBangkok } from "@/lib/time";

type DriverRow = {
  driverId: string;
  name: string;
  accepted: number;
  pickedUp: number;
  delivered: number;
  lastRunAt: string | null;
  location: { lat: number; lng: number; recordedAt: string } | null;
  runs: Array<{ donationId: string; foodType: string; status: string; pickedUpAt: string | null; deliveredAt: string | null }>;
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<DriverRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await api<{ drivers: DriverRow[] }>("/api/drivers/activity");
        if (active) setDrivers(data.drivers);
      } catch {
        if (active) setError("Logistics or food bank role required.");
      }
    }
    void load();
    const timer = setInterval(() => void load(), 8000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="US4b · US7"
        title="Driver activity"
        description="Accepted, picked up, and delivered runs, sorted by most recent. GPS pings display within one minute of being sent."
      />
      {error ? <p className="text-sm text-urgent">{error}</p> : null}
      {drivers.map((driver) => (
        <section key={driver.driverId} className="mb-4 rounded-2xl border border-line bg-panel p-5">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">{driver.name}</h2>
              <p className="text-sm text-muted">
                {driver.accepted} accepted · {driver.pickedUp} picked up · {driver.delivered} delivered
              </p>
            </div>
            <p className="mono-id text-muted">
              {driver.location
                ? `${driver.location.lat.toFixed(4)}, ${driver.location.lng.toFixed(4)} @ ${formatBangkok(driver.location.recordedAt)}`
                : "No GPS ping yet"}
            </p>
          </div>
          <table className="data-table mt-4">
            <tbody>
              {driver.runs.map((run) => (
                <tr key={run.donationId} className="border-t border-line">
                  <td className="mono-id">{run.donationId}</td>
                  <td className="py-2">{run.foodType}</td>
                  <td className="py-2">
                    <StatusBadge value={run.status} />
                  </td>
                  <td className="py-2 text-muted">{formatBangkok(run.deliveredAt ?? run.pickedUpAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
