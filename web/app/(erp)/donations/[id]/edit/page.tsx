"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DonationForm, type LineDraft } from "@/components/DonationForm";
import { api, toLocalInput } from "@/lib/client";
import type { Donation, Match } from "@/lib/types";

export default function EditDonationPage() {
  const params = useParams<{ id: string }>();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ donation: Donation }>(`/api/donations/${params.id}`)
      .then((data) => setDonation(data.donation))
      .catch(() => setError("This donation cannot be opened."));
  }, [params.id]);

  if (error) {
    return <p className="text-base text-urgent">{error}</p>;
  }
  if (!donation) {
    return <p className="text-base text-muted">Loading donation…</p>;
  }
  if (donation.status !== "queued" && donation.status !== "matched") {
    return <p className="text-base text-urgent">This donation can be edited only before it is picked up.</p>;
  }

  const initialLines: LineDraft[] = (donation.lines?.length ? donation.lines : [
    { foodType: donation.foodType, quantity: donation.quantity, expiryDateTime: donation.expiryDateTime },
  ]).map((line) => ({
    foodType: line.foodType,
    quantity: String(line.quantity),
    expiryDateTime: toLocalInput(line.expiryDateTime),
  }));

  return (
    <DonationForm
      eyebrow="Donor log"
      title="Edit donation"
      description="Change the foods, quantities, expiry, or pickup window. Matching runs again. After a driver picks the food up, the log is locked."
      submitLabel="Save changes"
      initialLines={initialLines}
      initialPickupStart={donation.pickupWindow?.start}
      initialPickupEnd={donation.pickupWindow?.end}
      initialSplit={donation.splitAcrossBanks}
      onSubmit={(payload) =>
        api<{ donation: Donation; match: Match | null; matches?: Match[] }>(`/api/donations/${donation.donationId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      }
    />
  );
}
