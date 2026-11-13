import { json, jsonError, requireUser } from "@/lib/http";
import { markNotificationRead, usingStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return usingStore(async () => {
    const auth = await requireUser();
    if (auth.response) return auth.response;
    const { id } = await context.params;
    const result = markNotificationRead(id, auth.user);
    if (!result.ok) return jsonError(result.error, result.status);
    return json({ notification: result.notification });
  });
}
