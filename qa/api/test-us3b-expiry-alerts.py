"""US3b — TC-US3b-01, TC-US3b-02, TC-US3b-03, TC-US3b-04."""

from __future__ import annotations

from helpers import BASE_URL, create_donation, donor, future_expiry


def _urgent_donation():
    return create_donation(donor(), expiryDateTime=future_expiry(20 * 60))


def test_tc_us3b_01_staff_alert_at_24_hours():
    donation_id = _urgent_donation()["donation"]["donationId"]
    notes = donor().get(f"{BASE_URL}/api/notifications", timeout=10).json()["notifications"]
    staff = [item for item in notes if item["donationId"] == donation_id and item["thresholdHours"] == 24 and item["audience"] == "staff"]
    assert len(staff) == 1


def test_tc_us3b_02_driver_alert_at_the_same_threshold():
    donation_id = _urgent_donation()["donation"]["donationId"]
    notes = donor().get(f"{BASE_URL}/api/notifications", timeout=10).json()["notifications"]
    drivers = [item for item in notes if item["donationId"] == donation_id and item["thresholdHours"] == 24 and item["audience"] == "driver"]
    assert len(drivers) == 1


def test_tc_us3b_03_no_duplicate_alert():
    donation_id = _urgent_donation()["donation"]["donationId"]
    session = donor()
    session.get(f"{BASE_URL}/api/donations/{donation_id}", timeout=10)
    notes = session.get(f"{BASE_URL}/api/notifications", timeout=10).json()["notifications"]
    rows = [item for item in notes if item["donationId"] == donation_id and item["thresholdHours"] == 24]
    assert len(rows) == 2


def test_tc_us3b_04_alerts_page_renders_the_row():
    donation_id = _urgent_donation()["donation"]["donationId"]
    notes = donor().get(f"{BASE_URL}/api/notifications", timeout=10).json()["notifications"]
    row = next(item for item in notes if item["donationId"] == donation_id and item["audience"] == "staff")
    assert row["thresholdHours"] == 24
    assert donation_id in row["message"]
