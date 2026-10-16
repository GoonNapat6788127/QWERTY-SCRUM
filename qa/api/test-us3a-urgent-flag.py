"""US3a — Flag a donation that expires within 24 hours.

Product backlog: Given a logged donation, when its expiry is within 24 hours,
then it is flagged urgent in the matching queue.

Standup: Meeting 6 (Fri 23 Oct) reports this QA card done (Days 13–14, 3 hours).
Owners: Jirathiwat (expiry monitor), Sakkaraj (QA).
"""

from __future__ import annotations

from helpers import BASE_URL, create_donation, donor, future_expiry


def test_expiry_within_24_hours_is_flagged_urgent():
    body = create_donation(donor(), expiryDateTime=future_expiry(12 * 60))
    assert body["donation"]["urgent"] is True
    queue = donor().get(f"{BASE_URL}/api/queue", timeout=10).json()["items"]
    row = next(item for item in queue if item["donationId"] == body["donation"]["donationId"])
    assert row["urgent"] is True


def test_expiry_beyond_24_hours_is_not_urgent():
    body = create_donation(donor(), expiryDateTime=future_expiry(48 * 60))
    assert body["donation"]["urgent"] is False
    queue = donor().get(f"{BASE_URL}/api/queue", timeout=10).json()["items"]
    row = next(item for item in queue if item["donationId"] == body["donation"]["donationId"])
    assert row["urgent"] is False
