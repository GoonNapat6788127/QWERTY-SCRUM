import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { proposeMatch, rankFoodBanks } from "./matching";
import { createDonationId, createId } from "./ids";
import { DEMO_FOOD_BANKS, DEMO_USERS } from "./seed";
import { hoursUntil, nowIso } from "./time";
import type {
  Donation,
  DriverPing,
  FoodBank,
  Match,
  Notification,
  PublicUser,
  Receipt,
  User,
} from "./types";

type Session = { token: string; userId: string; createdAt: string };

type Database = {
  users: User[];
  foodBanks: FoodBank[];
  donations: Donation[];
  matches: Match[];
  receipts: Receipt[];
  notifications: Notification[];
  sessions: Session[];
  driverPings: DriverPing[];
  idempotency: Record<string, string>;
};

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const memory = globalThis as typeof globalThis & { __qwertyDb?: Database };

function emptyDb(): Database {
  return {
    users: structuredClone(DEMO_USERS),
    foodBanks: structuredClone(DEMO_FOOD_BANKS),
    donations: [],
    matches: [],
    receipts: [],
    notifications: [],
    sessions: [],
    driverPings: [
      {
        driverId: "usr-driver-1",
        lat: 13.75,
        lng: 100.51,
        recordedAt: nowIso(),
      },
    ],
    idempotency: {},
  };
}

function loadDb(): Database {
  if (memory.__qwertyDb) return memory.__qwertyDb;
  try {
    const raw = readFileSync(DB_PATH, "utf8");
    memory.__qwertyDb = JSON.parse(raw) as Database;
  } catch {
    memory.__qwertyDb = emptyDb();
    persist();
  }
  return memory.__qwertyDb;
}

function persist() {
  mkdirSync(path.dirname(DB_PATH), { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(loadDb(), null, 2), "utf8");
}

function db(): Database {
  return loadDb();
}

function publicUser(user: User): PublicUser {
  const { password: _password, ...safe } = user;
  return safe;
}

export function listUsers(): PublicUser[] {
  return db().users.map(publicUser);
}

export function findUserByEmail(email: string): User | undefined {
  return db().users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return db().users.find((user) => user.id === id);
}

export function createSession(userId: string): string {
  const token = createId("ses");
  db().sessions.push({ token, userId, createdAt: nowIso() });
  persist();
  return token;
}

export function getSessionUser(token: string | undefined): PublicUser | null {
  if (!token) return null;
  const session = db().sessions.find((item) => item.token === token);
  if (!session) return null;
  const user = findUserById(session.userId);
  return user ? publicUser(user) : null;
}

export function destroySession(token: string | undefined) {
  if (!token) return;
  db().sessions = db().sessions.filter((item) => item.token !== token);
  persist();
}

export function listFoodBanks(): FoodBank[] {
  return db().foodBanks;
}

function refreshDonationFlags(donation: Donation): Donation {
  const remaining = hoursUntil(donation.expiryDateTime);
  if (remaining <= 0 && donation.status !== "delivered") {
    donation.status = "expired";
    donation.urgent = true;
  } else {
    donation.urgent = remaining <= 24 && donation.status !== "delivered";
  }
  emitExpiryNotifications(donation, remaining);
  return donation;
}

function emitExpiryNotifications(donation: Donation, remainingHours: number) {
  const thresholds: Array<24 | 12 | 2> = [24, 12, 2];
  for (const threshold of thresholds) {
    if (remainingHours > threshold || remainingHours <= 0) continue;
    const exists = db().notifications.some(
      (item) => item.donationId === donation.donationId && item.thresholdHours === threshold,
    );
    if (exists) continue;
    const message = `${donation.foodType} (${donation.donationId}) is urgent — ${threshold} hours or less remain before expiry.`;
    db().notifications.push(
      {
        id: createId("NTF"),
        donationId: donation.donationId,
        audience: "staff",
        thresholdHours: threshold,
        message,
        createdAt: nowIso(),
        read: false,
      },
      {
        id: createId("NTF"),
        donationId: donation.donationId,
        audience: "driver",
        thresholdHours: threshold,
        message,
        createdAt: nowIso(),
        read: false,
      },
    );
  }
}

function refreshAll() {
  for (const donation of db().donations) {
    refreshDonationFlags(donation);
  }
}

export function ingestDonation(input: {
  message: Omit<import("./types").DonationMessage, "donorId"> & { donorId?: string };
  donor: PublicUser;
  idempotencyKey?: string | null;
}): { donation: Donation; duplicate: boolean; match: Match | null } {
  refreshAll();
  const data = db();

  if (input.idempotencyKey && data.idempotency[input.idempotencyKey]) {
    const existing = data.donations.find(
      (item) => item.donationId === data.idempotency[input.idempotencyKey],
    );
    if (existing) {
      return { donation: refreshDonationFlags(existing), duplicate: true, match: getMatch(existing.matchId) };
    }
  }

  const requestedId = input.message.donationId;
  if (requestedId) {
    const existing = data.donations.find((item) => item.donationId === requestedId);
    if (existing) {
      return { donation: refreshDonationFlags(existing), duplicate: true, match: getMatch(existing.matchId) };
    }
  }

  const donationId = requestedId || createDonationId();
  const queuedAt = nowIso();
  const donation: Donation = {
    donationId,
    foodType: input.message.foodType,
    quantity: input.message.quantity,
    quantityUnit: "kg",
    expiryDateTime: input.message.expiryDateTime,
    pickupWindow: input.message.pickupWindow,
    donorId: input.donor.id,
    timezone: "Asia/Bangkok",
    createdAt: queuedAt,
    queuedAt,
    status: "queued",
    urgent: false,
    donorName: input.donor.organization,
    pickupLat: input.donor.lat,
    pickupLng: input.donor.lng,
    matchId: null,
    foodBankId: null,
    driverId: null,
    pickedUpAt: null,
    deliveredAt: null,
    proofDataUrl: null,
    proofKind: null,
    weightKg: input.message.quantity,
    idempotencyKey: input.idempotencyKey ?? null,
  };
  refreshDonationFlags(donation);
  data.donations.unshift(donation);
  if (input.idempotencyKey) {
    data.idempotency[input.idempotencyKey] = donationId;
  }

  const match = proposeMatch(donation, data.foodBanks);
  if (match) {
    data.matches.unshift(match);
    donation.status = "matched";
    donation.matchId = match.id;
    donation.foodBankId = match.foodBankId;
    const foodBank = data.foodBanks.find((item) => item.id === match.foodBankId);
    if (foodBank) {
      foodBank.remainingCapacityKg = Number(
        Math.max(0, foodBank.remainingCapacityKg - donation.quantity).toFixed(2),
      );
    }
  }

  persist();
  return { donation, duplicate: false, match };
}

export function listDonations(): Donation[] {
  refreshAll();
  persist();
  return db().donations;
}

export function getDonation(donationId: string): Donation | undefined {
  refreshAll();
  const donation = db().donations.find((item) => item.donationId === donationId);
  return donation ? refreshDonationFlags(donation) : undefined;
}

export function matchingQueue() {
  return listDonations()
    .filter((donation) => donation.status === "queued" || donation.status === "matched")
    .map((donation) => ({
      donationId: donation.donationId,
      foodType: donation.foodType,
      quantity: donation.quantity,
      quantityUnit: donation.quantityUnit,
      expiryDateTime: donation.expiryDateTime,
      pickupWindow: donation.pickupWindow,
      urgent: donation.urgent,
      status: donation.status,
      queuedAt: donation.queuedAt,
      donorName: donation.donorName,
      matchId: donation.matchId,
      foodBankId: donation.foodBankId,
      timezone: donation.timezone,
    }));
}

export function getMatch(matchId: string | null): Match | null {
  if (!matchId) return null;
  return db().matches.find((item) => item.id === matchId) ?? null;
}

export function listMatches(): Match[] {
  return db().matches;
}

export function scoreDonation(donationId: string) {
  const donation = getDonation(donationId);
  if (!donation) return null;
  return {
    donationId,
    rankings: rankFoodBanks(donation, db().foodBanks),
    proposed: getMatch(donation.matchId),
  };
}

export function markPickedUp(donationId: string, driver: PublicUser) {
  const donation = getDonation(donationId);
  if (!donation) return { error: "Donation not found.", status: 404 as const };
  if (donation.status !== "matched") {
    return { error: "Only a matched donation can be marked picked up.", status: 409 as const };
  }
  donation.status = "picked_up";
  donation.driverId = driver.id;
  donation.pickedUpAt = nowIso();
  persist();
  return { donation };
}

export function markDelivered(input: {
  donationId: string;
  driver: PublicUser;
  proofDataUrl: string;
  proofKind: "photo" | "signature";
  weightKg?: number;
}) {
  const donation = getDonation(input.donationId);
  if (!donation) return { error: "Donation not found.", status: 404 as const };
  if (donation.status !== "picked_up") {
    return { error: "Only a picked-up donation can be marked delivered.", status: 409 as const };
  }
  donation.status = "delivered";
  donation.driverId = input.driver.id;
  donation.deliveredAt = nowIso();
  donation.proofDataUrl = input.proofDataUrl;
  donation.proofKind = input.proofKind;
  if (input.weightKg && input.weightKg > 0) {
    donation.weightKg = input.weightKg;
  }
  const receipt = createReceipt(donation);
  persist();
  return { donation, receipt };
}

function createReceipt(donation: Donation): Receipt {
  const donor = findUserById(donation.donorId);
  const receipt: Receipt = {
    id: createId("RCP"),
    donationId: donation.donationId,
    donorId: donation.donorId,
    donorEmail: donor?.email ?? "",
    foodType: donation.foodType,
    weightKg: donation.weightKg,
    timestamp: donation.deliveredAt ?? nowIso(),
    emailedTo: donor?.email ?? "",
    emailStatus: "sent",
  };
  db().receipts.unshift(receipt);
  return receipt;
}

export function listReceipts(donorId?: string): Receipt[] {
  const receipts = db().receipts;
  return donorId ? receipts.filter((item) => item.donorId === donorId) : receipts;
}

export function getReceipt(id: string): Receipt | undefined {
  return db().receipts.find((item) => item.id === id);
}

export function listNotifications(): Notification[] {
  refreshAll();
  persist();
  return db().notifications;
}

export function recordDriverPing(driverId: string, lat: number, lng: number): DriverPing {
  const ping: DriverPing = { driverId, lat, lng, recordedAt: nowIso() };
  db().driverPings = db().driverPings.filter((item) => item.driverId !== driverId);
  db().driverPings.push(ping);
  persist();
  return ping;
}

export function listDriverPings(): DriverPing[] {
  return db().driverPings;
}

export function driverActivity() {
  const drivers = db().users.filter((user) => user.role === "driver");
  return drivers.map((driver) => {
    const runs = db().donations.filter((donation) => donation.driverId === driver.id);
    const ping = db().driverPings.find((item) => item.driverId === driver.id);
    return {
      driverId: driver.id,
      name: driver.name,
      accepted: runs.filter((item) => item.status === "matched" || item.status === "picked_up" || item.status === "delivered").length,
      pickedUp: runs.filter((item) => item.pickedUpAt).length,
      delivered: runs.filter((item) => item.status === "delivered").length,
      lastRunAt: runs[0]?.deliveredAt ?? runs[0]?.pickedUpAt ?? null,
      location: ping ?? null,
      runs: runs
        .map((donation) => ({
          donationId: donation.donationId,
          foodType: donation.foodType,
          status: donation.status,
          pickedUpAt: donation.pickedUpAt,
          deliveredAt: donation.deliveredAt,
          foodBankId: donation.foodBankId,
        }))
        .sort((a, b) => (b.deliveredAt ?? b.pickedUpAt ?? "").localeCompare(a.deliveredAt ?? a.pickedUpAt ?? "")),
    };
  });
}

export function dashboardSummary() {
  const donations = listDonations();
  return {
    open: donations.filter((item) => item.status === "queued").length,
    matched: donations.filter((item) => item.status === "matched").length,
    pickedUp: donations.filter((item) => item.status === "picked_up").length,
    delivered: donations.filter((item) => item.status === "delivered").length,
    urgent: donations.filter((item) => item.urgent && item.status !== "delivered").length,
    foodBanks: listFoodBanks().length,
    notifications: listNotifications().filter((item) => !item.read).length,
  };
}

export function decayEstimate(donationId: string) {
  const donation = getDonation(donationId);
  if (!donation) return null;
  const hours = hoursUntil(donation.expiryDateTime);
  const perishableBoost = /prepared|dairy|produce|bakery/i.test(donation.foodType) ? 1.25 : 1;
  const risk = Math.min(100, Math.max(0, Math.round((1 - hours / 48) * 100 * perishableBoost)));
  return {
    donationId,
    foodType: donation.foodType,
    hoursRemaining: Number(hours.toFixed(2)),
    riskScore: risk,
    method: "heuristic-spike",
    note: "Sprint 2 US8 research spike: perishable types decay faster; this is not a trained model.",
  };
}

export function resetDemoData() {
  memory.__qwertyDb = emptyDb();
  persist();
}
