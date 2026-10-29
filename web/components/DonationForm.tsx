"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ApiError, futureDateTimeLocal, toIsoFromLocal } from "@/lib/client";
import { nextPickupWindows } from "@/lib/time";
import { FOOD_TYPES } from "@/lib/types";
import type { Donation, Match } from "@/lib/types";

export type LineDraft = {
  foodType: string;
  quantity: string;
  expiryDateTime: string;
};

export function blankLine(): LineDraft {
  return { foodType: "", quantity: "12", expiryDateTime: futureDateTimeLocal(360) };
}

export function DonationForm({
  eyebrow,
  title,
  description,
  submitLabel,
  initialLines,
  initialPickupStart,
  initialPickupEnd,
  initialSplit,
  onSubmit,
}: {
  eyebrow: string;
  title: string;
  description: string;
  submitLabel: string;
  initialLines: LineDraft[];
  initialPickupStart?: string;
  initialPickupEnd?: string;
  initialSplit?: boolean;
  onSubmit: (payload: {
    lines: { foodType: string; quantity: number | ""; expiryDateTime: string }[];
    pickupWindow: { start: string; end: string } | null;
    splitAcrossBanks: boolean;
  }) => Promise<{ donation: Donation; match: Match | null; matches?: Match[] }>;
}) {
  const windows = useMemo(() => {
    const next = nextPickupWindows();
    if (initialPickupStart && !next.some((item) => item.start === initialPickupStart)) {
      return [{ start: initialPickupStart, end: initialPickupEnd || initialPickupStart, label: "Saved pickup window" }, ...next];
    }
    return next;
  }, [initialPickupStart, initialPickupEnd]);
  const [lines, setLines] = useState<LineDraft[]>(initialLines.length ? initialLines : [blankLine()]);
  const [pickupSlot, setPickupSlot] = useState(initialPickupStart || windows[0]?.start || "");
  const [splitAcrossBanks, setSplitAcrossBanks] = useState(Boolean(initialSplit));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ donation: Donation; matches: Match[]; queuedMs: number } | null>(null);

  function updateLine(index: number, patch: Partial<LineDraft>) {
    setLines((current) => current.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setErrors({});
    setResult(null);
    const started = performance.now();
    const pickup = windows.find((item) => item.start === pickupSlot);
    try {
      const data = await onSubmit({
        lines: lines.map((line) => ({
          foodType: line.foodType,
          quantity: line.quantity === "" ? "" : Number(line.quantity),
          expiryDateTime: line.expiryDateTime ? toIsoFromLocal(line.expiryDateTime) : "",
        })),
        pickupWindow: pickup ? { start: pickup.start, end: pickup.end } : null,
        splitAcrossBanks,
      });
      setResult({
        donation: data.donation,
        matches: data.matches?.length ? data.matches : data.match ? [data.match] : [],
        queuedMs: Math.round(performance.now() - started),
      });
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.errors ?? { form: err.message });
      else setErrors({ form: "Could not save the donation." });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <form onSubmit={(event) => void submit(event)} className="rounded-2xl border border-line bg-panel p-6">
        <div className="grid gap-4">
          {lines.map((line, index) => (
            <fieldset key={index} className="rounded-xl border border-line p-4">
              <legend className="px-1 text-sm font-semibold">Food {index + 1}</legend>
              <label className="mt-2 block text-sm font-medium">
                Food type
                <select
                  className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
                  value={line.foodType}
                  onChange={(event) => updateLine(index, { foodType: event.target.value })}
                >
                  <option value="">Select food type</option>
                  {FOOD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-3 block text-sm font-medium">
                Quantity (kg)
                <input
                  className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
                  value={line.quantity}
                  onChange={(event) => updateLine(index, { quantity: event.target.value })}
                  inputMode="decimal"
                />
              </label>
              <label className="mt-3 block text-sm font-medium">
                Expiry date and time
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
                  value={line.expiryDateTime}
                  onChange={(event) => updateLine(index, { expiryDateTime: event.target.value })}
                />
              </label>
              {lines.length > 1 ? (
                <button
                  type="button"
                  className="btn-line mt-3 rounded-lg px-3 py-2 text-sm"
                  onClick={() => setLines((current) => current.filter((_, i) => i !== index))}
                >
                  Remove this food
                </button>
              ) : null}
            </fieldset>
          ))}
        </div>
        <button
          type="button"
          className="btn-line mt-4 rounded-lg px-4 py-2.5 text-base"
          onClick={() => setLines((current) => [...current, blankLine()])}
        >
          Add another food
        </button>

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

        <label className="mt-4 flex items-start gap-3 text-base">
          <input
            type="checkbox"
            className="mt-1"
            checked={splitAcrossBanks}
            onChange={(event) => setSplitAcrossBanks(event.target.checked)}
          />
          <span>Send this log to more than one food bank when one bank cannot take the full weight.</span>
        </label>

        {errors.lines ? <p className="mt-3 text-sm text-urgent">{errors.lines}</p> : null}
        {errors.foodType ? <p className="mt-1 text-sm text-urgent">{errors.foodType}</p> : null}
        {errors.quantity ? <p className="mt-1 text-sm text-urgent">{errors.quantity}</p> : null}
        {errors.expiryDateTime ? <p className="mt-1 text-sm text-urgent">{errors.expiryDateTime}</p> : null}
        {errors.pickupWindow ? <p className="mt-1 text-sm text-urgent">{errors.pickupWindow}</p> : null}
        {errors.form ? <p className="mt-3 text-sm text-urgent">{errors.form}</p> : null}

        <button type="submit" disabled={pending} className="btn-solid mt-6 rounded-lg px-4 py-2.5 text-base disabled:opacity-60">
          {pending ? "Saving…" : submitLabel}
        </button>
      </form>

      {result ? (
        <div className="mt-6 rounded-2xl border border-leaf/40 bg-leaf/10 p-5" role="status">
          <p className="font-semibold text-forest">Saved in {result.queuedMs} ms.</p>
          <p className="mt-1 text-base">
            {result.donation.lines.map((line) => `${line.foodType} ${line.quantity} kg`).join(" · ")}
          </p>
          {result.matches.length ? (
            <ul className="mt-2 text-base">
              {result.matches.map((match) => (
                <li key={match.id}>
                  {match.foodBankName}: {match.quantityKg} kg ({match.distanceKm} km)
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-base">No food bank currently in range with remaining capacity for the full weight.</p>
          )}
          <div className="mt-3 flex flex-wrap gap-4 text-base">
            <Link href={`/donations/${result.donation.donationId}/edit`} className="font-semibold text-forest underline">
              Edit this log
            </Link>
            <Link href="/donations" className="font-semibold text-forest underline">
              All donations
            </Link>
            <Link href="/queue" className="font-semibold text-forest underline">
              Matching queue
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
