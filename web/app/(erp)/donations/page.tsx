"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/client";
import { formatBangkok } from "@/lib/time";
import type { Donation, PublicUser } from "@/lib/types";

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [role, setRole] = useState<PublicUser["role"] | null>(null);

  useEffect(() => {
    api<{ donations: Donation[] }>("/api/donations")
      .then((data) => setDonations(data.donations))
      .catch(() => undefined);
    api<{ user: PublicUser }>("/api/auth/me")
      .then((data) => setRole(data.user.role))
      .catch(() => undefined);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Donation ledger"
        title="All logged donations"
        description="Every ingested donation. Donors can edit a log until a driver picks it up, including logs that hold more than one food."
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
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((item) => (
              <tr key={item.donationId} className="border-t border-line">
                <td className="mono-id">{item.donationId}</td>
                <td className="px-4 py-3">
                  {item.lines?.length
                    ? item.lines.map((line) => `${line.foodType} ${line.quantity} kg`).join(", ")
                    : item.foodType}
                  {item.splitAcrossBanks ? (
                    <span className="mt-1 block text-sm text-muted">Split across food banks</span>
                  ) : null}
                </td>
                <td className="px-4 py-3">{item.quantity} kg</td>
                <td className="px-4 py-3">{formatBangkok(item.queuedAt)}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={item.status} />
                  {item.urgent ? <StatusBadge value="urgent" /> : null}
                </td>
                <td className="px-4 py-3">
                  {role === "donor" && (item.status === "queued" || item.status === "matched") ? (
                    <Link href={`/donations/${item.donationId}/edit`} className="btn-line rounded-lg px-3 py-2 text-sm">
                      Edit
                    </Link>
                  ) : role === "donor" ? (
                    <span className="text-sm text-muted">Locked</span>
                  ) : (
                    <span className="text-sm text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
            {donations.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={6}>
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
