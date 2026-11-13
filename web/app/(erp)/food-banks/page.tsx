"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RescueMapFrame } from "@/components/RescueMapFrame";
import { ApiError, api } from "@/lib/client";
import type { FoodBank, PublicUser } from "@/lib/types";

export default function FoodBanksPage() {
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([]);
  const [role, setRole] = useState<PublicUser["role"] | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ foodBanks: FoodBank[] }>("/api/food-banks")
      .then((data) => setFoodBanks(data.foodBanks))
      .catch(() => undefined);
    api<{ user: PublicUser }>("/api/auth/me")
      .then((data) => setRole(data.user.role))
      .catch(() => undefined);
  }, []);

  const canEdit = role === "foodbank" || role === "logistics";

  function updateLocal(id: string, patch: Partial<FoodBank>) {
    setFoodBanks((current) => current.map((bank) => (bank.id === id ? { ...bank, ...patch } : bank)));
  }

  async function save(bank: FoodBank) {
    setNotice("");
    setError("");
    try {
      const data = await api<{ foodBank: FoodBank }>(`/api/food-banks/${bank.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          reportedCapacityKg: Number(bank.reportedCapacityKg),
          remainingCapacityKg: Number(bank.remainingCapacityKg),
          deliveryRangeKm: Number(bank.deliveryRangeKm),
        }),
      });
      updateLocal(bank.id, data.foodBank);
      setNotice(`${data.foodBank.name} saved. The next match uses these numbers.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save the food bank.");
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Capacity"
        title="Food banks"
        description="Location, reported capacity, remaining capacity, and delivery range used by the next match. Changing these numbers does not undo a match that is already made."
      />
      <div className="mb-6">
        <RescueMapFrame />
      </div>
      {notice ? <p className="mb-3 text-base text-forest">{notice}</p> : null}
      {error ? <p className="mb-3 text-base text-urgent">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {foodBanks.map((bank) => (
          <article key={bank.id} className="rounded-2xl border border-line bg-panel p-5">
            <h2 className="text-lg font-semibold">{bank.name}</h2>
            <p className="text-sm text-muted">{bank.address}</p>
            <p className="mono-id mt-2 text-muted">
              {bank.lat}, {bank.lng}
            </p>
            {canEdit ? (
              <div className="mt-4 grid gap-3">
                <label className="text-sm font-medium">
                  Reported capacity (kg)
                  <input
                    className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
                    inputMode="decimal"
                    value={bank.reportedCapacityKg}
                    onChange={(event) => updateLocal(bank.id, { reportedCapacityKg: Number(event.target.value) })}
                  />
                </label>
                <label className="text-sm font-medium">
                  Remaining capacity (kg)
                  <input
                    className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
                    inputMode="decimal"
                    value={bank.remainingCapacityKg}
                    onChange={(event) => updateLocal(bank.id, { remainingCapacityKg: Number(event.target.value) })}
                  />
                </label>
                <label className="text-sm font-medium">
                  Delivery range (km)
                  <input
                    className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
                    inputMode="decimal"
                    value={bank.deliveryRangeKm}
                    onChange={(event) => updateLocal(bank.id, { deliveryRangeKm: Number(event.target.value) })}
                  />
                </label>
                <button type="button" className="btn-solid w-fit rounded-lg px-4 py-2.5 text-base" onClick={() => void save(bank)}>
                  Save for the next match
                </button>
              </div>
            ) : (
              <dl className="mt-4 grid grid-cols-2 gap-3 text-base">
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
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
