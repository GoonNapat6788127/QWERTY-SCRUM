"""Sprint 1 remaining stories: US1b, US6, US2a, US2b, US5a, US3a."""

from __future__ import annotations

import time
from datetime import datetime

from helpers import BASE_URL, PROOF, donor, driver, foodbank, future_expiry, valid_payload


def create_donation(session, **overrides):
    payload = valid_payload(**overrides)
    response = session.post(f"{BASE_URL}/api/donations", json=payload, timeout=10)
    assert response.status_code == 201, response.text
    return response.json()


def test_us1b_match_within_two_minutes_when_in_range_with_capacity():
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


def test_us1b_no_match_when_quantity_exceeds_all_capacity():
    body = create_donation(donor(), quantity=4000)
    assert body["match"] is None
    assert body["donation"]["status"] == "queued"


def test_us1b_rankings_include_proximity_and_capacity():
    body = create_donation(donor(), quantity=8)
    donation_id = body["donation"]["donationId"]
    session = donor()
    scored = session.get(f"{BASE_URL}/api/matches", params={"donationId": donation_id}, timeout=10)
    assert scored.status_code == 200, scored.text
    rankings = scored.json()["rankings"]
    assert rankings
    assert "proximityScore" in rankings[0]
    assert "capacityScore" in rankings[0]
    assert "distanceKm" in rankings[0]


def test_us6_pickup_window_attached_and_on_dispatch_feed():
    window = {"start": future_expiry(60), "end": future_expiry(180)}
    body = create_donation(donor(), pickupWindow=window)
    donation = body["donation"]
    assert donation["pickupWindow"]["start"]
    assert donation["pickupWindow"]["end"]
    feed = driver().get(f"{BASE_URL}/api/dispatch", timeout=10)
    assert feed.status_code == 200, feed.text
    item = next(row for row in feed.json()["feed"] if row["donationId"] == donation["donationId"])
    assert item["pickupWindow"]["start"] == donation["pickupWindow"]["start"]


def test_us2a_pickup_records_driver_and_is_visible_to_food_bank():
    donation_id = create_donation(donor(), quantity=5)["donation"]["donationId"]
    pickup = driver().post(f"{BASE_URL}/api/pickup", json={"donationId": donation_id}, timeout=10)
    assert pickup.status_code == 200, pickup.text
    data = pickup.json()["pickup"]
    assert data["driverId"] == "usr-driver-1"
    assert data["pickedUpAt"]
    incoming = foodbank().get(f"{BASE_URL}/api/incoming", timeout=10)
    assert incoming.status_code == 200, incoming.text
    row = next(item for item in incoming.json()["incoming"] if item["donationId"] == donation_id)
    assert row["driverId"] == "usr-driver-1"
    assert row["pickedUpAt"] == data["pickedUpAt"]
    assert row["status"] == "picked_up"


def test_us2b_delivery_requires_proof_then_attaches_it():
    donation_id = create_donation(donor(), quantity=6)["donation"]["donationId"]
    driver_session = driver()
    assert driver_session.post(f"{BASE_URL}/api/pickup", json={"donationId": donation_id}, timeout=10).status_code == 200
    rejected = driver_session.post(
        f"{BASE_URL}/api/delivery",
        json={"donationId": donation_id, "proofKind": "signature"},
        timeout=10,
    )
    assert rejected.status_code == 400
    delivered = driver_session.post(
        f"{BASE_URL}/api/delivery",
        json={
            "donationId": donation_id,
            "proofKind": "signature",
            "proofDataUrl": PROOF,
            "weightKg": 6,
        },
        timeout=10,
    )
    assert delivered.status_code == 200, delivered.text
    donation = delivered.json()["donation"]
    assert donation["status"] == "delivered"
    assert donation["deliveredAt"]
    assert donation["proofKind"] == "signature"
    assert donation["proofDataUrl"]
    incoming = foodbank().get(f"{BASE_URL}/api/incoming", timeout=10)
    assert incoming.status_code == 200, incoming.text
    row = next(item for item in incoming.json()["incoming"] if item["donationId"] == donation_id)
    assert row["deliveredAt"] == donation["deliveredAt"]
    assert row["proofKind"] == "signature"
    assert row["proofDataUrl"]


def test_us5a_receipt_has_weight_food_type_timestamp_and_email():
    donation_id = create_donation(donor(), foodType="Bakery", quantity=7)["donation"]["donationId"]
    driver_session = driver()
    driver_session.post(f"{BASE_URL}/api/pickup", json={"donationId": donation_id}, timeout=10)
    delivered = driver_session.post(
        f"{BASE_URL}/api/delivery",
        json={"donationId": donation_id, "proofKind": "photo", "proofDataUrl": PROOF, "weightKg": 7.2},
        timeout=10,
    )
    assert delivered.status_code == 200, delivered.text
    receipt = delivered.json()["receipt"]
    assert receipt["foodType"] == "Bakery"
    assert receipt["weightKg"] == 7.2
    assert receipt["timestamp"]
    assert receipt["emailedTo"] == "donor@qwerty.test"
    assert receipt["emailStatus"] == "sent"
    listed = donor().get(f"{BASE_URL}/api/receipts", timeout=10)
    ids = {item["id"] for item in listed.json()["receipts"]}
    assert receipt["id"] in ids


def test_us3a_expiry_within_24_hours_is_flagged_urgent():
    body = create_donation(donor(), expiryDateTime=future_expiry(12 * 60))
    assert body["donation"]["urgent"] is True
    queue = donor().get(f"{BASE_URL}/api/queue", timeout=10).json()["items"]
    row = next(item for item in queue if item["donationId"] == body["donation"]["donationId"])
    assert row["urgent"] is True
