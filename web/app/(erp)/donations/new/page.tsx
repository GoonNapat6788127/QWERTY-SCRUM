"use client";

import { useEffect, useRef, useState } from "react";
import { DonationForm, blankLine } from "@/components/DonationForm";
import { api } from "@/lib/client";
import { createDonationId } from "@/lib/ids";
import type { Donation, Match } from "@/lib/types";

export default function NewDonationPage() {
  const donationId = useRef("");
  const [forbidden, setForbidden] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    donationId.current = createDonationId();
    api<{ user: { role: string } }>("/api/auth/me")
      .then((data) => {
        if (data.user.role !== "donor") {
          setForbidden("Only donors can log a donation. Sign in as donor@qwerty.test.");
        }
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return <p className="text-base text-muted">Loading donation form…</p>;
  }
  if (forbidden) {
    return (
      <div className="rounded-2xl border border-line bg-panel p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl">Donation form blocked</h1>
        <p className="mt-2 text-base text-urgent">{forbidden}</p>
      </div>
    );
  }

  return (
    <DonationForm
      eyebrow="US1a · US6"
      title="Log a donation"
      description="Add one or more foods on the same log. Send the full weight to one food bank, or split it across every bank that still has room."
      submitLabel="Submit donation"
      initialLines={[blankLine()]}
      onSubmit={(payload) => {
        const id = donationId.current || createDonationId();
        return api<{ donation: Donation; match: Match | null; matches?: Match[] }>("/api/donations", {
          method: "POST",
          headers: { "Idempotency-Key": id },
          body: JSON.stringify({ ...payload, donationId: id }),
        }).then((data) => {
          donationId.current = createDonationId();
          return data;
        });
      }}
    />
  );
}
