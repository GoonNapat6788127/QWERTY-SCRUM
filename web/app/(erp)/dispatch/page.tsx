"use client";

import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { ApiError, api } from "@/lib/client";
import { formatBangkok } from "@/lib/time";
import type { Donation, FoodBank, Match } from "@/lib/types";

type FeedItem = Donation & { match: Match | null; matches?: Match[]; foodBank: FoodBank | null };

export default function DispatchPage() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [proofKind, setProofKind] = useState<"signature" | "photo">("signature");
  const [photo, setPhoto] = useState("");

  async function load() {
    const data = await api<{ feed: FeedItem[] }>("/api/dispatch");
    setFeed(data.feed);
  }

  useEffect(() => {
    void load().catch(() => setError("Driver, food bank, or logistics role required."));
  }, []);

  function drawStart(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = "#143528";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    const move = (moveEvent: MouseEvent) => {
      ctx.lineTo(moveEvent.clientX - rect.left, moveEvent.clientY - rect.top);
      ctx.stroke();
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }

  async function pickup(donationId: string) {
    setError("");
    try {
      await api("/api/pickup", { method: "POST", body: JSON.stringify({ donationId }) });
      setMessage(`Picked up ${donationId}`);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Pickup failed.");
    }
  }

  async function deliver(donationId: string) {
    setError("");
    const proofDataUrl =
      proofKind === "photo" ? photo : canvasRef.current?.toDataURL("image/png") ?? "";
    if (!proofDataUrl) {
      setError("Add a signature or photo before confirming delivery.");
      return;
    }
    try {
      await api("/api/delivery", {
        method: "POST",
        body: JSON.stringify({ donationId, proofKind, proofDataUrl }),
      });
      setMessage(`Delivered ${donationId}. Digital receipt emailed to the donor.`);
      setActiveId(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delivery failed.");
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="US2a · US2b · US6"
        title="Driver dispatch"
        description="Matched donations with pickup windows. Mark picked up, then attach photo or signature proof on delivery."
      />
      {message ? <p className="mb-3 text-sm text-forest">{message}</p> : null}
      {error ? <p className="mb-3 text-sm text-urgent">{error}</p> : null}
      <div className="grid gap-4">
        {feed.map((item) => (
          <article key={item.donationId} className="rounded-2xl border border-line bg-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-muted">{item.donationId}</p>
                <h2 className="mt-1 text-lg font-semibold">
                  {item.lines?.length
                    ? item.lines.map((line) => `${line.foodType} ${line.quantity} kg`).join(", ")
                    : `${item.foodType} · ${item.quantity} kg`}
                </h2>
                <p className="text-base text-muted">
                  Pickup {item.pickupWindow ? formatBangkok(item.pickupWindow.start) : "window TBC"}
                </p>
                {item.matches && item.matches.length > 0 ? (
                  <ul className="mt-2 text-base">
                    {item.matches.map((match) => (
                      <li key={match.id}>
                        {match.foodBankName}: {match.quantityKg} kg
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-base text-muted">{item.foodBank?.name ?? "Unassigned food bank"}</p>
                )}
              </div>
              <StatusBadge value={item.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.status === "matched" ? (
                <button
                  type="button"
                  className="btn-solid rounded-lg px-4 py-2.5 text-base"
                  onClick={() => void pickup(item.donationId)}
                >
                  Mark picked up
                </button>
              ) : null}
              {item.status === "picked_up" ? (
                <button
                  type="button"
                  className="btn-line rounded-lg px-4 py-2.5 text-base"
                  onClick={() => setActiveId(item.donationId)}
                >
                  Confirm delivery with proof
                </button>
              ) : null}
            </div>
            {activeId === item.donationId ? (
              <div className="mt-4 rounded-xl border border-line p-4">
                <div className="flex gap-2 text-sm">
                  <button type="button" className="btn-line rounded-lg px-3 py-2 text-base" onClick={() => setProofKind("signature")}>
                    Signature
                  </button>
                  <button type="button" className="btn-line rounded-lg px-3 py-2 text-base" onClick={() => setProofKind("photo")}>
                    Photo
                  </button>
                </div>
                {proofKind === "signature" ? (
                  <canvas
                    ref={canvasRef}
                    width={520}
                    height={160}
                    className="mt-3 w-full rounded-lg border border-line bg-white"
                    onMouseDown={drawStart}
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-3 text-sm"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => setPhoto(String(reader.result ?? ""));
                      reader.readAsDataURL(file);
                    }}
                  />
                )}
                <button
                  type="button"
                  className="btn-solid mt-3 rounded-lg px-4 py-2.5 text-base"
                  onClick={() => void deliver(item.donationId)}
                >
                  Attach proof and mark delivered
                </button>
              </div>
            ) : null}
          </article>
        ))}
        {feed.length === 0 ? (
          <p className="rounded-2xl border border-line bg-panel p-8 text-sm text-muted">
            No matched runs waiting. Log a donation so auto-match can fill this feed.
          </p>
        ) : null}
      </div>
    </div>
  );
}
