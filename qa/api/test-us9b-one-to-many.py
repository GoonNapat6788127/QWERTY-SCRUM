"""US9b — TC-US9b-01 through TC-US9b-07."""

from __future__ import annotations

from helpers import BASE_URL, create_donation, donor, foodbank, future_expiry, login


def _split_payload():
    return {
        "lines": [
            {"foodType": "Prepared meals", "quantity": 100, "expiryDateTime": future_expiry(300)},
            {"foodType": "Bakery", "quantity": 90, "expiryDateTime": future_expiry(400)},
        ],
        "pickupWindow": {"start": future_expiry(60), "end": future_expiry(180)},
        "splitAcrossBanks": True,
    }


def test_tc_us9b_01_second_food_on_the_same_log():
    response = donor().post(f"{BASE_URL}/api/donations", json=_split_payload(), timeout=10)
    assert response.status_code == 201, response.text
    donation = response.json()["donation"]
    assert len(donation["lines"]) == 2
    assert donation["quantity"] == 190


def test_tc_us9b_02_split_flag_is_submitted():
    response = donor().post(f"{BASE_URL}/api/donations", json=_split_payload(), timeout=10)
    assert response.status_code == 201, response.text
    assert response.json()["donation"]["splitAcrossBanks"] is True


def test_tc_us9b_03_one_bank_when_split_is_off():
    body = create_donation(donor(), quantity=10)
    assert body["match"] is not None
    assert len(body["matches"]) == 1
    assert body["donation"]["status"] == "matched"


def _fresh():
    session = login("logistics@qwerty.test", "logistics123")
    assert session.post(f"{BASE_URL}/api/test/reset", timeout=10).status_code == 200
    return login("logistics@qwerty.test", "logistics123")


def test_tc_us9b_04_split_190kg_across_banks():
    _fresh()
    response = donor().post(f"{BASE_URL}/api/donations", json=_split_payload(), timeout=10)
    assert response.status_code == 201, response.text
    body = response.json()
    assert len(body["matches"]) >= 2
    assert sum(item["quantityKg"] for item in body["matches"]) == 190


def test_tc_us9b_05_over_capacity_stays_queued():
    body = create_donation(donor(), quantity=4000)
    assert body["match"] is None
    assert body["donation"]["status"] == "queued"


def test_tc_us9b_06_capacity_drops_by_each_quantity_kg():
    session = _fresh()
    before = next(item for item in session.get(f"{BASE_URL}/api/food-banks", timeout=10).json()["foodBanks"] if item["id"] == "fb-sos-bkk")
    created = donor().post(f"{BASE_URL}/api/donations", json=_split_payload(), timeout=10)
    assert created.status_code == 201, created.text
    sos_share = next(item["quantityKg"] for item in created.json()["matches"] if item["foodBankId"] == "fb-sos-bkk")
    after = next(item for item in foodbank().get(f"{BASE_URL}/api/food-banks", timeout=10).json()["foodBanks"] if item["id"] == "fb-sos-bkk")
    assert sos_share == 164
    assert round(before["remainingCapacityKg"] - after["remainingCapacityKg"], 2) == 164


def test_tc_us9b_07_edit_gives_capacity_back():
    session = _fresh()
    owner = donor()
    created = owner.post(f"{BASE_URL}/api/donations", json=_split_payload(), timeout=10)
    assert created.status_code == 201, created.text
    donation_id = created.json()["donation"]["donationId"]
    edited = owner.patch(
        f"{BASE_URL}/api/donations/{donation_id}",
        json={
            "lines": [{"foodType": "Dairy", "quantity": 10, "expiryDateTime": future_expiry(240)}],
            "pickupWindow": created.json()["donation"]["pickupWindow"],
            "splitAcrossBanks": False,
        },
        timeout=10,
    )
    assert edited.status_code == 200, edited.text
    sos = next(item for item in session.get(f"{BASE_URL}/api/food-banks", timeout=10).json()["foodBanks"] if item["id"] == "fb-sos-bkk")
    assert sos["remainingCapacityKg"] == 154
