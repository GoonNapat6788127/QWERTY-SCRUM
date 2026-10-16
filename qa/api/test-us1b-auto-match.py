"""US1b — Auto-match a donation to a food bank.

Product backlog: Given an open donation, when a food bank within delivery range
has reported capacity, then the system proposes a match within 2 minutes.

Standup: Meeting 4 (Mon 19 Oct) starts proximity, capacity, and integration.
Meeting 5 (Wed 21 Oct) reports this QA card done (Days 5–7, 8 hours).
Owners: Sirapassorn (proximity), Jirathiwat (capacity), Pratanin (integrate), Sakkaraj (QA).
"""

from __future__ import annotations

import time
from datetime import datetime

from helpers import BASE_URL, create_donation, donor


def test_match_within_two_minutes_when_in_range_with_capacity():
    started = time.perf_counter()
    body = create_donation(donor(), quantity=10)
    elapsed = time.perf_counter() - started
    assert body["match"] is not None, body
    assert body["match"]["withinRange"] is True
    assert body["match"]["hasCapacity"] is True
    assert body["donation"]["status"] == "matched"
    created = datetime.fromisoformat(body["donation"]["createdAt"].replace("Z", "+00:00"))
    proposed = datetime.fromisoformat(body["match"]["proposedAt"].replace("Z", "+00:00"))
    assert (proposed - created).total_seconds() < 120
    assert elapsed < 120


def test_no_match_when_quantity_exceeds_all_capacity():
    body = create_donation(donor(), quantity=4000)
    assert body["match"] is None
    assert body["donation"]["status"] == "queued"


def test_rankings_include_proximity_and_capacity():
    body = create_donation(donor(), quantity=8)
    donation_id = body["donation"]["donationId"]
    scored = donor().get(f"{BASE_URL}/api/matches", params={"donationId": donation_id}, timeout=10)
    assert scored.status_code == 200, scored.text
    rankings = scored.json()["rankings"]
    assert rankings
    assert "proximityScore" in rankings[0]
    assert "capacityScore" in rankings[0]
    assert "distanceKm" in rankings[0]
