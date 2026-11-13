import { json, requireUser } from "@/lib/http";
import { listReceipts, usingStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return usingStore(async () => {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const receipts =
    auth.user.role === "donor" ? listReceipts(auth.user.id) : listReceipts();
  return json({ receipts });
  });
}
