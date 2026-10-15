import { json, requireUser } from "@/lib/http";
import { driverActivity } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireUser(["logistics", "foodbank"]);
  if (auth.response) return auth.response;
  return json({ drivers: driverActivity() });
}
