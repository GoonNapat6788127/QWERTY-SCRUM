import { TIMEZONE, parseDateTime } from "./time";
import type { DonationLine, DonationMessage, FieldErrors, PickupWindow } from "./types";

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
  lines?: unknown;
  splitAcrossBanks?: unknown;
};

export type DonationLog = Omit<DonationMessage, "donorId"> & {
  lines: DonationLine[];
  splitAcrossBanks: boolean;
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

function summarizeFoodType(lines: DonationLine[]): string {
  if (lines.length === 1) return lines[0].foodType;
  const joined = lines.map((line) => line.foodType).join(", ");
  if (joined.length <= 80) return joined;
  return `${lines[0].foodType} +${lines.length - 1} more`;
}

export function validateDonationLog(input: DonationInput): {
  errors: FieldErrors;
  log?: DonationLog;
} {
  if (!Array.isArray(input.lines)) {
    const legacy = validateDonationInput(input);
    if (!legacy.message) return { errors: legacy.errors };
    return {
      errors: {},
      log: {
        ...legacy.message,
        lines: [
          {
            foodType: legacy.message.foodType,
            quantity: legacy.message.quantity,
            expiryDateTime: legacy.message.expiryDateTime,
          },
        ],
        splitAcrossBanks: false,
      },
    };
  }

  const errors: FieldErrors = {};
  if (input.lines.length === 0) {
    errors.lines = "Add at least one food.";
  }

  const lines: DonationLine[] = [];
  input.lines.forEach((raw, index) => {
    const label = `Food ${index + 1}`;
    const row = raw && typeof raw === "object" ? (raw as DonationInput) : {};
    const foodType = asString(row.foodType);
    if (!foodType) {
      errors.foodType = errors.foodType ?? "Food type is required.";
      errors.lines = errors.lines ?? `${label}: food type is required.`;
    } else if (foodType.length > 80) {
      errors.foodType = "Food type must be 80 characters or fewer.";
      errors.lines = errors.lines ?? `${label}: food type must be 80 characters or fewer.`;
    }

    const quantityResult = parseQuantity(row.quantity);
    if (quantityResult.error) {
      errors.quantity = errors.quantity ?? quantityResult.error;
      errors.lines = errors.lines ?? `${label}: ${quantityResult.error}`;
    }

    const expiry = parseDateTime(row.expiryDateTime);
    if (row.expiryDateTime === undefined || row.expiryDateTime === null || row.expiryDateTime === "") {
      errors.expiryDateTime = errors.expiryDateTime ?? "Expiry date and time is required.";
      errors.lines = errors.lines ?? `${label}: expiry date and time is required.`;
    } else if (!expiry) {
      errors.expiryDateTime = errors.expiryDateTime ?? "Expiry date and time must be a valid date.";
      errors.lines = errors.lines ?? `${label}: expiry date and time must be a valid date.`;
    } else if (expiry.getTime() <= Date.now() + MIN_SHELF_LIFE_MS) {
      errors.expiryDateTime = errors.expiryDateTime ?? "Expiry date and time must be in the future (Asia/Bangkok).";
      errors.lines = errors.lines ?? `${label}: expiry must be in the future.`;
    }

    if (foodType && quantityResult.quantity && expiry && expiry.getTime() > Date.now()) {
      lines.push({
        foodType,
        quantity: quantityResult.quantity,
        expiryDateTime: expiry.toISOString(),
      });
    }
  });

  const pickup = parsePickupWindow(input.pickupWindow);
  if (pickup.error) errors.pickupWindow = pickup.error;

  const donationId = asString(input.donationId);
  if (input.donationId !== undefined && input.donationId !== null && input.donationId !== "" && !donationId) {
    errors.donationId = "Donation ID must be a string.";
  }
  if (input.splitAcrossBanks !== undefined && typeof input.splitAcrossBanks !== "boolean") {
    errors.form = "Split across food banks must be true or false.";
  }

  if (Object.keys(errors).length > 0 || lines.length !== input.lines.length) {
    return { errors };
  }

  const quantity = Math.round(lines.reduce((sum, line) => sum + line.quantity, 0) * 100) / 100;
  const expiryDateTime = lines
    .map((line) => line.expiryDateTime)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];

  return {
    errors: {},
    log: {
      donationId: donationId ?? "",
      foodType: summarizeFoodType(lines),
      quantity,
      quantityUnit: QUANTITY_UNIT,
      expiryDateTime,
      pickupWindow: pickup.window,
      timezone: TIMEZONE,
      lines,
      splitAcrossBanks: input.splitAcrossBanks === true,
    },
  };
}
