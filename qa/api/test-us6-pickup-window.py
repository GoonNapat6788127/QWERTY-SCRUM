"""US6 — Select a pickup time window.

Product backlog: Given a donor is logging a donation, when they choose a pickup
time window, then the window is stored on the donation and shown on the driver
dispatch feed.

Standup: Meeting 5 (Wed 21 Oct) reports this QA card done (Day 8, 3 hours).
Owners: Pratanin (UI), Jirathiwat (dispatch feed), Sakkaraj (QA).
"""

from __future__ import annotations

from helpers import BASE_URL, create_donation, donor, driver, future_expiry


def test_pickup_window_is_stored_and_shown_on_dispatch_feed():
    window = {"start": future_expiry(60), "end": future_expiry(180)}
    body = create_donation(donor(), pickupWindow=window)
    donation = body["donation"]
    assert donation["pickupWindow"]["start"]
    assert donation["pickupWindow"]["end"]
    feed = driver().get(f"{BASE_URL}/api/dispatch", timeout=10)
    assert feed.status_code == 200, feed.text
    item = next(row for row in feed.json()["feed"] if row["donationId"] == donation["donationId"])
    assert item["pickupWindow"]["start"] == donation["pickupWindow"]["start"]
