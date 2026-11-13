import { json, requireUser } from "@/lib/http";
import { listNotifications, usingStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return usingStore(async () => {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const items = listNotifications().filter((item) => {
    if (auth.user.role === "driver") return item.audience === "driver";
    return true;
  });
  return json({ notifications: items });
  });
}
