import { json, requireUser } from "@/lib/http";
import { dashboardSummary, listDonations, listNotifications, usingStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return usingStore(async () => {
    const auth = await requireUser();
    if (auth.response) return auth.response;
    return json({
      summary: dashboardSummary(),
      donations: listDonations(),
      notifications: listNotifications(),
    });
  });
}
