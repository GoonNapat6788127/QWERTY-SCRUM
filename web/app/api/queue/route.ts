import { json, requireUser } from "@/lib/http";
import { matchingQueue } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const started = Date.now();
  const items = matchingQueue();
  return json({
    items,
    generatedAt: new Date().toISOString(),
    elapsedMs: Date.now() - started,
  });
}
