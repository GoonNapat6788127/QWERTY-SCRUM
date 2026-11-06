"""US8 — TC-US8-01, TC-US8-02, TC-US8-03."""

from __future__ import annotations

from helpers import BASE_URL, create_donation, donor


def test_tc_us8_01_decay_fields():
    donation_id = create_donation(donor(), quantity=2)["donation"]["donationId"]
    estimate = donor().get(f"{BASE_URL}/api/decay", params={"donationId": donation_id}, timeout=10).json()["estimate"]
    assert "hoursRemaining" in estimate
    assert "riskScore" in estimate


def test_tc_us8_02_label_the_spike():
    donation_id = create_donation(donor(), quantity=2)["donation"]["donationId"]
    estimate = donor().get(f"{BASE_URL}/api/decay", params={"donationId": donation_id}, timeout=10).json()["estimate"]
    assert estimate["method"] == "heuristic-spike"


def test_tc_us8_03_qa_decay_shape():
    donation_id = create_donation(donor(), quantity=2)["donation"]["donationId"]
    estimate = donor().get(f"{BASE_URL}/api/decay", params={"donationId": donation_id}, timeout=10).json()["estimate"]
    assert estimate["donationId"] == donation_id
    assert {"hoursRemaining", "riskScore", "method"} <= set(estimate)
