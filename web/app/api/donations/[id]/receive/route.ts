import { json, jsonError, requireUser } from "@/lib/http";
import { confirmFoodBankReceipt, usingStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return usingStore(async () => {
    const auth = await requireUser(["foodbank", "logistics"]);
    if (auth.response) return auth.response;
    const { id } = await context.params;
    const result = confirmFoodBankReceipt(id, auth.user);
    if (!result.ok) return jsonError(result.error, result.status);
    return json({ donation: result.donation });
  });
}
