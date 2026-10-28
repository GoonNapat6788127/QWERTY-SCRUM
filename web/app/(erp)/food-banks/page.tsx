"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/client";
import type { FoodBank } from "@/lib/types";

export default function FoodBanksPage() {
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([]);

  useEffect(() => {
    api<{ foodBanks: FoodBank[] }>("/api/food-banks")
      .then((data) => setFoodBanks(data.foodBanks))
      .catch(() => undefined);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="US1b sample data"
        title="Food banks"
        description="Location, reported capacity, remaining capacity, and delivery range used by proximity scoring."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {foodBanks.map((bank) => (
          <article key={bank.id} className="rounded-2xl border border-line bg-panel p-5">
            <h2 className="text-lg font-semibold">{bank.name}</h2>
            <p className="text-sm text-muted">{bank.address}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-base">
              <div>
                <dt className="text-muted">Coordinates</dt>
                <dd className="mono-id">
                  {bank.lat}, {bank.lng}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Delivery range</dt>
                <dd>{bank.deliveryRangeKm} km</dd>
              </div>
              <div>
                <dt className="text-muted">Reported capacity</dt>
                <dd>{bank.reportedCapacityKg} kg</dd>
              </div>
              <div>
                <dt className="text-muted">Remaining</dt>
                <dd>{bank.remainingCapacityKg} kg</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
