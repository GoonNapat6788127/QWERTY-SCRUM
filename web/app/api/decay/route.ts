import { json, jsonError, requireUser } from "@/lib/http";
import { decayEstimate } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const donationId = new URL(request.url).searchParams.get("donationId");
  if (!donationId) return jsonError("donationId is required.", 400);
  const estimate = decayEstimate(donationId);
  if (!estimate) return jsonError("Donation not found.", 404);
  return json({ estimate });
}
