"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ApiError, api, futureDateTimeLocal, toIsoFromLocal } from "@/lib/client";
import { createDonationId } from "@/lib/ids";
import { nextPickupWindows } from "@/lib/time";
import { FOOD_TYPES } from "@/lib/types";
import type { Donation, Match } from "@/lib/types";

export default function NewDonationPage() {
  const windows = useMemo(() => nextPickupWindows(), []);
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("12");
  const [expiryDateTime, setExpiryDateTime] = useState(futureDateTimeLocal(360));
  const [pickupSlot, setPickupSlot] = useState(windows[0]?.start ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ donation: Donation; match: Match | null; queuedMs: number } | null>(null);
  const [donationId, setDonationId] = useState("");
  const [forbidden, setForbidden] = useState("");

  useEffect(() => {
    setDonationId(createDonationId());
    api<{ user: { role: string } }>("/api/auth/me")
      .then((data) => {
        if (data.user.role !== "donor") {
          setForbidden("Only donors can log a donation. Sign in as donor@qwerty.test.");
        }
      })
      .catch(() => undefined);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setErrors({});
    setResult(null);
    const started = performance.now();
    const window = windows.find((item) => item.start === pickupSlot);
    try {
      const payload = {
        donationId,
        foodType,
        quantity: quantity === "" ? "" : Number(quantity),
        expiryDateTime: expiryDateTime ? toIsoFromLocal(expiryDateTime) : "",
        pickupWindow: window ? { start: window.start, end: window.end } : null,
      };
      const data = await api<{ donation: Donation; match: Match | null }>(
        "/api/donations",
        {
          method: "POST",
          headers: { "Idempotency-Key": donationId },
          body: JSON.stringify(payload),
        },
      );
      setResult({
        donation: data.donation,
        match: data.match,
        queuedMs: Math.round(performance.now() - started),
      });
      setDonationId(createDonationId());
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.errors ?? { form: err.message });
      }
    } finally {
      setPending(false);
    }
  }

  if (forbidden) {
    return (
      <div className="rounded-2xl border border-line bg-panel p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl">Donation form blocked</h1>
        <p className="mt-2 text-sm text-urgent">{forbidden}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="US1a · US6"
        title="Log a donation"
        description="Submit food type, quantity (kg), expiry, and a pickup window. The donation is ingested into the matching queue immediately."
      />
      <form onSubmit={(event) => void submit(event)} className="rounded-2xl border border-line bg-panel p-6">
        <label className="block text-sm font-medium">
          Food type
          <select
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
            value={foodType}
            onChange={(event) => setFoodType(event.target.value)}
          >
            <option value="">Select food type</option>
            {FOOD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        {errors.foodType ? <p className="mt-1 text-sm text-urgent">{errors.foodType}</p> : null}

        <label className="mt-4 block text-sm font-medium">
          Quantity (kg)
          <input
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            inputMode="decimal"
          />
        </label>
        {errors.quantity ? <p className="mt-1 text-sm text-urgent">{errors.quantity}</p> : null}

        <label className="mt-4 block text-sm font-medium">
          Expiry date and time
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
            value={expiryDateTime}
            onChange={(event) => setExpiryDateTime(event.target.value)}
          />
        </label>
        {errors.expiryDateTime ? <p className="mt-1 text-sm text-urgent">{errors.expiryDateTime}</p> : null}

        <label className="mt-4 block text-sm font-medium">
          Pickup time window
          <select
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
            value={pickupSlot}
            onChange={(event) => setPickupSlot(event.target.value)}
          >
            {windows.map((item) => (
              <option key={item.start} value={item.start}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        {errors.pickupWindow ? <p className="mt-1 text-sm text-urgent">{errors.pickupWindow}</p> : null}
        {errors.form ? <p className="mt-3 text-sm text-urgent">{errors.form}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="btn-solid mt-6 rounded-lg px-4 py-2.5 text-base disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit donation"}
        </button>
      </form>

      {result ? (
        <div className="mt-6 rounded-2xl border border-leaf/40 bg-leaf/10 p-5" role="status">
          <p className="font-semibold text-forest">Donation queued in {result.queuedMs} ms.</p>
          <p className="mt-1 text-sm">
            {result.donation.foodType} · {result.donation.quantity} kg · expiry saved as ISO{" "}
            {result.donation.expiryDateTime}
          </p>
          {result.match ? (
            <p className="mt-2 text-sm">
              Proposed match: {result.match.foodBankName} ({result.match.distanceKm} km, score{" "}
              {result.match.totalScore}).
            </p>
          ) : (
            <p className="mt-2 text-sm">No food bank currently in range with remaining capacity.</p>
          )}
          <Link href="/queue" className="mt-3 inline-block text-sm font-semibold text-forest underline">
            Open matching queue
          </Link>
        </div>
      ) : null}
    </div>
  );
}
