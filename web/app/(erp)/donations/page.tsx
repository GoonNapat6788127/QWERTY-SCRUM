"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/client";
import { formatBangkok } from "@/lib/time";
import type { Donation } from "@/lib/types";

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    api<{ donations: Donation[] }>("/api/donations")
      .then((data) => setDonations(data.donations))
      .catch(() => undefined);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Donation ledger"
        title="All logged donations"
        description="Every ingested donation, including queue, match, pickup, and delivery state."
        actions={
          <Link href="/donations/new" className="btn-solid rounded-lg px-4 py-2.5 text-base">
            New donation
          </Link>
        }
      />
      <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Food</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Queued</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((item) => (
              <tr key={item.donationId} className="border-t border-line">
                <td className="mono-id">{item.donationId}</td>
                <td className="px-4 py-3">{item.foodType}</td>
                <td className="px-4 py-3">{item.quantity} kg</td>
                <td className="px-4 py-3">{formatBangkok(item.queuedAt)}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={item.status} />
                  {item.urgent ? <StatusBadge value="urgent" /> : null}
                </td>
              </tr>
            ))}
            {donations.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={5}>
                  No donations yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
