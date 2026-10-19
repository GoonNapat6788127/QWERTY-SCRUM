import { json } from "@/lib/http";
import { FOOD_TYPES } from "@/lib/types";
import { QUANTITY_MAX, QUANTITY_MIN } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  return json({
    sprint: "Sprint 1",
    messageFormatAgreed: "Meeting 3, Friday 16 October 2026 (Day 2). Sprint 1 closes at Meeting 6 on Thursday 22 October.",
    messageFormat: {
      donationId: "DON-uuid",
      foodType: "string",
      quantity: "number",
      quantityUnit: "kg",
      expiryDateTime: "ISO-8601",
      pickupWindow: { start: "ISO-8601", end: "ISO-8601" },
      donorId: "usr-...",
      timezone: "Asia/Bangkok",
    },
    foodTypes: FOOD_TYPES,
    quantity: { unit: "kg", min: QUANTITY_MIN, max: QUANTITY_MAX },
    timezone: "Asia/Bangkok",
    minimumShelfLife: "Expiry must be strictly in the future; 5 minutes is accepted.",
    duplicateProtection: "Donation ID uniqueness plus optional Idempotency-Key header.",
    roles: ["donor", "foodbank", "driver", "logistics"],
    queue: { page: "/queue", endpoint: "/api/queue", timing: "Immediate, well under 60 seconds." },
    testEndpoint: { method: "POST", path: "/api/test/queue", auth: "donor or logistics" },
  });
}
