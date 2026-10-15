import { cookies } from "next/headers";
import { SESSION_COOKIE, json } from "@/lib/http";
import { destroySession } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST() {
  const jar = await cookies();
  destroySession(jar.get(SESSION_COOKIE)?.value);
  jar.delete(SESSION_COOKIE);
  return json({ ok: true });
}
