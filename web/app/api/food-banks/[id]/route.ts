import { json, jsonError, requireUser } from "@/lib/http";
import { updateFoodBankCapacity, usingStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return usingStore(async () => {
    const auth = await requireUser(["foodbank", "logistics"]);
    if (auth.response) return auth.response;
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as {
      reportedCapacityKg?: number;
      remainingCapacityKg?: number;
      deliveryRangeKm?: number;
    };
    const result = updateFoodBankCapacity(id, auth.user, body);
    if (!result.ok) return jsonError(result.error, result.status);
    return json({ foodBank: result.foodBank });
  });
}
