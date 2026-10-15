import { TIMEZONE, parseDateTime } from "./time";
import type { DonationMessage, FieldErrors, PickupWindow } from "./types";

export const QUANTITY_UNIT = "kg" as const;
export const QUANTITY_MIN = 0.1;
export const QUANTITY_MAX = 5000;
export const MIN_SHELF_LIFE_MS = 0;

export type DonationInput = {
  donationId?: unknown;
  foodType?: unknown;
  quantity?: unknown;
  expiryDateTime?: unknown;
  pickupWindow?: unknown;
};

function asString(value: unknown): string | null {
  return typeof value === "string" ? value.trim() : null;
}

function parseQuantity(value: unknown): { quantity?: number; error?: string } {
  if (value === undefined || value === null || value === "") {
    return { error: "Quantity is required." };
  }
  if (typeof value === "string" && value.trim() === "") {
    return { error: "Quantity is required." };
  }
  if (typeof value === "string" && /[a-zA-Z]/.test(value)) {
    return { error: "Quantity must be a number in kilograms." };
  }
  const quantity = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(quantity)) {
    return { error: "Quantity must be a number in kilograms." };
  }
  if (quantity === 0) {
    return { error: "Quantity must be greater than 0." };
  }
  if (quantity < 0) {
    return { error: "Quantity cannot be negative." };
  }
  if (quantity < QUANTITY_MIN) {
    return { error: `Quantity must be at least ${QUANTITY_MIN} kg.` };
  }
  if (quantity > QUANTITY_MAX) {
    return { error: `Quantity cannot exceed ${QUANTITY_MAX} kg.` };
  }
  return { quantity: Math.round(quantity * 100) / 100 };
}

function parsePickupWindow(value: unknown): { window: PickupWindow | null; error?: string } {
  if (value === undefined || value === null || value === "") {
    return { window: null };
  }
  if (typeof value !== "object") {
    return { window: null, error: "Pickup window must include start and end times." };
  }
  const raw = value as { start?: unknown; end?: unknown };
  const start = parseDateTime(raw.start);
  const end = parseDateTime(raw.end);
  if (!start || !end) {
    return { window: null, error: "Pickup window must include valid start and end times." };
  }
  if (end <= start) {
    return { window: null, error: "Pickup window end must be after the start time." };
  }
  return { window: { start: start.toISOString(), end: end.toISOString() } };
}

export function validateDonationInput(input: DonationInput): {
  errors: FieldErrors;
  message?: Omit<DonationMessage, "donorId">;
} {
  const errors: FieldErrors = {};
  const foodType = asString(input.foodType);
  if (!foodType) {
    errors.foodType = "Food type is required.";
  } else if (foodType.length > 80) {
    errors.foodType = "Food type must be 80 characters or fewer.";
  }

  const quantityResult = parseQuantity(input.quantity);
  if (quantityResult.error) {
    errors.quantity = quantityResult.error;
  }

  const expiry = parseDateTime(input.expiryDateTime);
  if (input.expiryDateTime === undefined || input.expiryDateTime === null || input.expiryDateTime === "") {
    errors.expiryDateTime = "Expiry date and time is required.";
  } else if (!expiry) {
    errors.expiryDateTime = "Expiry date and time must be a valid date.";
  } else if (expiry.getTime() <= Date.now() + MIN_SHELF_LIFE_MS) {
    errors.expiryDateTime = "Expiry date and time must be in the future (Asia/Bangkok).";
  }

  const pickup = parsePickupWindow(input.pickupWindow);
  if (pickup.error) {
    errors.pickupWindow = pickup.error;
  }

  const donationId = asString(input.donationId);
  if (input.donationId !== undefined && input.donationId !== null && input.donationId !== "" && !donationId) {
    errors.donationId = "Donation ID must be a string.";
  }

  if (Object.keys(errors).length > 0 || !foodType || !quantityResult.quantity || !expiry) {
    return { errors };
  }

  return {
    errors: {},
    message: {
      donationId: donationId ?? "",
      foodType,
      quantity: quantityResult.quantity,
      quantityUnit: QUANTITY_UNIT,
      expiryDateTime: expiry.toISOString(),
      pickupWindow: pickup.window,
      timezone: TIMEZONE,
    },
  };
}
