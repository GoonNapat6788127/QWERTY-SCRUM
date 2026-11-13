import { json, requireUser } from "@/lib/http";
import { listMatches, scoreDonation, usingStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return usingStore(async () => {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const url = new URL(request.url);
  const donationId = url.searchParams.get("donationId");
  if (donationId) {
    return json(scoreDonation(donationId));
  }
  return json({ matches: listMatches() });
  });
}
