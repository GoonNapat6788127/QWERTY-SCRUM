"""US9a — TC-US9a-01, TC-US9a-02, TC-US9a-03, TC-US9a-04."""

from __future__ import annotations

from helpers import BASE_URL, PROOF, create_donation, donor, driver, foodbank, future_expiry


def test_tc_us9a_01_edit_before_pickup():
    session = donor()
    created = create_donation(session, foodType="Bakery", quantity=4)
    donation_id = created["donation"]["donationId"]
    edited = session.patch(
        f"{BASE_URL}/api/donations/{donation_id}",
        json={
            "lines": [{"foodType": "Dairy", "quantity": 6, "expiryDateTime": future_expiry(240)}],
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


def test_tc_us9a_02_reject_edit_after_pickup():
    session = donor()
    donation_id = create_donation(session, quantity=5)["donation"]["donationId"]
    assert driver().post(f"{BASE_URL}/api/pickup", json={"donationId": donation_id}, timeout=10).status_code == 200
    edited = session.patch(
        f"{BASE_URL}/api/donations/{donation_id}",
        json={
            "lines": [{"foodType": "Dairy", "quantity": 5, "expiryDateTime": future_expiry(240)}],
            "splitAcrossBanks": False,
        },
        timeout=10,
    )
    assert edited.status_code == 409, edited.text


def test_tc_us9a_03_reject_edit_by_another_role():
    donation_id = create_donation(donor(), quantity=4)["donation"]["donationId"]
    edited = foodbank().patch(
        f"{BASE_URL}/api/donations/{donation_id}",
        json={
            "lines": [{"foodType": "Dairy", "quantity": 4, "expiryDateTime": future_expiry(240)}],
            "splitAcrossBanks": False,
        },
        timeout=10,
    )
    assert edited.status_code == 403, edited.text


def test_tc_us9a_04_delivered_donation_is_locked():
    donation_id = create_donation(donor(), quantity=4)["donation"]["donationId"]
    driver_session = driver()
    assert driver_session.post(f"{BASE_URL}/api/pickup", json={"donationId": donation_id}, timeout=10).status_code == 200
    delivered = driver_session.post(
        f"{BASE_URL}/api/delivery",
        json={"donationId": donation_id, "proofKind": "signature", "proofDataUrl": PROOF},
        timeout=10,
    )
    assert delivered.status_code == 200, delivered.text
    assert delivered.json()["donation"]["status"] == "delivered"
    listed = donor().get(f"{BASE_URL}/api/donations", timeout=10).json()["donations"]
    row = next(item for item in listed if item["donationId"] == donation_id)
    assert row["status"] == "delivered"
