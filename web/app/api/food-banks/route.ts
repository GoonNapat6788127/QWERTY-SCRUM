import { json, requireUser } from "@/lib/http";
import { listFoodBanks } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  return json({ foodBanks: listFoodBanks() });
}
