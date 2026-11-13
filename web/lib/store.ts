import { AsyncLocalStorage } from "node:async_hooks";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { proposeMatches, rankFoodBanks } from "./matching";
import { createDonationId, createId } from "./ids";
import { DEMO_FOOD_BANKS, DEMO_USERS } from "./seed";
import { hoursUntil, nowIso } from "./time";
import type { DonationLog } from "./validation";
import type {
  Donation,
  DonationLine,
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
const SHARED_PATH = "qwerty/db.json";
const requestDb = new AsyncLocalStorage<Database>();

const memory = globalThis as typeof globalThis & { __qwertyDb?: Database };

function usesSharedStore(): boolean {
  return process.env.VERCEL === "1" && Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

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

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 3_600_000).toISOString();
}

function showcaseDb(): Database {
  const base = emptyDb();
  const now = nowIso();
  const soon = hoursFromNow(8);
  const later = hoursFromNow(72);
  const window = { start: hoursFromNow(2), end: hoursFromNow(5) };
  const proof =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const donor = {
    donorId: "usr-donor-1",
    donorName: "Bangkok Fresh Market",
    pickupLat: 13.746,
    pickupLng: 100.534,
    timezone: "Asia/Bangkok" as const,
    quantityUnit: "kg" as const,
    declinedFoodBankIds: [] as string[],
    foodBankReceivedBy: null,
    idempotencyKey: null,
    createdAt: now,
    queuedAt: now,
  };

  const queued: Donation = {
    ...donor,
    donationId: "DON-DEMO-QUEUE",
    foodType: "Dry goods",
    quantity: 4000,
    expiryDateTime: later,
    pickupWindow: window,
    status: "queued",
    urgent: false,
    lines: [{ foodType: "Dry goods", quantity: 4000, expiryDateTime: later }],
    splitAcrossBanks: false,
    matchId: null,
    foodBankId: null,
    driverId: null,
    pickedUpAt: null,
    deliveredAt: null,
    proofDataUrl: null,
    proofKind: null,
    weightKg: 4000,
    foodBankReceivedAt: null,
  };
  const matched: Donation = {
    ...donor,
    donationId: "DON-DEMO-MATCH",
    foodType: "Bakery",
    quantity: 10,
    expiryDateTime: later,
    pickupWindow: window,
    status: "matched",
    urgent: false,
    lines: [{ foodType: "Bakery", quantity: 10, expiryDateTime: later }],
    splitAcrossBanks: false,
    matchId: "MAT-DEMO-MATCH",
    foodBankId: "fb-sos-bkk",
    driverId: null,
    pickedUpAt: null,
    deliveredAt: null,
    proofDataUrl: null,
    proofKind: null,
    weightKg: 10,
    foodBankReceivedAt: null,
  };
  const picked: Donation = {
    ...donor,
    donationId: "DON-DEMO-PICKUP",
    foodType: "Fresh produce",
    quantity: 6,
    expiryDateTime: later,
    pickupWindow: window,
    status: "picked_up",
    urgent: false,
    lines: [{ foodType: "Fresh produce", quantity: 6, expiryDateTime: later }],
    splitAcrossBanks: false,
    matchId: "MAT-DEMO-PICKUP",
    foodBankId: "fb-thonburi",
    driverId: "usr-driver-1",
    pickedUpAt: now,
    deliveredAt: null,
    proofDataUrl: null,
    proofKind: null,
    weightKg: 6,
    foodBankReceivedAt: null,
  };
  const delivered: Donation = {
    ...donor,
    donationId: "DON-DEMO-DONE",
    foodType: "Prepared meals",
    quantity: 20,
    expiryDateTime: later,
    pickupWindow: window,
    status: "delivered",
    urgent: false,
    lines: [{ foodType: "Prepared meals", quantity: 20, expiryDateTime: later }],
    splitAcrossBanks: false,
    matchId: "MAT-DEMO-DONE",
    foodBankId: "fb-sos-bkk",
    driverId: "usr-driver-1",
    pickedUpAt: hoursFromNow(-3),
    deliveredAt: hoursFromNow(-1),
    proofDataUrl: proof,
    proofKind: "signature",
    weightKg: 20,
    foodBankReceivedAt: now,
    foodBankReceivedBy: "usr-foodbank-1",
  };
  const urgent: Donation = {
    ...donor,
    donationId: "DON-DEMO-URGENT",
    foodType: "Dairy",
    quantity: 4,
    expiryDateTime: soon,
    pickupWindow: window,
    status: "matched",
    urgent: true,
    lines: [{ foodType: "Dairy", quantity: 4, expiryDateTime: soon }],
    splitAcrossBanks: false,
    matchId: "MAT-DEMO-URGENT",
    foodBankId: "fb-thonburi",
    driverId: null,
    pickedUpAt: null,
    deliveredAt: null,
    proofDataUrl: null,
    proofKind: null,
    weightKg: 4,
    foodBankReceivedAt: null,
  };
  const split: Donation = {
    ...donor,
    donationId: "DON-DEMO-SPLIT",
    foodType: "Bakery, Dairy",
    quantity: 190,
    expiryDateTime: later,
    pickupWindow: window,
    status: "matched",
    urgent: false,
    lines: [
      { foodType: "Bakery", quantity: 100, expiryDateTime: later },
      { foodType: "Dairy", quantity: 90, expiryDateTime: later },
    ],
    splitAcrossBanks: true,
    matchId: "MAT-DEMO-SPLIT-SOS",
    foodBankId: "fb-sos-bkk",
    driverId: null,
    pickedUpAt: null,
    deliveredAt: null,
    proofDataUrl: null,
    proofKind: null,
    weightKg: 190,
    foodBankReceivedAt: null,
  };

  const banks = base.foodBanks.map((bank) => ({ ...bank }));
  const sos = banks.find((bank) => bank.id === "fb-sos-bkk");
  const thonburi = banks.find((bank) => bank.id === "fb-thonburi");
  if (sos) sos.remainingCapacityKg = 0;
  if (thonburi) thonburi.remainingCapacityKg = 31;

  const match = (
    id: string,
    donationId: string,
    foodBankId: string,
    foodBankName: string,
    quantityKg: number,
    distanceKm: number,
  ): Match => ({
    id,
    donationId,
    foodBankId,
    foodBankName,
    proposedAt: now,
    distanceKm,
    proximityScore: 0.8,
    capacityScore: 1,
    totalScore: 0.86,
    withinRange: true,
    hasCapacity: true,
    quantityKg,
  });

  return {
    ...base,
    foodBanks: banks,
    donations: [split, urgent, delivered, picked, matched, queued],
    matches: [
      match("MAT-DEMO-MATCH", "DON-DEMO-MATCH", "fb-sos-bkk", "SOS Food Bank Bangkok", 10, 3.66),
      match("MAT-DEMO-PICKUP", "DON-DEMO-PICKUP", "fb-thonburi", "Thonburi Shelter Pantry", 6, 5.13),
      match("MAT-DEMO-DONE", "DON-DEMO-DONE", "fb-sos-bkk", "SOS Food Bank Bangkok", 20, 3.66),
      match("MAT-DEMO-URGENT", "DON-DEMO-URGENT", "fb-thonburi", "Thonburi Shelter Pantry", 4, 5.13),
      match("MAT-DEMO-SPLIT-SOS", "DON-DEMO-SPLIT", "fb-sos-bkk", "SOS Food Bank Bangkok", 134, 3.66),
      match("MAT-DEMO-SPLIT-THB", "DON-DEMO-SPLIT", "fb-thonburi", "Thonburi Shelter Pantry", 56, 5.13),
    ],
    receipts: [
      {
        id: "RCP-DEMO-DONE",
        donationId: "DON-DEMO-DONE",
        donorId: "usr-donor-1",
        donorEmail: "donor@qwerty.test",
        foodType: "Prepared meals",
        weightKg: 20,
        timestamp: hoursFromNow(-1),
        emailedTo: "donor@qwerty.test",
        emailStatus: "sent",
      },
    ],
    notifications: [
      {
        id: "NTF-DEMO-STAFF",
        donationId: "DON-DEMO-URGENT",
        audience: "staff",
        thresholdHours: 24,
        message: "Dairy (DON-DEMO-URGENT) is urgent — 24 hours or less remain before expiry.",
        createdAt: now,
        read: false,
      },
      {
        id: "NTF-DEMO-DRIVER",
        donationId: "DON-DEMO-URGENT",
        audience: "driver",
        thresholdHours: 24,
        message: "Dairy (DON-DEMO-URGENT) is urgent — 24 hours or less remain before expiry.",
        createdAt: now,
        read: false,
      },
    ],
  };
}

function withShowcase(data: Database): Database {
  if (data.donations.some((item) => item.donationId.startsWith("DON-DEMO-"))) return data;
  const demo = showcaseDb();
  return { ...demo, sessions: data.sessions };
}

function activeDb(): Database | undefined {
  return requestDb.getStore() ?? memory.__qwertyDb;
}

function loadDb(): Database {
  const current = activeDb();
  if (current) return current;
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
  if (requestDb.getStore()) return;
  const body = JSON.stringify(loadDb(), null, 2);
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      mkdirSync(path.dirname(DB_PATH), { recursive: true });
      writeFileSync(DB_PATH, body, "utf8");
      return;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "EROFS" || code === "EACCES" || code === "ENOENT") return;
      if ((code !== "EBUSY" && code !== "EPERM") || attempt === 5) return;
      const until = Date.now() + 25 * (attempt + 1);
      while (Date.now() < until) {
        /* wait for Windows to release db.json */
      }
    }
  }
}

function db(): Database {
  return loadDb();
}

async function readShared(): Promise<{ data: Database; etag: string | null }> {
  const { get } = await import("@vercel/blob");
  const result = await get(SHARED_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return { data: showcaseDb(), etag: null };
  const text = await new Response(result.stream).text();
  if (!text) return { data: showcaseDb(), etag: null };
  return { data: withShowcase(JSON.parse(text) as Database), etag: result.blob.etag };
}

async function writeShared(data: Database, etag: string | null): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(SHARED_PATH, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    ...(etag ? { ifMatch: etag } : {}),
  });
}

function byId<T>(items: T[], idOf: (item: T) => string, incoming: T[]): T[] {
  const merged = new Map(items.map((item) => [idOf(item), item]));
  for (const item of incoming) merged.set(idOf(item), item);
  return [...merged.values()];
}

function mergeShared(current: Database, incoming: Database): Database {
  return {
    users: incoming.users.length ? incoming.users : current.users,
    foodBanks: incoming.foodBanks,
    donations: byId(current.donations, (item) => item.donationId, incoming.donations),
    matches: byId(current.matches, (item) => item.id, incoming.matches),
    receipts: byId(current.receipts, (item) => item.id, incoming.receipts),
    notifications: byId(current.notifications, (item) => item.id, incoming.notifications),
    sessions: byId(current.sessions, (item) => item.token, incoming.sessions),
    driverPings: byId(current.driverPings, (item) => item.driverId, incoming.driverPings),
    idempotency: { ...current.idempotency, ...incoming.idempotency },
  };
}

/** One shared database for every role when the app is running on Vercel. */
export async function usingStore<T>(fn: () => Promise<T> | T): Promise<T> {
  if (!usesSharedStore()) return fn();
  const loaded = await readShared();
  const before = JSON.stringify(loaded.data);
  const result = await requestDb.run(loaded.data, async () => fn());
  if (JSON.stringify(loaded.data) === before) return result;

  let pending = loaded.data;
  let etag = loaded.etag;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      await writeShared(pending, etag);
      return result;
    } catch {
      const latest = await readShared();
      pending = mergeShared(latest.data, pending);
      etag = latest.etag;
    }
  }
  await writeShared(pending, null);
  return result;
}

/** Restores the demo seed so Sprint 1 QA and the Friday demo start with capacity. */
export function resetDemoData(): void {
  const fresh = emptyDb();
  const current = requestDb.getStore();
  if (current) {
    current.users = fresh.users;
    current.foodBanks = fresh.foodBanks;
    current.donations = fresh.donations;
    current.matches = fresh.matches;
    current.receipts = fresh.receipts;
    current.notifications = fresh.notifications;
    current.sessions = fresh.sessions;
    current.driverPings = fresh.driverPings;
    current.idempotency = fresh.idempotency;
    return;
  }
  memory.__qwertyDb = fresh;
  persist();
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

function normalizeDonation(donation: Donation): Donation {
  if (!Array.isArray(donation.lines) || donation.lines.length === 0) {
    donation.lines = [
      {
        foodType: donation.foodType,
        quantity: donation.quantity,
        expiryDateTime: donation.expiryDateTime,
      },
    ];
  }
  if (typeof donation.splitAcrossBanks !== "boolean") donation.splitAcrossBanks = false;
  if (!Array.isArray(donation.declinedFoodBankIds)) donation.declinedFoodBankIds = [];
  if (typeof donation.foodBankReceivedAt !== "string") donation.foodBankReceivedAt = null;
  if (typeof donation.foodBankReceivedBy !== "string") donation.foodBankReceivedBy = null;
  for (const match of db().matches) {
    if (match.donationId !== donation.donationId || typeof match.quantityKg === "number") continue;
    match.quantityKg = match.id === donation.matchId ? donation.quantity : 0;
  }
  return donation;
}

function refreshDonationFlags(donation: Donation): Donation {
  normalizeDonation(donation);
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

function matchesFor(donationId: string): Match[] {
  const donation = db().donations.find((item) => item.donationId === donationId);
  const rows = db().matches.filter((item) => item.donationId === donationId);
  if (!donation?.matchId) return rows;
  return [...rows].sort((a, b) => Number(b.id === donation.matchId) - Number(a.id === donation.matchId));
}

function duplicateResult(donation: Donation) {
  const refreshed = refreshDonationFlags(donation);
  const matches = matchesFor(refreshed.donationId);
  return {
    donation: refreshed,
    duplicate: true as const,
    match: matches[0] ?? getMatch(refreshed.matchId),
    matches,
  };
}

function releaseMatches(donation: Donation) {
  for (const match of db().matches.filter((item) => item.donationId === donation.donationId)) {
    const foodBank = db().foodBanks.find((item) => item.id === match.foodBankId);
    if (!foodBank) continue;
    const kg = typeof match.quantityKg === "number" ? match.quantityKg : donation.quantity;
    foodBank.remainingCapacityKg = Number((foodBank.remainingCapacityKg + kg).toFixed(2));
  }
  db().matches = db().matches.filter((item) => item.donationId !== donation.donationId);
  donation.matchId = null;
  donation.foodBankId = null;
}

function banksForMatching(donation: Donation): FoodBank[] {
  const skipped = new Set(donation.declinedFoodBankIds ?? []);
  return db().foodBanks.filter((bank) => !skipped.has(bank.id));
}

function placeMatches(donation: Donation): Match[] {
  const matches = proposeMatches(donation, banksForMatching(donation));
  donation.matchId = null;
  donation.foodBankId = null;
  if (!matches.length) {
    if (donation.status !== "expired") donation.status = "queued";
    return [];
  }
  db().matches.unshift(...matches);
  for (const match of matches) {
    const foodBank = db().foodBanks.find((item) => item.id === match.foodBankId);
    if (!foodBank) continue;
    foodBank.remainingCapacityKg = Number(
      Math.max(0, foodBank.remainingCapacityKg - match.quantityKg).toFixed(2),
    );
  }
  donation.matchId = matches[0].id;
  donation.foodBankId = matches[0].foodBankId;
  donation.status = "matched";
  return matches;
}

export function ingestDonation(input: {
  message: DonationLog | (Omit<import("./types").DonationMessage, "donorId"> & { donorId?: string });
  donor: PublicUser;
  idempotencyKey?: string | null;
  lines?: DonationLine[];
  splitAcrossBanks?: boolean;
}): { donation: Donation; duplicate: boolean; match: Match | null; matches: Match[] } {
  refreshAll();
  const data = db();

  const idempotencyKey = input.idempotencyKey;
  if (idempotencyKey && data.idempotency[idempotencyKey]) {
    const existingId = data.idempotency[idempotencyKey];
    const existing = data.donations.find((item) => item.donationId === existingId);
    if (existing) return duplicateResult(existing);
  }

  const requestedId = input.message.donationId;
  if (requestedId) {
    const existing = data.donations.find((item) => item.donationId === requestedId);
    if (existing) return duplicateResult(existing);
  }

  const lines =
    input.lines ??
    ("lines" in input.message && input.message.lines?.length
      ? input.message.lines
      : [
          {
            foodType: input.message.foodType,
            quantity: input.message.quantity,
            expiryDateTime: input.message.expiryDateTime,
          },
        ]);
  const splitAcrossBanks =
    input.splitAcrossBanks ??
    ("splitAcrossBanks" in input.message ? input.message.splitAcrossBanks === true : false);

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
    lines,
    splitAcrossBanks,
    matchId: null,
    foodBankId: null,
    driverId: null,
    pickedUpAt: null,
    deliveredAt: null,
    proofDataUrl: null,
    proofKind: null,
    weightKg: input.message.quantity,
    idempotencyKey: input.idempotencyKey ?? null,
    declinedFoodBankIds: [],
    foodBankReceivedAt: null,
    foodBankReceivedBy: null,
  };
  refreshDonationFlags(donation);
  data.donations.unshift(donation);
  if (input.idempotencyKey) {
    data.idempotency[input.idempotencyKey] = donationId;
  }

  const matches = placeMatches(donation);
  persist();
  return { donation, duplicate: false, match: matches[0] ?? null, matches };
}

export function updateDonation(
  donationId: string,
  donor: PublicUser,
  log: DonationLog,
):
  | { donation: Donation; match: Match | null; matches: Match[] }
  | { error: string; status: 403 | 404 | 409 } {
  refreshAll();
  const donation = db().donations.find((item) => item.donationId === donationId);
  if (!donation) return { error: "Donation not found.", status: 404 };
  if (donation.donorId !== donor.id) {
    return { error: "You can edit only your own donation.", status: 403 };
  }
  if (donation.status === "picked_up" || donation.status === "delivered") {
    return { error: "This donation can be edited only before it is picked up.", status: 409 };
  }

  releaseMatches(donation);
  donation.foodType = log.foodType;
  donation.quantity = log.quantity;
  donation.expiryDateTime = log.expiryDateTime;
  donation.pickupWindow = log.pickupWindow;
  donation.lines = log.lines;
  donation.splitAcrossBanks = log.splitAcrossBanks;
  donation.weightKg = log.quantity;
  donation.declinedFoodBankIds = [];
  donation.foodBankReceivedAt = null;
  donation.foodBankReceivedBy = null;
  donation.status = "queued";
  refreshDonationFlags(donation);
  const matches = placeMatches(donation);
  persist();
  return { donation, match: matches[0] ?? null, matches };
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
      donorId: donation.donorId,
      urgent: donation.urgent,
      status: donation.status,
      queuedAt: donation.queuedAt,
      donorName: donation.donorName,
      matchId: donation.matchId,
      foodBankId: donation.foodBankId,
      timezone: donation.timezone,
      lines: donation.lines,
      splitAcrossBanks: donation.splitAcrossBanks,
    }));
}

export function matchesForDonation(donationId: string): Match[] {
  return matchesFor(donationId);
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

export function markPickedUp(
  donationId: string,
  driver: PublicUser,
): { ok: true; donation: Donation } | { ok: false; error: string; status: 404 | 409 } {
  const donation = getDonation(donationId);
  if (!donation) return { ok: false, error: "Donation not found.", status: 404 };
  if (donation.status !== "matched") {
    return { ok: false, error: "Only a matched donation can be marked picked up.", status: 409 };
  }
  donation.status = "picked_up";
  donation.driverId = driver.id;
  donation.pickedUpAt = nowIso();
  persist();
  return { ok: true, donation };
}

export function markDelivered(input: {
  donationId: string;
  driver: PublicUser;
  proofDataUrl: string;
  proofKind: "photo" | "signature";
  weightKg?: number;
}) {
  const donation = getDonation(input.donationId);
  if (!donation) return { ok: false as const, error: "Donation not found.", status: 404 as const };
  if (donation.status !== "picked_up") {
    return {
      ok: false as const,
      error: "Only a picked-up donation can be marked delivered.",
      status: 409 as const,
    };
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
  return { ok: true as const, donation, receipt };
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
    note: "Perishable foods are scored higher. This is an estimate, not a trained model.",
  };
}

function roundKg(value: number): number {
  return Math.round(value * 100) / 100;
}

export function updateFoodBankCapacity(
  foodBankId: string,
  user: PublicUser,
  input: { reportedCapacityKg?: number; remainingCapacityKg?: number; deliveryRangeKm?: number },
): { ok: true; foodBank: FoodBank } | { ok: false; error: string; status: 400 | 403 | 404 } {
  if (user.role !== "foodbank" && user.role !== "logistics") {
    return { ok: false, error: "Only a food bank or logistics can update capacity.", status: 403 };
  }
  const foodBank = db().foodBanks.find((item) => item.id === foodBankId);
  if (!foodBank) return { ok: false, error: "Food bank not found.", status: 404 };
  if (user.role === "foodbank" && foodBank.userId !== user.id) {
    return { ok: false, error: "You can update only your own food bank.", status: 403 };
  }
  const reported = input.reportedCapacityKg ?? foodBank.reportedCapacityKg;
  const remaining = input.remainingCapacityKg ?? foodBank.remainingCapacityKg;
  const range = input.deliveryRangeKm ?? foodBank.deliveryRangeKm;
  if (![reported, remaining, range].every((value) => Number.isFinite(value))) {
    return { ok: false, error: "Capacity and range must be numbers.", status: 400 };
  }
  if (reported < 0.1 || reported > 5000) {
    return { ok: false, error: "Reported capacity must be between 0.1 and 5000 kg.", status: 400 };
  }
  if (remaining < 0 || remaining > reported) {
    return { ok: false, error: "Remaining capacity cannot exceed the reported capacity.", status: 400 };
  }
  if (range < 1 || range > 200) {
    return { ok: false, error: "Delivery range must be between 1 and 200 km.", status: 400 };
  }
  foodBank.reportedCapacityKg = roundKg(reported);
  foodBank.remainingCapacityKg = roundKg(remaining);
  foodBank.deliveryRangeKm = roundKg(range);
  persist();
  return { ok: true, foodBank };
}

export function declineMatchedDonation(
  donationId: string,
  user: PublicUser,
): { ok: true; donation: Donation; match: Match | null; matches: Match[] } | { ok: false; error: string; status: 403 | 404 | 409 } {
  if (user.role !== "foodbank" && user.role !== "logistics") {
    return { ok: false, error: "Only a food bank or logistics can decline a match.", status: 403 };
  }
  const donation = getDonation(donationId);
  if (!donation) return { ok: false, error: "Donation not found.", status: 404 };
  if (donation.status !== "matched") {
    return { ok: false, error: "Only a matched donation can be declined.", status: 409 };
  }
  const matchedBanks = db().matches.filter((item) => item.donationId === donationId);
  if (user.role === "foodbank") {
    const owns = matchedBanks.some((match) => {
      const bank = db().foodBanks.find((item) => item.id === match.foodBankId);
      return bank?.userId === user.id;
    });
    if (!owns) return { ok: false, error: "This match is not for your food bank.", status: 403 };
  }
  donation.declinedFoodBankIds = [
    ...new Set([...donation.declinedFoodBankIds, ...matchedBanks.map((match) => match.foodBankId)]),
  ];
  releaseMatches(donation);
  donation.status = "queued";
  const matches = placeMatches(donation);
  persist();
  return { ok: true, donation, match: matches[0] ?? null, matches };
}

export function rematchDonation(
  donationId: string,
  user: PublicUser,
): { ok: true; donation: Donation; match: Match | null; matches: Match[] } | { ok: false; error: string; status: 403 | 404 | 409 } {
  if (user.role !== "logistics") {
    return { ok: false, error: "Only logistics can run matching again.", status: 403 };
  }
  const donation = getDonation(donationId);
  if (!donation) return { ok: false, error: "Donation not found.", status: 404 };
  if (donation.status !== "queued" && donation.status !== "matched") {
    return { ok: false, error: "Matching can run again only before pickup.", status: 409 };
  }
  if (donation.status === "matched") releaseMatches(donation);
  donation.status = "queued";
  const matches = placeMatches(donation);
  persist();
  return { ok: true, donation, match: matches[0] ?? null, matches };
}

export function confirmFoodBankReceipt(
  donationId: string,
  user: PublicUser,
): { ok: true; donation: Donation } | { ok: false; error: string; status: 403 | 404 | 409 } {
  if (user.role !== "foodbank" && user.role !== "logistics") {
    return { ok: false, error: "Only a food bank or logistics can confirm receipt.", status: 403 };
  }
  const donation = getDonation(donationId);
  if (!donation) return { ok: false, error: "Donation not found.", status: 404 };
  if (donation.status !== "delivered") {
    return { ok: false, error: "Confirm receipt only after the driver marks the donation delivered.", status: 409 };
  }
  if (!donation.foodBankReceivedAt) {
    donation.foodBankReceivedAt = nowIso();
    donation.foodBankReceivedBy = user.id;
    persist();
  }
  return { ok: true, donation };
}

export function markNotificationRead(
  notificationId: string,
  user: PublicUser,
): { ok: true; notification: Notification } | { ok: false; error: string; status: 403 | 404 } {
  const notification = db().notifications.find((item) => item.id === notificationId);
  if (!notification) return { ok: false, error: "Notification not found.", status: 404 };
  if (user.role === "driver" && notification.audience !== "driver") {
    return { ok: false, error: "Drivers can mark only driver alerts as read.", status: 403 };
  }
  notification.read = true;
  persist();
  return { ok: true, notification };
}
