import { cookies } from "next/headers";
import { SESSION_COOKIE, json, jsonError } from "@/lib/http";
import { createSession, findUserByEmail } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  if (!email || !password) {
    return jsonError("Email and password are required.", 400);
  }
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return jsonError("Invalid email or password.", 401);
  }
  const token = createSession(user.id);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  const { password: _password, ...safe } = user;
  return json({ user: safe });
}
