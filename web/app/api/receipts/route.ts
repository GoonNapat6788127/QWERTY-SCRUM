import { json, requireUser } from "@/lib/http";
import { listReceipts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const receipts =
    auth.user.role === "donor" ? listReceipts(auth.user.id) : listReceipts();
  return json({ receipts });
}
