import { json, requireUser } from "@/lib/http";
import { getMatch, listDonations, listFoodBanks, matchesForDonation } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireUser(["foodbank", "logistics"]);
  if (auth.response) return auth.response;
  const banks = listFoodBanks();
  const incoming = listDonations()
    .filter((item) => item.foodBankId && item.status !== "queued" && item.status !== "expired")
    .map((donation) => ({
      donationId: donation.donationId,
      foodType: donation.foodType,
      quantity: donation.quantity,
      quantityUnit: donation.quantityUnit,
      expiryDateTime: donation.expiryDateTime,
      pickupWindow: donation.pickupWindow,
      status: donation.status,
      urgent: donation.urgent,
      driverId: donation.driverId,
      pickedUpAt: donation.pickedUpAt,
      deliveredAt: donation.deliveredAt,
      proofKind: donation.proofKind,
      proofDataUrl: donation.proofDataUrl,
      foodBank: banks.find((bank) => bank.id === donation.foodBankId) ?? null,
      match: getMatch(donation.matchId),
      matches: matchesForDonation(donation.donationId),
    }));
  return json({ incoming });
}
