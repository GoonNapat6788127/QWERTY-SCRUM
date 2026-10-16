import { json, requireUser } from "@/lib/http";
import { resetDemoData } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Clears leftover QA donations so matching capacity matches the Sprint 1 demo seed. */
export async function POST() {
  const auth = await requireUser(["donor", "logistics"]);
  if (auth.response) return auth.response;
  resetDemoData();
  return json({ reset: true, foodBanks: "demo seed", donations: 0 });
}
