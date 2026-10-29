import { json, jsonError, requireUser, validationError } from "@/lib/http";
import { getDonation, getMatch, matchesForDonation, scoreDonation, updateDonation } from "@/lib/store";
import { validateDonationLog } from "@/lib/validation";

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
    matches: matchesForDonation(id),
    rankings: scoreDonation(id)?.rankings ?? [],
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireUser(["donor"]);
  if (auth.response) return auth.response;
  if (!auth.user) return jsonError("Authentication required.", 401);
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const { errors, log } = validateDonationLog(body);
  if (!log) return validationError(errors);
  const result = updateDonation(id, auth.user, log);
  if ("error" in result) return jsonError(result.error, result.status);
  return json({
    donation: result.donation,
    match: result.match,
    matches: result.matches,
  });
}
