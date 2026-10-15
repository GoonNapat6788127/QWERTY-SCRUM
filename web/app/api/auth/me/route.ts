import { getRequestUser, json, jsonError } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getRequestUser();
  if (!user) return jsonError("Authentication required.", 401);
  return json({ user });
}
