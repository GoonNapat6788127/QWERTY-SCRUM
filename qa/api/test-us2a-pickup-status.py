"""US2a — Track pickup status.

Product backlog: Given a matched donation, when a driver marks it Picked Up,
then the timestamp and driver ID are recorded and visible to the food bank.

Standup: Meeting 5 starts the pickup endpoint (Day 8, 2 of 4 hours).
Meeting 6 (Fri 23 Oct) reports this QA card done (Day 10, 2 hours).
Owners: Sirapassorn (pickup endpoint), Pratanin (incoming view), Sakkaraj (QA).
"""

from __future__ import annotations

from helpers import BASE_URL, create_donation, donor, driver, foodbank


def test_pickup_records_driver_and_is_visible_to_food_bank():
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
