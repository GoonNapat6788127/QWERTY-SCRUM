import { json, jsonError, requireUser, validationError } from "@/lib/http";
import { ingestDonation, listDonations } from "@/lib/store";
import { validateDonationInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const donations = listDonations();
  const visible =
    auth.user.role === "donor"
      ? donations.filter((item) => item.donorId === auth.user.id)
      : donations;
  return json({ donations: visible });
}

export async function POST(request: Request) {
  const auth = await requireUser(["donor"]);
  if (auth.response) return auth.response;

  const body = await request.json().catch(() => ({}));
  const { errors, message } = validateDonationInput(body);
  if (!message) return validationError(errors);

  const idempotencyKey = request.headers.get("Idempotency-Key");
  const result = ingestDonation({
    message,
    donor: auth.user,
    idempotencyKey,
  });

  return json(
    {
      donation: result.donation,
      match: result.match,
      duplicate: result.duplicate,
      queuedAt: result.donation.queuedAt,
      queueVisible: true,
    },
    result.duplicate ? 200 : 201,
  );
}

export async function PUT() {
  return jsonError("Use POST to log a donation.", 405);
}
