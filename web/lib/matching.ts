import { haversineKm } from "./geo";
import type { Donation, FoodBank, Match } from "./types";
import { createId } from "./ids";
import { nowIso } from "./time";

export type MatchCandidate = {
  foodBank: FoodBank;
  distanceKm: number;
  proximityScore: number;
  capacityScore: number;
  totalScore: number;
  withinRange: boolean;
  hasCapacity: boolean;
};

export function scoreFoodBank(donation: Donation, foodBank: FoodBank): MatchCandidate {
  const distanceKm = haversineKm(
    donation.pickupLat,
    donation.pickupLng,
    foodBank.lat,
    foodBank.lng,
  );
  const withinRange = distanceKm <= foodBank.deliveryRangeKm;
  const hasCapacity = foodBank.remainingCapacityKg >= donation.quantity;
  const proximityScore = withinRange
    ? Math.max(0, 1 - distanceKm / foodBank.deliveryRangeKm)
    : 0;
  const capacityScore =
    foodBank.reportedCapacityKg > 0
      ? Math.min(1, foodBank.remainingCapacityKg / Math.max(donation.quantity, 0.1))
      : 0;
  const totalScore = Number((proximityScore * 0.7 + Math.min(capacityScore, 1) * 0.3).toFixed(4));
  return {
    foodBank,
    distanceKm: Number(distanceKm.toFixed(2)),
    proximityScore: Number(proximityScore.toFixed(4)),
    capacityScore: Number(Math.min(capacityScore, 1).toFixed(4)),
    totalScore,
    withinRange,
    hasCapacity,
  };
}

export function rankFoodBanks(donation: Donation, foodBanks: FoodBank[]): MatchCandidate[] {
  return foodBanks
    .map((foodBank) => scoreFoodBank(donation, foodBank))
    .sort((a, b) => b.totalScore - a.totalScore || a.distanceKm - b.distanceKm);
}

export function proposeMatch(donation: Donation, foodBanks: FoodBank[]): Match | null {
  const eligible = rankFoodBanks(donation, foodBanks).find(
    (candidate) => candidate.withinRange && candidate.hasCapacity,
  );
  if (!eligible) return null;
  return {
    id: createId("MAT"),
    donationId: donation.donationId,
    foodBankId: eligible.foodBank.id,
    foodBankName: eligible.foodBank.name,
    proposedAt: nowIso(),
    distanceKm: eligible.distanceKm,
    proximityScore: eligible.proximityScore,
    capacityScore: eligible.capacityScore,
    totalScore: eligible.totalScore,
    withinRange: eligible.withinRange,
    hasCapacity: eligible.hasCapacity,
    quantityKg: donation.quantity,
  };
}

function matchFromCandidate(
  donation: Donation,
  candidate: MatchCandidate,
  quantityKg: number,
): Match {
  return {
    id: createId("MAT"),
    donationId: donation.donationId,
    foodBankId: candidate.foodBank.id,
    foodBankName: candidate.foodBank.name,
    proposedAt: nowIso(),
    distanceKm: candidate.distanceKm,
    proximityScore: candidate.proximityScore,
    capacityScore: candidate.capacityScore,
    totalScore: candidate.totalScore,
    withinRange: true,
    hasCapacity: true,
    quantityKg,
  };
}

/** One log can stay with the best bank, or be split across every bank that has room. */
export function proposeMatches(donation: Donation, foodBanks: FoodBank[]): Match[] {
  if (!donation.splitAcrossBanks) {
    const match = proposeMatch(donation, foodBanks);
    return match ? [match] : [];
  }

  let leftover = donation.quantity;
  const planned: Match[] = [];
  for (const candidate of rankFoodBanks(donation, foodBanks)) {
    if (leftover <= 0) break;
    if (!candidate.withinRange || candidate.foodBank.remainingCapacityKg <= 0) continue;
    const take = Math.round(Math.min(candidate.foodBank.remainingCapacityKg, leftover) * 100) / 100;
    if (take <= 0) continue;
    planned.push(matchFromCandidate(donation, candidate, take));
    leftover = Math.round((leftover - take) * 100) / 100;
  }
  return leftover > 0 ? [] : planned;
}
