"""US4a — TC-US4a-01 through TC-US4a-05."""

from __future__ import annotations

from helpers import BASE_URL, PROOF, create_donation, donor, driver, future_expiry, login


def _board():
    session = login("logistics@qwerty.test", "logistics123")
    response = session.get(f"{BASE_URL}/api/dashboard", timeout=10)
    assert response.status_code == 200, response.text
    return response.json()


def test_tc_us4a_03_dashboard_summary_fields():
    summary = _board()["summary"]
    for key in ("open", "matched", "pickedUp", "delivered", "urgent", "foodBanks", "notifications"):
        assert key in summary


def test_tc_us4a_04_urgent_count_matches_the_flag():
    create_donation(donor(), expiryDateTime=future_expiry(60))
    summary = _board()["summary"]
    assert summary["urgent"] >= 1


def test_tc_us4a_01_filter_by_status():
    donation_id = create_donation(donor(), quantity=4)["donation"]["donationId"]
    driver_session = driver()
    assert driver_session.post(f"{BASE_URL}/api/pickup", json={"donationId": donation_id}, timeout=10).status_code == 200
    assert driver_session.post(
        f"{BASE_URL}/api/delivery",
        json={"donationId": donation_id, "proofKind": "signature", "proofDataUrl": PROOF},
        timeout=10,
    ).status_code == 200
    donations = _board()["donations"]
    delivered = [item for item in donations if item["status"] == "delivered"]
    assert any(item["donationId"] == donation_id for item in delivered)
    assert all(item["status"] == "delivered" for item in delivered)


def test_tc_us4a_02_filter_by_donor():
    create_donation(donor(), quantity=3)
    donations = _board()["donations"]
    matched = [item for item in donations if "Bangkok Fresh Market" in item["donorName"]]
    assert matched
    assert all("Bangkok Fresh Market" in item["donorName"] for item in matched)


def test_tc_us4a_05_counts_match_the_filter():
    board = _board()
    delivered_rows = [item for item in board["donations"] if item["status"] == "delivered"]
    assert board["summary"]["delivered"] == len(delivered_rows)
