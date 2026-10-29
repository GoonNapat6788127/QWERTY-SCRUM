"""Donor edits a queued log, and one log can be sent to more than one food bank."""

from __future__ import annotations

import pytest

from helpers import BASE_URL, create_donation, donor, future_expiry, login


@pytest.fixture(scope="module", autouse=True)
def fresh_capacity():
    session = login("logistics@qwerty.test", "logistics123")
    response = session.post(f"{BASE_URL}/api/test/reset", timeout=10)
    assert response.status_code == 200, response.text


def test_donor_can_edit_a_donation_before_pickup():
    session = donor()
    created = create_donation(session, foodType="Bakery", quantity=4)
    donation_id = created["donation"]["donationId"]
    edited = session.patch(
        f"{BASE_URL}/api/donations/{donation_id}",
        json={
            "lines": [
                {"foodType": "Dairy", "quantity": 6, "expiryDateTime": future_expiry(240)},
            ],
            "pickupWindow": created["donation"]["pickupWindow"],
            "splitAcrossBanks": False,
        },
        timeout=10,
    )
    assert edited.status_code == 200, edited.text
    body = edited.json()["donation"]
    assert body["foodType"] == "Dairy"
    assert body["quantity"] == 6
    assert body["lines"][0]["foodType"] == "Dairy"


def test_one_log_can_hold_many_foods_and_split_across_banks():
    session = donor()
    # Larger than SOS remaining capacity (164 kg) and smaller than all banks together.
    payload = {
        "lines": [
            {"foodType": "Prepared meals", "quantity": 100, "expiryDateTime": future_expiry(300)},
            {"foodType": "Bakery", "quantity": 90, "expiryDateTime": future_expiry(400)},
        ],
        "pickupWindow": {
            "start": future_expiry(60),
            "end": future_expiry(180),
        },
        "splitAcrossBanks": True,
    }
    response = session.post(f"{BASE_URL}/api/donations", json=payload, timeout=10)
    assert response.status_code == 201, response.text
    body = response.json()
    assert body["donation"]["quantity"] == 190
    assert len(body["donation"]["lines"]) == 2
    assert len(body["matches"]) >= 2
    sent = sum(item["quantityKg"] for item in body["matches"])
    assert sent == 190
