export const ROLES = ["donor", "foodbank", "driver", "logistics"] as const;
export type Role = (typeof ROLES)[number];

export const FOOD_TYPES = [
  "Prepared meals",
  "Bakery",
  "Fresh produce",
  "Dairy",
  "Dry goods",
  "Frozen",
  "Canned",
  "Other",
] as const;
export type FoodType = (typeof FOOD_TYPES)[number];

export const DONATION_STATUSES = [
  "queued",
  "matched",
  "picked_up",
  "delivered",
  "expired",
] as const;
export type DonationStatus = (typeof DONATION_STATUSES)[number];

export type PickupWindow = {
  start: string;
  end: string;
};

/** Agreed Sprint 1 Day 2 queue message (US1a / US6). */
export type DonationMessage = {
  donationId: string;
  foodType: string;
  quantity: number;
  quantityUnit: "kg";
  expiryDateTime: string;
  pickupWindow: PickupWindow | null;
  donorId: string;
  timezone: "Asia/Bangkok";
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  organization: string;
  lat: number;
  lng: number;
};

export type FoodBank = {
  id: string;
  name: string;
  userId: string;
  lat: number;
  lng: number;
  address: string;
  reportedCapacityKg: number;
  remainingCapacityKg: number;
  deliveryRangeKm: number;
};

export type Donation = DonationMessage & {
  createdAt: string;
  queuedAt: string;
  status: DonationStatus;
  urgent: boolean;
  donorName: string;
  pickupLat: number;
  pickupLng: number;
  matchId: string | null;
  foodBankId: string | null;
  driverId: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  proofDataUrl: string | null;
  proofKind: "photo" | "signature" | null;
  weightKg: number;
  idempotencyKey: string | null;
};

export type Match = {
  id: string;
  donationId: string;
  foodBankId: string;
  foodBankName: string;
  proposedAt: string;
  distanceKm: number;
  proximityScore: number;
  capacityScore: number;
  totalScore: number;
  withinRange: boolean;
  hasCapacity: boolean;
};

export type Receipt = {
  id: string;
  donationId: string;
  donorId: string;
  donorEmail: string;
  foodType: string;
  weightKg: number;
  timestamp: string;
  emailedTo: string;
  emailStatus: "queued" | "sent";
};

export type Notification = {
  id: string;
  donationId: string;
  audience: "staff" | "driver";
  thresholdHours: 24 | 12 | 2;
  message: string;
  createdAt: string;
  read: boolean;
};

export type DriverPing = {
  driverId: string;
  lat: number;
  lng: number;
  recordedAt: string;
};

export type PublicUser = Omit<User, "password">;

export type FieldErrors = Record<string, string>;
