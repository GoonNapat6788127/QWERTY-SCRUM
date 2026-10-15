import { json, jsonError, requireUser } from "@/lib/http";
import { markPickedUp } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireUser(["driver", "logistics"]);
  if (auth.response) return auth.response;
  const body = (await request.json().catch(() => ({}))) as { donationId?: string };
  if (!body.donationId) return jsonError("donationId is required.", 400);
  const result = markPickedUp(body.donationId, auth.user);
  if ("error" in result) return jsonError(result.error, result.status);
  return json({
    donation: result.donation,
    pickup: {
      donationId: result.donation.donationId,
      driverId: result.donation.driverId,
      pickedUpAt: result.donation.pickedUpAt,
    },
  });
}
