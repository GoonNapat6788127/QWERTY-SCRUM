import { json, requireUser } from "@/lib/http";
import { getMatch, listDonations, listFoodBanks, matchesForDonation } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireUser(["driver", "logistics", "foodbank"]);
  if (auth.response) return auth.response;
  const foodBanks = listFoodBanks();
  const feed = listDonations()
    .filter((item) => item.status === "matched" || item.status === "picked_up")
    .map((donation) => ({
      ...donation,
      match: getMatch(donation.matchId),
      matches: matchesForDonation(donation.donationId),
      foodBank: foodBanks.find((item) => item.id === donation.foodBankId) ?? null,
    }));
  return json({ feed });
}
