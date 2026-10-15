import { json, jsonError, requireUser } from "@/lib/http";
import { markDelivered } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireUser(["driver", "logistics"]);
  if (auth.response) return auth.response;
  const body = (await request.json().catch(() => ({}))) as {
    donationId?: string;
    proofDataUrl?: string;
    proofKind?: "photo" | "signature";
    weightKg?: number;
  };
  if (!body.donationId) return jsonError("donationId is required.", 400);
  if (!body.proofDataUrl) return jsonError("Delivery proof (photo or signature) is required.", 400);
  if (body.proofKind !== "photo" && body.proofKind !== "signature") {
    return jsonError("proofKind must be photo or signature.", 400);
  }
  const result = markDelivered({
    donationId: body.donationId,
    driver: auth.user,
    proofDataUrl: body.proofDataUrl,
    proofKind: body.proofKind,
    weightKg: body.weightKg,
  });
  if ("error" in result) return jsonError(result.error, result.status);
  return json({ donation: result.donation, receipt: result.receipt });
}
