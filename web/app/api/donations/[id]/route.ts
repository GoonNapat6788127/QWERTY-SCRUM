import { json, jsonError, requireUser } from "@/lib/http";
import { getDonation, getMatch, scoreDonation } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const { id } = await context.params;
  const donation = getDonation(id);
  if (!donation) return jsonError("Donation not found.", 404);
  if (auth.user.role === "donor" && donation.donorId !== auth.user.id) {
    return jsonError("You do not have permission to view this donation.", 403);
  }
  return json({
    donation,
    match: getMatch(donation.matchId),
    rankings: scoreDonation(id)?.rankings ?? [],
  });
}
