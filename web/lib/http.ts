import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionUser } from "./store";
import type { FieldErrors, PublicUser, Role } from "./types";

export const SESSION_COOKIE = "qwerty_session";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function jsonError(error: string, status: number, extra?: Record<string, unknown>) {
  return json({ error, ...extra }, status);
}

export function validationError(errors: FieldErrors) {
  return json({ error: "Validation failed.", errors }, 400);
}

export async function getRequestUser(): Promise<PublicUser | null> {
  const jar = await cookies();
  return getSessionUser(jar.get(SESSION_COOKIE)?.value);
}

export async function requireUser(roles?: Role[]) {
  const user = await getRequestUser();
  if (!user) {
    return { user: null as PublicUser | null, response: jsonError("Authentication required.", 401) };
  }
  if (roles && !roles.includes(user.role)) {
    return {
      user,
      response: jsonError("You do not have permission to perform this action.", 403, { role: user.role }),
    };
  }
  return { user, response: null as NextResponse | null };
}
