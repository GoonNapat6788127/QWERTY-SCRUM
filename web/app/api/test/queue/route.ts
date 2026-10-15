import { json, requireUser, validationError } from "@/lib/http";
import { ingestDonation } from "@/lib/store";
import { validateDonationInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** QA injection endpoint promised in Sprint 1 Day 2 (US1a). */
export async function POST(request: Request) {
  const auth = await requireUser(["donor", "logistics"]);
  if (auth.response) return auth.response;

  const body = await request.json().catch(() => ({}));
  const { errors, message } = validateDonationInput(body);
  if (!message) return validationError(errors);

  const donor =
    auth.user.role === "donor"
      ? auth.user
      : {
          ...auth.user,
          id: "usr-donor-1",
          role: "donor" as const,
          organization: "QA injected donor",
          lat: 13.746,
          lng: 100.534,
        };

  const result = ingestDonation({
    message,
    donor,
    idempotencyKey: request.headers.get("Idempotency-Key"),
  });

  return json(
    {
      donation: result.donation,
      match: result.match,
      duplicate: result.duplicate,
      queuedAt: result.donation.queuedAt,
      queuePath: "/queue",
      queueEndpoint: "/api/queue",
    },
    result.duplicate ? 200 : 201,
  );
}
