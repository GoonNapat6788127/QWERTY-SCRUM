import { getRequestUser, json, jsonError } from "@/lib/http";
import { usingStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return usingStore(async () => {
    const user = await getRequestUser();
    if (!user) return jsonError("Authentication required.", 401);
    return json({ user });
  });
}
