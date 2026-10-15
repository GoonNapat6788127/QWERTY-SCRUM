import { json, jsonError, requireUser } from "@/lib/http";
import { listDriverPings, recordDriverPing } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const started = Date.now();
  return json({
    locations: listDriverPings(),
    generatedAt: new Date().toISOString(),
    elapsedMs: Date.now() - started,
  });
}

export async function POST(request: Request) {
  const auth = await requireUser(["driver", "logistics"]);
  if (auth.response) return auth.response;
  const body = (await request.json().catch(() => ({}))) as { lat?: number; lng?: number };
  if (typeof body.lat !== "number" || typeof body.lng !== "number") {
    return jsonError("lat and lng are required numbers.", 400);
  }
  const ping = recordDriverPing(auth.user.role === "driver" ? auth.user.id : "usr-driver-1", body.lat, body.lng);
  return json({ location: ping });
}
