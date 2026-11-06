"""US4b — TC-US4b-01 through TC-US4b-05."""

from __future__ import annotations

from helpers import BASE_URL, PROOF, create_donation, donor, driver, foodbank


def _activity():
    response = foodbank().get(f"{BASE_URL}/api/drivers/activity", timeout=10)
    assert response.status_code == 200, response.text
    return response.json()["drivers"]


def test_tc_us4b_01_activity_counts():
    row = next(item for item in _activity() if item["driverId"] == "usr-driver-1")
    for key in ("accepted", "pickedUp", "delivered"):
        assert key in row


def test_tc_us4b_02_run_row_has_the_donation():
    donation_id = create_donation(donor(), quantity=4)["donation"]["donationId"]
    assert driver().post(f"{BASE_URL}/api/pickup", json={"donationId": donation_id}, timeout=10).status_code == 200
    row = next(item for item in _activity() if item["driverId"] == "usr-driver-1")
    assert any(run["donationId"] == donation_id for run in row["runs"])


def test_tc_us4b_03_activity_page_fields():
    row = next(item for item in _activity() if item["driverId"] == "usr-driver-1")
    assert row["name"]
    assert isinstance(row["accepted"], int)
    assert isinstance(row["pickedUp"], int)
    assert isinstance(row["delivered"], int)


def test_tc_us4b_04_delivered_count():
    donation_id = create_donation(donor(), quantity=4)["donation"]["donationId"]
    driver_session = driver()
    assert driver_session.post(f"{BASE_URL}/api/pickup", json={"donationId": donation_id}, timeout=10).status_code == 200
    assert driver_session.post(
        f"{BASE_URL}/api/delivery",
        json={"donationId": donation_id, "proofKind": "signature", "proofDataUrl": PROOF},
        timeout=10,
    ).status_code == 200
    row = next(item for item in _activity() if item["driverId"] == "usr-driver-1")
    assert row["delivered"] >= 1


def test_tc_us4b_05_qa_after_pickup_and_delivery():
    donation_id = create_donation(donor(), quantity=3)["donation"]["donationId"]
    driver_session = driver()
    assert driver_session.post(f"{BASE_URL}/api/pickup", json={"donationId": donation_id}, timeout=10).status_code == 200
    assert driver_session.post(
        f"{BASE_URL}/api/delivery",
        json={"donationId": donation_id, "proofKind": "signature", "proofDataUrl": PROOF},
        timeout=10,
    ).status_code == 200
    row = next(item for item in _activity() if item["driverId"] == "usr-driver-1")
    assert any(run["donationId"] == donation_id and run["status"] == "delivered" for run in row["runs"])
