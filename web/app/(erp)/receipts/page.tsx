"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/client";
import { formatBangkok } from "@/lib/time";
import type { Receipt } from "@/lib/types";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    api<{ receipts: Receipt[] }>("/api/receipts")
      .then((data) => setReceipts(data.receipts))
      .catch(() => undefined);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="US5a · US5b"
        title="Digital receipts and tax export"
        description="Delivered donations generate a receipt with weight, food type, and timestamp, then email it to the donor."
      />
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="text-sm">
          Month
          <input
            type="month"
            className="ml-2 rounded-lg border border-line bg-panel px-3 py-2"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
          />
        </label>
        <a className="rounded-lg bg-forest px-3 py-2 text-sm text-paper" href={`/api/reports/tax?month=${month}&format=csv`}>
          Export CSV
        </a>
        <a className="rounded-lg border border-line px-3 py-2 text-sm" href={`/api/reports/tax?month=${month}&format=pdf`}>
          Export PDF
        </a>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Receipt</th>
              <th className="px-4 py-3">Food type</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">File</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-4 py-3 font-mono text-xs">{item.id}</td>
                <td className="px-4 py-3">{item.foodType}</td>
                <td className="px-4 py-3">{item.weightKg} kg</td>
                <td className="px-4 py-3">{formatBangkok(item.timestamp)}</td>
                <td className="px-4 py-3">
                  {item.emailedTo} · {item.emailStatus}
                </td>
                <td className="px-4 py-3">
                  <a className="text-forest underline" href={`/api/receipts/${item.id}?format=pdf`}>
                    PDF
                  </a>
                </td>
              </tr>
            ))}
            {receipts.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={6}>
                  No receipts yet. Complete a delivery to generate one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
